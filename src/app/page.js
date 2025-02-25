// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import BinaryChoice from '../components/BinaryChoice';
import ProgressBar from '../components/ProgressBar';
import SocialInput from '../components/SocialInput';
import SuccessMessage from '../components/SuccessMessage';
import { getQuestions } from '../lib/questions';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [questions] = useState(getQuestions());
  
  const totalSteps = questions.length;
  
  const handleSelection = (questionIndex, choice) => {
    console.log('Home handleSelection:', { questionIndex, choice }); // 디버깅 로그
    
    // 선택값 검증
    if (choice !== 'left' && choice !== 'right') {
      console.error('잘못된 선택값:', choice);
      return;
    }
    
    // 선택 저장
    const newSelections = [...selections];
    newSelections[questionIndex] = choice;
    setSelections(newSelections);
    
    // 로컬 스토리지에 선택 데이터 저장
    localStorage.setItem('userChoices', JSON.stringify(newSelections));
    
    // 디버깅을 위한 로그
    console.log('저장된 선택:', newSelections);
    
    // 다음 질문으로 이동 또는 완료
    if (questionIndex < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 모든 질문 완료, 소셜 입력 단계로
      setCurrentStep(totalSteps);
    }
  };
  
  const handleSocialSubmit = async (socialData) => {
    try {
      const savedChoices = JSON.parse(localStorage.getItem('userChoices'));
      if (!savedChoices || !Array.isArray(savedChoices) || savedChoices.length === 0) {
        throw new Error('선택 데이터가 없습니다');
      }
      
      // Firebase로 데이터 저장
      await saveUserSelections(savedChoices, socialData);
      
      // 성공 시 로컬 스토리지 클리어 및 완료 상태 설정
      localStorage.removeItem('userChoices');
      setIsCompleted(true);
    } catch (error) {
      console.error('제출 오류:', error);
      // 에러 처리 로직 추가
    }
  };
  
  // 성능 최적화: 이미지 사전 로딩
  useEffect(() => {
    // 즉시 현재 및 다음 질문 이미지 사전 로딩
    const preloadImages = () => {
      if (currentStep < totalSteps) {
        const currentQuestion = questions[currentStep];
        const imagesToPreload = [
          currentQuestion.leftImage,
          currentQuestion.rightImage
        ];
        
        // 다음 질문의 이미지도 미리 로드 (있는 경우)
        if (currentStep + 1 < totalSteps) {
          const nextQuestion = questions[currentStep + 1];
          imagesToPreload.push(nextQuestion.leftImage, nextQuestion.rightImage);
        }
        
        // 이미지 사전 로딩
        imagesToPreload.forEach(src => {
          const img = new Image();
          img.src = src;
        });
      }
    };
    
    preloadImages();
  }, [currentStep, questions, totalSteps]);
  
  // 소셜 입력 단계
  if (currentStep === totalSteps && !isCompleted) {
    return (
      <div className="container mx-auto py-10">
        <h2 className="text-center text-2xl mb-8">한 발짝 더 가까이</h2>
        <ProgressBar current={currentStep} total={totalSteps} />
        <p className="text-center mb-6">
          매칭을 위해 SNS 계정을 입력해주세요. <br />
          매칭 결과는 입력하신 계정으로 바로 DM을 보내드립니다.
        </p>
        <SocialInput onSubmit={handleSocialSubmit} />
      </div>
    );
  }
  
  // 완료 메시지
  if (isCompleted) {
    return <SuccessMessage />;
  }
  
  // 이진 선택 질문 단계
  return (
    <div className="container mx-auto py-10">
      <ProgressBar current={currentStep} total={totalSteps} />
      {currentStep < totalSteps && (
        <BinaryChoice
          question={questions[currentStep]}
          onSelect={handleSelection}  // 직접 handleSelection 함수 전달
          questionNumber={currentStep + 1}
        />
      )}
    </div>
  );
}