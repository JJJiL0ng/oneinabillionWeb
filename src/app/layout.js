// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'one in a billion | 간단한 이진 질문으로 매칭해드립니다',
  description: '간단한 이진 질문으로 진솔하지만 가벼운 매칭을 도와주는 데이팅 서비스',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        <main className="min-h-screen flex flex-col">
          <header className="py-4 border-b border-gray-100">
            <div className="container mx-auto">
              <h1 className="text-center font-medium text-xl">
                one in a billion
              </h1>
            </div>
          </header>
          <div className="flex-grow">
            {children}
          </div>
          <footer className="py-4 text-center text-gray">
            <div className="container mx-auto">
              <p className="text-sm">© {new Date().getFullYear()} one in a billion</p>
            </div>
          </footer>
        </main>
      </body>
    </html>
  );
}