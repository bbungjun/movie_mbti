'use client';

interface TasteTestFooterProps {
  currentIndex: number;
  isLast: boolean;
  canSubmit: boolean;
  isSubmitting: boolean;
  minRequiredRatings: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function TasteTestFooter({
  currentIndex,
  isLast,
  canSubmit,
  isSubmitting,
  minRequiredRatings,
  onPrevious,
  onNext,
  onSubmit,
}: TasteTestFooterProps) {
  return (
    <div className="sticky bottom-0 z-20 mt-6 md:mt-8">
      {/* Blur gradient backdrop */}
      <div className="absolute inset-0 -top-6 bg-gradient-to-t from-netflix-black via-netflix-black/95 to-transparent md:-top-8" />

      <div className="relative mx-auto max-w-lg space-y-3 pb-4 pt-3 md:space-y-4 md:pb-6 md:pt-4">
        {/* Status message - Compact on mobile */}
        <div className="flex items-center justify-center">
          {canSubmit ? (
            <div className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1.5 md:gap-2 md:px-4 md:py-2">
              <svg className="h-3.5 w-3.5 text-green-400 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs font-semibold text-green-400 md:text-sm">결과를 볼 수 있어요!</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 md:gap-2 md:px-4 md:py-2">
              <svg className="h-3.5 w-3.5 text-neutral-400 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs text-neutral-400 md:text-sm">
                최소 <span className="font-semibold text-white">{minRequiredRatings}개</span> 평가 필요
              </span>
            </div>
          )}
        </div>

        {/* Navigation buttons - Full width on mobile */}
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="group flex h-12 items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 font-bold text-white transition-all active:bg-white/10 disabled:border-neutral-800 disabled:bg-transparent disabled:text-neutral-700 md:h-14 md:gap-2 md:hover:border-white/20 md:hover:bg-white/10"
          >
            <svg
              className="h-4 w-4 transition-transform group-active:-translate-x-0.5 group-disabled:transform-none md:h-5 md:w-5 md:group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm md:text-base">이전</span>
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit || isSubmitting}
              className="btn-netflix group relative flex h-12 items-center justify-center gap-1.5 overflow-hidden rounded-xl text-sm disabled:bg-neutral-800 disabled:text-neutral-500 disabled:shadow-none md:h-14 md:gap-2 md:text-lg"
            >
              {isSubmitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin md:h-5 md:w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>분석 중...</span>
                </>
              ) : (
                <>
                  <span>결과 보기</span>
                  <svg className="h-4 w-4 transition-transform group-active:scale-110 md:h-5 md:w-5 md:group-hover:scale-110" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={onNext}
              className="btn-netflix group flex h-12 items-center justify-center gap-1.5 rounded-xl text-sm md:h-14 md:gap-2 md:text-lg"
            >
              <span>다음</span>
              <svg
                className="h-4 w-4 transition-transform group-active:translate-x-0.5 md:h-5 md:w-5 md:group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Early submit option - More prominent on mobile when available */}
        {!isLast && canSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="group flex h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-netflix-red/30 bg-netflix-red/5 text-sm font-semibold text-netflix-red transition-all active:border-netflix-red/50 active:bg-netflix-red/10 disabled:border-neutral-700 disabled:bg-transparent disabled:text-neutral-500 md:h-12 md:gap-2 md:hover:border-netflix-red/50 md:hover:bg-netflix-red/10"
          >
            <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            지금 바로 결과 확인하기
          </button>
        )}
      </div>

      {/* Safe area spacer for iOS */}
      <div className="h-[env(safe-area-inset-bottom,0px)]" />
    </div>
  );
}
