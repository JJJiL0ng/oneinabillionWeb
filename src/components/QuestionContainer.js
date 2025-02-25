// src/components/QuestionContainer.js
'use client';

/**
 * 질문 텍스트와 이미지를 표시하는 컨테이너 컴포넌트
 * 
 * @param {String} questionText - 질문 텍스트
 * @param {Number} questionNumber - 질문 번호
 * @param {Node} children - 추가 컨텐츠 (선택 사항)
 */
export default function QuestionContainer({ questionText, questionNumber, children }) {
  return (
    <div className="question-container">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-medium mb-2">
          {questionNumber && `질문 ${questionNumber}`}
        </h2>
        <p className="text-lg text-gray">{questionText}</p>
      </div>
      
      {/* 추가 컨텐츠 (자식 요소) */}
      {children}
    </div>
  );
}