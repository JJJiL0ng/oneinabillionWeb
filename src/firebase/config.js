// src/firebase/config.js

/**
 * Firebase 초기화 및 설정을 담당하는 파일
 * Firebase 서비스에 대한 접근점을 제공합니다.
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firestore 초기화
const db = getFirestore(app);

export { app, db };

/**
 * Firebase 서비스를 사용할 때는 이 모듈에서 초기화된 app과 db를 임포트해서 사용합니다.
 * 예: import { db } from '../firebase/config';
 */