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
  const ratingLabels = ['별로', '그냥', '볼만', '좋음', '최고'];

  return (
    <div className="space-y-3 md:space-y-4">
      {/* Rating label - Simplified on mobile */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-400">
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
      <div className="flex items-center gap-1.5 md:gap-2" aria-label={`${contentTitle} 별점`}>
        <div className="flex flex-1 gap-1 md:gap-1.5">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => onRate(value)}
              className={`star-btn relative flex h-12 flex-1 items-center justify-center rounded-xl border text-base font-black transition-all md:h-14 md:text-lg ${
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
                  className="absolute right-1 top-1 h-2.5 w-2.5 text-white/80 md:right-1.5 md:top-1.5 md:h-3 md:w-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Skip button - Always visible with icon */}
        <button
          type="button"
          onClick={onSkip}
          className={`flex h-12 shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-bold transition-all md:h-14 md:gap-2 md:px-4 ${
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
          <span className="hidden min-[400px]:inline">{isSkipped ? '취소' : 'Skip'}</span>
        </button>
      </div>

      {/* Rating scale indicator - Hidden on very small screens */}
      <div className="hidden justify-between text-[10px] text-neutral-600 min-[360px]:flex">
        <span>1점: 별로였어요</span>
        <span>5점: 인생작!</span>
      </div>
    </div>
  );
}
