'use client';

interface RatingControlsProps {
  rating: number;
  isSkipped: boolean;
  contentTitle: string;
  onRate: (rating: number) => void;
  onSkip: () => void;
}

export function RatingControls({
  rating,
  isSkipped,
  contentTitle,
  onRate,
  onSkip,
}: RatingControlsProps) {
  const ratingLabels = [
    '전혀 관심이 없어요',
    '관심이 적어요',
    '보통이에요',
    '재미있게 봤어요',
    '굉장히 재미있었어요',
  ];

  return (
    <div className="space-y-1.5 md:space-y-4">
      {/* Rating label - Simplified on mobile */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-neutral-400 md:text-sm">
          {rating > 0 ? (
            <span className="text-white">{ratingLabels[rating - 1]}</span>
          ) : (
            '별점을 선택하세요'
          )}
        </span>
        {rating > 0 && (
          <button
            type="button"
            onClick={() => onRate(0)}
            className="touch-area rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors active:bg-white/10 md:hover:text-white"
          >
            초기화
          </button>
        )}
      </div>

      {/* Star rating buttons - Larger touch targets */}
      <div className="flex items-center gap-1 md:gap-2" aria-label={`${contentTitle} 별점`}>
        <div className="flex flex-1 gap-1 md:gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onRate(value)}
              className={`star-btn relative flex h-10 flex-1 items-center justify-center rounded-lg border text-sm font-black transition-all md:h-14 md:rounded-xl md:text-lg ${
                rating >= value
                  ? 'border-netflix-red bg-netflix-red text-white shadow-lg shadow-netflix-red/30'
                  : 'border-white/10 bg-white/5 text-neutral-500 active:border-netflix-red/50 active:bg-netflix-red/10 active:text-netflix-red md:hover:border-netflix-red/50 md:hover:bg-netflix-red/10 md:hover:text-netflix-red'
              }`}
              aria-label={`${value}점`}
            >
              <span className="relative z-10">{value}</span>
              {/* Star icon for selected ratings */}
              {rating >= value && (
                <svg
                  className="absolute right-0.5 top-0.5 h-2 w-2 text-white/80 md:right-1.5 md:top-1.5 md:h-3 md:w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Not watched button - swaps this title for another candidate */}
        <button
          type="button"
          onClick={onSkip}
          aria-label={`${contentTitle} 안봤어요`}
          className={`flex h-10 shrink-0 items-center justify-center gap-1 rounded-lg border px-2 text-xs font-bold transition-all md:h-14 md:gap-2 md:rounded-xl md:px-4 md:text-sm ${
            isSkipped
              ? 'border-neutral-600 bg-neutral-700 text-white'
              : 'border-white/10 bg-white/5 text-neutral-400 active:border-neutral-500 active:bg-neutral-800 active:text-white md:hover:border-neutral-500 md:hover:bg-neutral-800 md:hover:text-white'
          }`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isSkipped ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
          <span className="hidden min-[400px]:inline">안봤어요</span>
        </button>
      </div>

      {/* Rating scale indicator - Hidden on very small screens */}
      <div className="hidden rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[11px] leading-relaxed text-neutral-400 md:block">
        <span className="font-semibold text-neutral-300">별점 기준</span>
        <span className="block">1점 전혀 관심이 없어요 · 2점 관심이 적어요 · 3점 보통이에요 · 4점 재미있게 봤어요 · 5점 굉장히 재미있었어요</span>
      </div>
    </div>
  );
}
