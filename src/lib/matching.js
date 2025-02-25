// src/lib/matching.js

/**
 * 이진 선택 기반 매칭 알고리즘을 구현한 모듈
 * 사용자 선택 데이터를 분석하여 유사도를 계산하고 매칭을 수행합니다.
 */

/**
 * 두 사용자의 선택 유사도를 계산하는 함수
 * @param {Array} userSelections1 - 첫 번째 사용자의 선택 배열 ('left' 또는 'right')
 * @param {Array} userSelections2 - 두 번째 사용자의 선택 배열 ('left' 또는 'right')
 * @param {Array} weights - 각 질문의 가중치 배열 (선택 사항)
 * @returns {Number} 유사도 점수 (0-1 사이, 1이 가장 유사)
 */
export function calculateSimilarity(userSelections1, userSelections2, weights = null) {
    // 두 배열의 길이가 다르면 오류
    if (!userSelections1 || !userSelections2 || userSelections1.length !== userSelections2.length) {
      console.error('유효하지 않은 선택 데이터:', userSelections1, userSelections2);
      return 0;
    }
  
    // 가중치가 없으면 모든 질문에 동일한 가중치 부여
    const questionWeights = weights || Array(userSelections1.length).fill(1);
    
    // 총 가중치 합계 계산
    const totalWeight = questionWeights.reduce((sum, weight) => sum + weight, 0);
    
    // 선택이 일치하는 질문에 대한 가중치 합계 계산
    let matchedWeight = 0;
    
    for (let i = 0; i < userSelections1.length; i++) {
      if (userSelections1[i] === userSelections2[i]) {
        matchedWeight += questionWeights[i];
      }
    }
    
    // 유사도 점수 계산 (0-1 사이)
    return totalWeight > 0 ? matchedWeight / totalWeight : 0;
  }
  
  /**
   * 특정 사용자와 가장 유사한 사용자를 찾는 함수
   * @param {String} userId - 대상 사용자 ID
   * @param {Object} userSelections - 사용자 ID를 키로, 선택 배열을 값으로 하는 객체
   * @param {Array} weights - 각 질문의 가중치 배열 (선택 사항)
   * @param {Number} threshold - 최소 유사도 임계값 (0-1 사이)
   * @returns {Array} 유사도 순으로 정렬된 매칭 결과 배열
   */
  export function findMatches(userId, userSelections, weights = null, threshold = 0.6) {
    const targetSelections = userSelections[userId];
    
    if (!targetSelections) {
      console.error(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
      return [];
    }
    
    // 결과 배열 초기화
    const matches = [];
    
    // 모든 사용자와의 유사도 계산
    for (const [otherUserId, otherSelections] of Object.entries(userSelections)) {
      // 자기 자신은 제외
      if (otherUserId === userId) continue;
      
      // 유사도 계산
      const similarity = calculateSimilarity(targetSelections, otherSelections, weights);
      
      // 임계값 이상인 경우만 결과에 추가
      if (similarity >= threshold) {
        matches.push({
          userId: otherUserId,
          similarity
        });
      }
    }
    
    // 유사도 내림차순으로 정렬
    return matches.sort((a, b) => b.similarity - a.similarity);
  }
  
  /**
   * 선택 데이터를 바탕으로 사용자 성향을 분석하는 함수
   * @param {Array} selections - 사용자의 선택 배열
   * @returns {Object} 사용자 성향 분석 결과
   */
  export function analyzePersonality(selections) {
    // 선택이 없으면 빈 객체 반환
    if (!selections || selections.length === 0) {
      return {};
    }
    
    // 성향 카테고리 정의
    const traits = {
      socialPreference: null,    // 사회적 선호 (내향/외향)
      activityLevel: null,       // 활동성 수준 (정적/동적)
      communicationStyle: null   // 의사소통 스타일 (직접적/간접적)
    };
    
    // 각 질문이 어떤 성향과 관련있는지 매핑
    const questionTraitMap = [
      { index: 0, trait: 'socialPreference', leftValue: '내향적', rightValue: '외향적' },
      { index: 2, trait: 'activityLevel', leftValue: '정적', rightValue: '동적' },
      { index: 4, trait: 'communicationStyle', leftValue: '간접적', rightValue: '직접적' }
    ];
    
    // 성향 분석
    questionTraitMap.forEach(mapping => {
      const { index, trait, leftValue, rightValue } = mapping;
      
      if (index < selections.length) {
        traits[trait] = selections[index] === 'left' ? leftValue : rightValue;
      }
    });
    
    return traits;
  }
  
  /**
   * 매칭 결과를 사용자 친화적 형식으로 변환하는 함수
   * @param {Array} matches - 매칭 결과 배열
   * @param {Object} usersData - 사용자 데이터 객체 (소셜 미디어 정보 등)
   * @returns {Array} 사용자 친화적 형식의 매칭 결과
   */
  export function formatMatches(matches, usersData) {
    return matches.map(match => {
      const userData = usersData[match.userId] || {};
      
      return {
        userId: match.userId,
        similarity: Math.round(match.similarity * 100), // 백분율로 변환
        matchLevel: getMatchLevel(match.similarity),
        socialInfo: userData.socialInfo || {}
      };
    });
  }
  
  /**
   * 유사도 점수를 기반으로 매칭 레벨을 결정하는 함수
   * @param {Number} similarity - 유사도 점수 (0-1 사이)
   * @returns {String} 매칭 레벨 문자열
   */
  function getMatchLevel(similarity) {
    if (similarity >= 0.9) return '완벽한 매칭';
    if (similarity >= 0.8) return '매우 높은 매칭';
    if (similarity >= 0.7) return '높은 매칭';
    if (similarity >= 0.6) return '좋은 매칭';
    return '보통 매칭';
  }
  
  /**
   * Firebase에 매칭 결과를 저장하는 함수
   * @param {String} userId - 사용자 ID
   * @param {Array} matches - 매칭 결과 배열
   * @returns {Promise} 저장 작업 Promise
   */
  export async function saveMatchResults(userId, matches) {
    // 실제 구현에서는 Firebase Firestore 또는 다른 데이터베이스에 저장하는 로직 구현
    // 현재는 더미 Promise 반환
    return new Promise((resolve) => {
      console.log(`사용자 ${userId}의 매칭 결과 저장:`, matches);
      setTimeout(resolve, 500);
    });
  }