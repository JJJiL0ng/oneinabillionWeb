// src/components/SuccessMessage.js
'use client';

import Link from 'next/link';

/**
 * 제출 완료 후 표시되는 성공 메시지 컴포넌트
 */
export default function SuccessMessage() {
  return (
    <div className="container mx-auto py-16 text-center">
      <div className="max-w-md mx-auto">
        {/* 체크마크 아이콘 (SVG로 구현) */}
        <div className="flex justify-center mb-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        
        {/* 성공 메시지 */}
        <h2 className="text-2xl font-medium mb-4">매칭 신청 완료!</h2>
        <p className="mb-6 text-gray">
          당신과 잘 맞는 사람을 찾고 있어요.<br />
          매칭이 완료되면 입력하신 SNS 계정으로 DM을 보내드립니다.
        </p>
        
        {/* 홈으로 돌아가기 버튼 */}
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}