// src/contexts/ChoiceContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { getQuestions } from '../lib/questions';
import { saveUserSelections } from '../firebase/db';

// Context 생성
const ChoiceContext = createContext();

/**
 * 이진 선택 데이터를 전역적으로 관리하는 Context Provider
 * - 사용자의 모든 선택 상태 관리
 * - 현재 질문 상태 관리
 * - Firebase와의 연동 로직 포함
 * 
 * @param {Object} props - children을 포함한 props
 */
export function ChoiceProvider({ children }) {
  // 질문 데이터 로드
  const [questions] = useState(getQuestions());
  // 현재 질문 인덱스
  const [currentStep, setCurrentStep] = useState(0);
  // 사용자 선택 저장 배열
  const [selections, setSelections] = useState([]);
  // 소셜 미디어 정보
  const [socialInfo, setSocialInfo] = useState(null);
  // 프로세스 완료 상태
  const [isCompleted, setIsCompleted] = useState(false);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 상태
  const [error, setError] = useState(null);

  // 총 질문 수
  const totalSteps = questions.length;

  /**
   * 선택을 처리하는 함수
   * @param {Number} questionIndex - 질문 인덱스
   * @param {String} choice - 선택 값 ('left' 또는 'right')
   */
  const handleSelection = (questionIndex, choice) => {
    // 디버깅을 위한 로그 추가
    console.log('ChoiceContext handleSelection:', {
      questionIndex,
      choice,
      currentSelections: [...selections]
    });

    // 선택값 검증
    if (choice !== 'left' && choice !== 'right') {
      console.error('잘못된 선택값:', choice);
      return;
    }

    // 기존 선택 배열 복사
    const newSelections = [...selections];
    // 해당 인덱스에 선택 저장
    newSelections[questionIndex] = choice;
    
    // 디버깅을 위한 로그 추가
    console.log('새로운 선택 배열:', newSelections);
    
    setSelections(newSelections);
    
    // 로컬 스토리지에 저장
    localStorage.setItem('one-in-billion-selections', JSON.stringify(newSelections));
    
    // 다음 질문으로 이동 또는 완료 처리
    if (questionIndex < totalSteps - 1) {
      setCurrentStep(questionIndex + 1);
    } else {
      setCurrentStep(totalSteps);
    }
  };

  /**
   * 소셜 미디어 정보 제출 처리
   * @param {Object} data - 소셜 미디어 정보 (platform, handle)
   */
  const submitSocialInfo = async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 소셜 정보 저장
      setSocialInfo(data);
      
      // 선택 데이터 검증
      if (!selections || selections.length === 0) {
        throw new Error('선택 데이터가 없습니다');
      }

      console.log('Firebase로 전송할 데이터:', {
        selections,
        data
      });

      // Firebase에 데이터 저장
      const userId = await saveUserSelections(selections, data);
      
      // 제출 완료 상태로 변경
      setIsCompleted(true);
      localStorage.removeItem('one-in-billion-selections'); // 저장 성공 시 로컬 데이터 삭제
      
      return userId;  // 필요한 경우 사용할 수 있도록 userId 반환
    } catch (err) {
      console.error('소셜 정보 제출 오류:', err);
      setError(err.message);
      throw err;  // 에러를 상위로 전파
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 프로세스 리셋 함수
   */
  const resetProcess = () => {
    setCurrentStep(0);
    setSelections([]);
    setSocialInfo(null);
    setIsCompleted(false);
    setError(null);
    localStorage.removeItem('one-in-billion-selections');
  };

  // 초기 로드 시 로컬 스토리지에서 데이터 복원
  useEffect(() => {
    const savedSelections = localStorage.getItem('one-in-billion-selections');
    if (savedSelections && selections.length === 0) {
      try {
        const parsedSelections = JSON.parse(savedSelections);
        setSelections(parsedSelections);
        
        // 저장된 선택 수에 따라 현재 스텝 설정
        if (parsedSelections.length < totalSteps) {
          setCurrentStep(parsedSelections.length);
        } else {
          setCurrentStep(totalSteps);
        }
      } catch (err) {
        console.error('저장된 선택 복원 오류:', err);
        localStorage.removeItem('one-in-billion-selections');
      }
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  // Context에 제공할 값들
  const value = {
    questions,
    currentStep,
    totalSteps,
    selections,
    socialInfo,
    isCompleted,
    isLoading,
    error,
    handleSelection,
    submitSocialInfo,
    resetProcess,
    // 현재 질문 정보 쉽게 접근하기 위한 getter
    getCurrentQuestion: () => questions[currentStep]
  };

  return (
    <ChoiceContext.Provider value={value}>
      {children}
    </ChoiceContext.Provider>
  );
}

/**
 * 선택 Context를 사용하기 위한 커스텀 훅
 * @returns {Object} ChoiceContext의 모든 값들
 */
export function useChoiceContext() {
  const context = useContext(ChoiceContext);
  
  if (context === undefined) {
    throw new Error('useChoiceContext는 ChoiceProvider 내부에서만 사용할 수 있습니다.');
  }
  
  return context;
}