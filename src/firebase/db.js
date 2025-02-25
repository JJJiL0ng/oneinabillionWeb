// src/firebase/db.js

/**
 * Firestore 데이터베이스 관련 기능을 담당하는 파일
 * 사용자 선택 데이터 저장 및 조회, 매칭 관련 기능을 제공합니다.
 */

import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    addDoc, 
    serverTimestamp,
    updateDoc,
    limit
  } from "firebase/firestore";
  import { db } from "./config";
  
  /**
   * 사용자 선택 데이터를 Firestore에 저장하는 함수
   * 
   * @param {Array} selections - 사용자의 이진 선택 배열
   * @param {Object} socialInfo - 사용자의 소셜 미디어 정보 (platform, handle)
   * @returns {Promise<String>} 생성된 사용자 문서 ID
   */
  export async function saveUserSelections(selections, socialInfo) {
    try {
      // 디버깅을 위한 로그 추가
      console.log('저장할 데이터:', {
        selections,
        socialInfo
      });

      // 데이터 유효성 검사 추가
      if (!Array.isArray(selections) || selections.length === 0) {
        throw new Error('유효하지 않은 선택 데이터');
      }

      if (!socialInfo || !socialInfo.handle || !socialInfo.platform) {
        throw new Error('유효하지 않은 소셜 정보');
      }

      // 사용자 데이터 객체 생성
      const userData = {
        choices: selections,
        socialHandle: socialInfo.handle,
        platform: socialInfo.platform,
        timestamp: serverTimestamp(),
        // 추가 디버깅 정보
        createdAt: new Date().toISOString()
      };

      // Firestore에 문서 추가
      const userRef = collection(db, "users");
      const docRef = await addDoc(userRef, userData);
      
      console.log("사용자 데이터 저장 완료, ID:", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("사용자 데이터 저장 오류:", error);
      // 에러 상세 정보 로깅
      console.error("에러 상세:", {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
  
  /**
   * 잠재적 매칭 사용자 목록을 조회하는 함수
   * 
   * @param {String} userId - 대상 사용자 ID
   * @param {Number} minSimilarity - 최소 유사도 (0-1 사이)
   * @param {Number} maxResults - 최대 결과 수
   * @returns {Promise<Array>} 매칭된 사용자 배열
   */
  export async function findPotentialMatches(userId, minSimilarity = 0.6, maxResults = 5) {
    try {
      // 대상 사용자 데이터 조회
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        throw new Error(`ID가 ${userId}인 사용자가 존재하지 않습니다.`);
      }
      
      const userData = userDoc.data();
      const userChoices = userData.choices;
      
      // 다른 모든 사용자 조회
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      
      const matches = [];
      
      // 각 사용자와의 유사도 계산
      usersSnapshot.forEach(doc => {
        // 자기 자신은 제외
        if (doc.id === userId) return;
        
        const otherUserData = doc.data();
        const otherChoices = otherUserData.choices;
        
        // 유사도 계산 (선택 일치 수 / 총 선택 수)
        let matchCount = 0;
        for (let i = 0; i < userChoices.length; i++) {
          if (i < otherChoices.length && userChoices[i] === otherChoices[i]) {
            matchCount++;
          }
        }
        
        const similarity = matchCount / userChoices.length;
        
        // 최소 유사도 이상인 경우만 결과에 추가
        if (similarity >= minSimilarity) {
          matches.push({
            userId: doc.id,
            similarity,
            socialHandle: otherUserData.socialHandle,
            platform: otherUserData.platform,
            timestamp: otherUserData.timestamp
          });
        }
      });
      
      // 유사도 내림차순으로 정렬 후 최대 결과 수 제한
      return matches
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, maxResults);
        
    } catch (error) {
      console.error("매칭 사용자 조회 오류:", error);
      throw error;
    }
  }
  
  /**
   * 매칭 결과를 Firestore에 저장하는 함수
   * 
   * @param {String} userId - 사용자 ID
   * @param {Array} matches - 매칭 결과 배열
   * @returns {Promise<void>}
   */
  export async function saveMatchResults(userId, matches) {
    try {
      const matchesRef = collection(db, "matches");
      
      // 각 매칭 결과를 저장
      for (const match of matches) {
        await addDoc(matchesRef, {
          user1: userId,
          user2: match.userId,
          similarity: match.similarity,
          status: "pending", // pending, accepted, rejected
          created: serverTimestamp()
        });
      }
      
      console.log(`사용자 ${userId}의 매칭 결과 ${matches.length}개 저장 완료`);
    } catch (error) {
      console.error("매칭 결과 저장 오류:", error);
      throw error;
    }
  }
  
  /**
   * 사용자 정보를 조회하는 함수
   * 
   * @param {String} userId - 사용자 ID
   * @returns {Promise<Object>} 사용자 정보 객체
   */
  export async function getUserInfo(userId) {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      
      if (!userDoc.exists()) {
        throw new Error(`ID가 ${userId}인 사용자가 존재하지 않습니다.`);
      }
      
      return {
        id: userId,
        ...userDoc.data()
      };
    } catch (error) {
      console.error("사용자 정보 조회 오류:", error);
      throw error;
    }
  }
  
  /**
   * 최근 사용자 통계를 가져오는 함수
   * 
   * @param {Number} days - 조회할 일수
   * @returns {Promise<Object>} 통계 객체
   */
  export async function getUserStats(days = 7) {
    try {
      // 현재 시간에서 days일 전 타임스탬프 계산
      const date = new Date();
      date.setDate(date.getDate() - days);
      
      // 일자별 사용자 수 계산을 위한 객체
      const dailyStats = {};
      
      // 모든 사용자 조회
      const usersRef = collection(db, "users");
      const usersSnapshot = await getDocs(usersRef);
      
      let totalUsers = 0;
      let recentUsers = 0;
      
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        totalUsers++;
        
        // serverTimestamp() 결과는 Firestore Timestamp 객체
        if (userData.timestamp && userData.timestamp.toDate() >= date) {
          recentUsers++;
          
          // 일자별 통계
          const dayStr = userData.timestamp.toDate().toISOString().split('T')[0];
          dailyStats[dayStr] = (dailyStats[dayStr] || 0) + 1;
        }
      });
      
      return {
        totalUsers,
        recentUsers,
        dailyStats
      };
    } catch (error) {
      console.error("사용자 통계 조회 오류:", error);
      throw error;
    }
  }
  
  /**
   * 사용자의 매칭 상태를 업데이트하는 함수
   * 
   * @param {String} matchId - 매칭 문서 ID
   * @param {String} status - 새 상태 (accepted, rejected)
   * @returns {Promise<void>}
   */
  export async function updateMatchStatus(matchId, status) {
    try {
      const matchRef = doc(db, "matches", matchId);
      await updateDoc(matchRef, { 
        status,
        updatedAt: serverTimestamp()
      });
      
      console.log(`매칭 ID ${matchId}의 상태가 ${status}로 업데이트됨`);
    } catch (error) {
      console.error("매칭 상태 업데이트 오류:", error);
      throw error;
    }
  }