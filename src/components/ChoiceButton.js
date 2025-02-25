// src/components/ChoiceButton.js
'use client';

/**
 * 이진 선택에 사용되는 이미지 버튼 컴포넌트
 * 
 * @param {String} image - 이미지 경로
 * @param {String} value - 선택 값 (left/right)
 * @param {Boolean} isSelected - 선택 여부
 * @param {Function} onClick - 클릭 핸들러
 * @param {String} alt - 이미지 대체 텍스트
 */
export default function ChoiceButton({ image, value, isSelected, onClick, alt }) {
  return (
    <button 
      className={`choice-btn ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      aria-label={alt}
    >
      {/* 이미지 로딩 최적화 - Next.js Image 사용 */}
      <img 
        src={image} 
        alt={alt} 
        className="choice-img"
        // priority={true} Next.js의 Image 컴포넌트 사용 시 활성화
      />
    </button>
  );
}