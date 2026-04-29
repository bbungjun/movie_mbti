'use client';

import Link from 'next/link';

export function TasteResultEmptyState() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-netflix-black px-4 text-white">
      <div className="max-w-sm text-center animate-fade-in">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 md:mb-6 md:h-20 md:w-20">
          <svg
            className="h-8 w-8 text-neutral-600 md:h-10 md:w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-black md:text-3xl">결과를 찾을 수 없어요</h1>
        <p className="mt-3 text-sm text-neutral-400 md:mt-4 md:text-base">
          결과는 현재 브라우저에만 저장돼 있어요.
          <br />
          테스트를 다시 진행해보세요.
        </p>
        <Link
          href="/"
          className="btn-netflix mt-6 inline-flex w-full items-center justify-center gap-2 md:mt-8 md:w-auto"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
              clipRule="evenodd"
            />
          </svg>
          테스트 하러 가기
        </Link>
      </div>
    </main>
  );
}
