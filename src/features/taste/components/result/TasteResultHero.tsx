'use client';

import Link from 'next/link';
import { TasteMbtiResult } from '../../types';

interface TasteResultHeroProps {
  copied: boolean;
  result: TasteMbtiResult;
  shareNotice: string;
  onInstagramShare: () => Promise<void>;
  onKakaoShare: () => Promise<void>;
  onNativeShare: () => Promise<void>;
}

export function TasteResultHero({
  copied,
  result,
  shareNotice,
  onInstagramShare,
  onKakaoShare,
  onNativeShare,
}: TasteResultHeroProps) {
  return (
    <div className="animate-fade-in rounded-2xl border border-netflix-red/20 bg-gradient-to-br from-netflix-red/10 via-neutral-900/90 to-neutral-950/90 p-5 shadow-xl backdrop-blur-sm md:rounded-3xl md:p-8">
      <div className="inline-flex items-center gap-1.5 rounded-full bg-netflix-red/20 px-3 py-1.5 md:gap-2 md:px-4 md:py-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-netflix-red opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-netflix-red" />
        </span>
        <span className="text-xs font-semibold tracking-wide text-netflix-red md:text-sm">
          작품 취향 코드
        </span>
      </div>

      <h1 className="mt-4 text-5xl font-black tracking-tight text-white md:mt-6 md:text-7xl lg:text-8xl">
        {result.code}
      </h1>
      <h2 className="mt-2 text-2xl font-black text-white md:mt-4 md:text-3xl lg:text-4xl">
        {result.title}
      </h2>
      <p className="mt-1 text-base text-netflix-red md:mt-2 md:text-xl">
        {result.subtitle}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-neutral-300 md:mt-6 md:text-lg">
        {result.description}
      </p>
      <p className="mt-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs leading-relaxed text-neutral-400 md:text-sm">
        이 결과는 작품 평점 패턴을 바탕으로 만든 콘텐츠 취향 분석입니다.
      </p>

      <div className="mt-6 space-y-3 md:mt-8">
        <p className="text-xs font-semibold text-neutral-400 md:text-sm">
          결과 공유하기
        </p>
        <div className="grid grid-cols-3 gap-2 md:gap-3">
          <button
            type="button"
            onClick={onInstagramShare}
            className="group flex h-11 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-orange-400 text-sm font-bold text-white transition-transform active:scale-95 md:h-12 md:gap-2 md:hover:scale-105"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span className="hidden min-[400px]:inline">인스타</span>
          </button>
          <button
            type="button"
            onClick={onKakaoShare}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#FEE500] text-sm font-bold text-neutral-900 transition-transform active:scale-95 md:h-12 md:gap-2 md:hover:scale-105"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c-5.24 0-9.5 3.262-9.5 7.281 0 2.596 1.753 4.876 4.384 6.139l-.893 3.262c-.072.264.214.49.462.365l3.945-2.357c.534.067 1.082.102 1.602.102 5.24 0 9.5-3.262 9.5-7.281C21.5 6.262 17.24 3 12 3z" />
            </svg>
            <span className="hidden min-[400px]:inline">카카오</span>
          </button>
          <button
            type="button"
            onClick={onNativeShare}
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 text-sm font-bold text-white transition-all active:scale-95 active:bg-white/10 md:h-12 md:gap-2 md:hover:border-white/40 md:hover:bg-white/10"
          >
            <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            {copied ? '복사됨' : '공유'}
          </button>
        </div>
        {shareNotice ? (
          <p className="animate-fade-in text-center text-xs font-medium text-netflix-red md:text-sm">
            {shareNotice}
          </p>
        ) : null}
      </div>

      <div className="mt-6 md:mt-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-neutral-400 transition-colors active:bg-white/10 md:gap-2 md:px-4 md:py-2 md:text-sm md:hover:bg-white/10 md:hover:text-white"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform group-active:-translate-x-0.5 md:h-4 md:w-4 md:group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          다시 테스트하기
        </Link>
      </div>
    </div>
  );
}
