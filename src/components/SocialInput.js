// src/components/SocialInput.js
'use client';

import { useState } from 'react';
import { useChoiceContext } from '../contexts/ChoiceContext';

/**
 * SNS 계정 입력 폼 컴포넌트
 */
export default function SocialInput() {
  // ChoiceContext에서 필요한 값들을 가져옴
  const { submitSocialInfo, isLoading: contextLoading, error: contextError } = useChoiceContext();
  
  const [platform, setPlatform] = useState('instagram');
  const [handle, setHandle] = useState('');
  const [error, setError] = useState('');
  
  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 기본 유효성 검사
    if (!handle.trim()) {
      setError('계정을 입력해주세요');
      return;
    }
    
    setError('');
    
    try {
      // 제출 데이터 준비
      const socialData = {
        platform,
        handle: handle.trim()
      };
      
      // ChoiceContext를 통해 Firebase에 저장
      await submitSocialInfo(socialData);
    } catch (err) {
      console.error('제출 오류:', err);
      setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {/* 플랫폼 선택 */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium">SNS 플랫폼</label>
        <div className="flex gap-4">
          <button
            type="button"
            className={`btn ${platform === 'instagram' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPlatform('instagram')}
          >
            Instagram
          </button>
          <button
            type="button"
            className={`btn ${platform === 'tiktok' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setPlatform('tiktok')}
          >
            TikTok
          </button>
        </div>
      </div>
      
      {/* 계정 입력 필드 */}
      <div className="mb-4">
        <label htmlFor="social-handle" className="block mb-2 text-sm font-medium">
          {platform === 'instagram' ? 'Instagram' : 'TikTok'} 아이디
        </label>
        <div className="input-container">
          <input
            id="social-handle"
            type="text"
            className="input-field"
            placeholder={`@를 제외한 ${platform} 아이디를 입력하세요`}
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            disabled={contextLoading}
          />
        </div>
        {(error || contextError) && (
          <p className="text-red-500 text-sm mt-1">{error || contextError}</p>
        )}
      </div>
      
      {/* 제출 버튼 */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={contextLoading}
      >
        {contextLoading ? '처리 중...' : '매칭 시작하기'}
      </button>
      
      {/* 개인정보 안내 */}
      <p className="text-xs text-gray text-center mt-4">
        입력하신 SNS 정보는 매칭 목적으로만 사용되며, 상대방에게만 공유됩니다.
      </p>
    </form>
  );
}