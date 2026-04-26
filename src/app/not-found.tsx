import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-6xl font-black text-yellow-400 mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-8">
          페이지를 찾을 수 없습니다
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-gray-900 font-bold hover:opacity-90 transition-opacity"
        >
          🏠 메인으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
