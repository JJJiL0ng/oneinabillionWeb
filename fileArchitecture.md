one-in-a-billion/
├── .gitignore                           # Git에서 제외할 파일/폴더 목록
├── .env.local                           # 환경 변수 설정 (Firebase 키 등)
├── next.config.mjs                      # Next.js 15 설정 파일 (mjs 확장자 사용)
├── package.json                         # 프로젝트 의존성 및 스크립트
├── README.md                            # 프로젝트 설명 문서
├── jsconfig.json                        # JavaScript 컴파일러 옵션 설정
├── public/                              # 정적 파일 디렉토리
│   ├── favicon.ico                      # 웹사이트 파비콘
│   ├── images/                          # 이미지 파일 모음
│   │   ├── questions/                   # 이진 선택 질문 이미지
│   │   │   ├── q1-left.png             # 1번 질문 왼쪽 이미지
│   │   │   ├── q1-right.png            # 1번 질문 오른쪽 이미지
│   │   │   └── ...                     # 나머지 질문 이미지들
│   │   └── logo.png                    # 서비스 로고
├── src/                                 # 소스 코드 디렉토리
│   ├── app/                             # App Router 구조 (Next.js 15)
│   │   ├── layout.js                    # 메인 레이아웃 컴포넌트 (메타데이터, 공통 UI)
│   │   ├── page.js                      # 랜딩 페이지 (질문, 이진 선택 화면 포함)
│   │   ├── globals.css                  # 전역 스타일 정의
│   │   └── favicon.ico                  # 앱 파비콘
│   ├── components/                      # 재사용 가능한 컴포넌트
│   │   ├── BinaryChoice.js              # 이진 선택 메인 컴포넌트 (상태 관리)
│   │   ├── ChoiceButton.js              # 좌/우 선택 버튼 컴포넌트
│   │   ├── QuestionContainer.js         # 질문 텍스트와 이미지 표시 컴포넌트
│   │   ├── ProgressBar.js               # 질문 진행 상태 표시 바
│   │   ├── SocialInput.js               # SNS 계정 입력 폼 컴포넌트
│   │   └── SuccessMessage.js            # 제출 완료 후 메시지 컴포넌트
│   ├── contexts/                        # React Context API 관련 파일들
│   │   └── ChoiceContext.js             # 사용자 선택 상태 관리 컨텍스트
│   ├── firebase/                        # Firebase 관련 설정 및 함수
│   │   ├── config.js                    # Firebase 초기화 설정
│   │   ├── db.js                        # Firestore 데이터베이스 함수 (저장, 조회)
│   ├── lib/                             # 유틸리티 및 공통 함수
│   │   ├── questions.js                 # 질문 데이터 및 관리 함수 (확장 가능)
│   │   └── matching.js                  # 이진 선택 기반 매칭 알고리즘
│   └── utils/                           # 기타 유틸리티 함수
│       ├── analytics.js                 # 사용자 행동 분석 헬퍼 함수
│       └── performance.js               # 성능 최적화 관련 유틸리티
└── vercel.json                          # Vercel 배포 설정 (캐싱, 헤더 등)