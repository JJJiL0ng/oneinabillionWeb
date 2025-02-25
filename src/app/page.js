// src/app/page.js
'use client';

import { useEffect } from 'react';
import { useChoiceContext } from '../contexts/ChoiceContext';
import BinaryChoice from '../components/BinaryChoice';
import ProgressBar from '../components/ProgressBar';
import SocialInput from '../components/SocialInput';
import SuccessMessage from '../components/SuccessMessage';

export default function Home() {
  const {
    questions,
    currentStep,
    totalSteps,
    handleSelection,
    isCompleted,
    error
  } = useChoiceContext();

  // 성능 최적화: 이미지 사전 로딩
  useEffect(() => {
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
        <ProgressBar current={currentStep} total={totalSteps + 1} />
        <p className="text-center mb-6">
          매칭을 위해 SNS 계정을 입력해주세요. <br />
          매칭 결과는 입력하신 계정으로 바로 DM을 보내드립니다.
        </p>
        <SocialInput />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
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
          onSelect={(choice) => handleSelection(currentStep, choice)}
          questionNumber={currentStep + 1}
        />
      )}
    </div>
  );
}