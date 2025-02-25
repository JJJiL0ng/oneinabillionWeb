// src/lib/questions.js

/**
 * 이진 선택 질문 데이터를 관리하는 모듈
 * 질문 데이터와 관련 유틸리티 함수들을 제공합니다.
 */

/**
 * 질문 목록을 가져오는 함수
 * @returns {Array} 질문 객체 배열
 */
export function getQuestions() {
    // 질문 데이터 배열
    // text: 질문 텍스트
    // leftImage/rightImage: 선택 이미지 경로
    // leftText/rightText: 각 이미지에 대한 설명 텍스트 (접근성 용도)
    return [
      {
        id: 'q1',
        text: '어떤 주말을 더 선호하시나요?',
        leftImage: '/images/questions/q1-left.png',
        rightImage: '/images/questions/q1-right.png',
        leftText: '집에서 휴식하는 주말',
        rightText: '밖에서 활동하는 주말'
      },
      {
        id: 'q2',
        text: '어떤 식사 스타일을 더 좋아하시나요?',
        leftImage: '/images/questions/q2-left.png',
        rightImage: '/images/questions/q2-right.png',
        leftText: '혼자 조용히 식사',
        rightText: '여럿이 함께 식사'
      },
      {
        id: 'q3',
        text: '어떤 여행지를 더 선호하시나요?',
        leftImage: '/images/questions/q3-left.png',
        rightImage: '/images/questions/q3-right.png',
        leftText: '도시 여행',
        rightText: '자연 속 여행'
      },
      {
        id: 'q4',
        text: '어떤 취미 활동을 더 즐기시나요?',
        leftImage: '/images/questions/q4-left.png',
        rightImage: '/images/questions/q4-right.png',
        leftText: '창작적인 취미',
        rightText: '신체적인 취미'
      },
      {
        id: 'q5',
        text: '어떤 소통 방식이 더 편하신가요?',
        leftImage: '/images/questions/q5-left.png',
        rightImage: '/images/questions/q5-right.png',
        leftText: '메시지로 소통',
        rightText: '직접 만나서 소통'
      }
    ];
  }
  
  /**
   * 질문 데이터의 유효성을 검증하는 함수
   * @param {Array} questions - 검증할 질문 배열
   * @returns {Boolean} 유효성 검증 결과
   */
  export function validateQuestions(questions) {
    if (!Array.isArray(questions) || questions.length === 0) {
      console.error('질문 데이터가 없거나 배열이 아닙니다.');
      return false;
    }
  
    // 모든 질문이 필수 필드를 가지고 있는지 확인
    const requiredFields = ['id', 'text', 'leftImage', 'rightImage'];
    
    for (const question of questions) {
      for (const field of requiredFields) {
        if (!question[field]) {
          console.error(`질문 ID ${question.id || '알 수 없음'}에 필수 필드 ${field}가 없습니다.`);
          return false;
        }
      }
    }
  
    return true;
  }
  
  /**
   * 특정 질문을 ID로 찾는 함수
   * @param {String} questionId - 찾을 질문 ID
   * @returns {Object|null} 질문 객체 또는 null
   */
  export function getQuestionById(questionId) {
    const questions = getQuestions();
    return questions.find(q => q.id === questionId) || null;
  }
  
  /**
   * 질문 순서를 셔플하는 함수 (옵션)
   * @param {Array} questions - 질문 배열
   * @returns {Array} 셔플된 질문 배열
   */
  export function shuffleQuestions(questions) {
    // 원본 배열을 복사하여 수정
    const shuffled = [...questions];
    
    // Fisher-Yates 셔플 알고리즘
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
  
  /**
   * 질문 추가 함수 (향후 확장성)
   * @param {Object} newQuestion - 새 질문 객체
   * @returns {Array} 업데이트된 질문 배열
   */
  export function addQuestion(newQuestion) {
    // 필수 필드 검증
    const requiredFields = ['id', 'text', 'leftImage', 'rightImage'];
    for (const field of requiredFields) {
      if (!newQuestion[field]) {
        throw new Error(`새 질문에 필수 필드 ${field}가 없습니다.`);
      }
    }
  
    // 현재 질문 배열 가져오기
    const currentQuestions = getQuestions();
    
    // ID 중복 검사
    if (currentQuestions.some(q => q.id === newQuestion.id)) {
      throw new Error(`ID가 ${newQuestion.id}인 질문이 이미 존재합니다.`);
    }
    
    // 질문 추가
    // 참고: 실제 구현에서는 Firebase 또는 다른 데이터베이스와 연동 필요
    return [...currentQuestions, newQuestion];
  }