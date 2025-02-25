// src/components/ProgressBar.js
'use client';

/**
 * 질문 진행 상황을 표시하는 프로그레스 바 컴포넌트
 * 
 * @param {Number} current - 현재 단계 (0부터 시작)
 * @param {Number} total - 전체 단계 수
 */
export default function ProgressBar({ current, total }) {
  // 진행률 계산 (백분율) - 소셜 입력 단계 고려
  const percentage = Math.min(Math.round((current / (total - 1)) * 100), 100);
  
  return (
    <div className="mb-8">
      {/* 진행 상태 정보 */}
      <div className="flex justify-between mb-2 text-sm text-gray">
        <span>{Math.min(current + 1, total)} / {total}</span>  {/* 최대값 제한 추가 */}
        <span>{percentage}%</span>
      </div>
      
      {/* 프로그레스 바 */}
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
    </div>
  );
}