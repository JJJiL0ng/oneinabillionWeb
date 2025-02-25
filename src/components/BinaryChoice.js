// src/components/BinaryChoice.js
'use client';

import { useState } from 'react';
import ChoiceButton from './ChoiceButton';

/**
 * 이진 선택 화면을 표시하는 메인 컴포넌트
 * 
 * @param {Object} question - 현재 질문 객체 (텍스트, 이미지 경로 등 포함)
 * @param {Function} onSelect - 선택 시 호출될 콜백 함수
 * @param {Number} questionNumber - 현재 질문 번호
 */
export default function BinaryChoice({ question, onSelect, questionNumber }) {
  const [selectedChoice, setSelectedChoice] = useState(null);
  
  // 선택 처리 함수
  const handleSelection = (choice) => {
    setSelectedChoice(choice);
    
    // 약간의 지연 후 선택 결과를 부모 컴포넌트에 전달 (시각적 피드백 위함)
    setTimeout(() => {
      onSelect(choice);
      setSelectedChoice(null); // 선택 상태 초기화
    }, 300);
  };

  return (
    <div className="py-4">
      {/* 질문 텍스트 표시 */}
      <QuestionContainer 
        questionText={question.text} 
        questionNumber={questionNumber} 
      />
      
      {/* 이진 선택 버튼 컨테이너 */}
      <div className="binary-choice-container">
        <ChoiceButton 
          image={question.leftImage}
          value="left"
          isSelected={selectedChoice === 'left'}
          onClick={() => handleSelection('left')}
          alt={question.leftText || '왼쪽 선택'}
        />
        
        <ChoiceButton 
          image={question.rightImage}
          value="right"
          isSelected={selectedChoice === 'right'}
          onClick={() => handleSelection('right')}
          alt={question.rightText || '오른쪽 선택'}
        />
      </div>
    </div>
  );
}

/**
 * 질문 텍스트를 표시하는 내부 컴포넌트
 */
function QuestionContainer({ questionText, questionNumber }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-medium mb-2">질문 {questionNumber}</h2>
      <p className="text-lg text-gray">{questionText}</p>
    </div>
  );
}