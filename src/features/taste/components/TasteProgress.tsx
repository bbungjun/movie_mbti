'use client';

interface TasteProgressProps {
  currentIndex: number;
  totalCount: number;
  answeredCount: number;
}

export function TasteProgress({ currentIndex, totalCount, answeredCount }: TasteProgressProps) {
  const progress = ((currentIndex + 1) / totalCount) * 100;

  return (
    <div className="mx-auto mb-5 max-w-lg md:mb-8">
      {/* Progress indicators - Compact on mobile */}
      <div className="mb-2 flex items-center justify-between md:mb-3">
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-sm font-semibold text-white md:text-base">
            {currentIndex + 1}
          </span>
          <span className="text-xs text-neutral-500 md:text-sm">/</span>
          <span className="text-xs text-neutral-500 md:text-sm">{totalCount}</span>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          <span className="text-[10px] text-neutral-500 md:text-xs">{answeredCount}개 완료</span>
          <span className="rounded-full bg-netflix-red/20 px-1.5 py-0.5 text-[10px] font-semibold text-netflix-red md:px-2 md:text-xs">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Progress bar - Thicker touch target on mobile */}
      <div className="relative h-2 overflow-hidden rounded-full bg-neutral-800 md:h-1.5">
        {/* Animated progress overlay */}
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-netflix-red to-netflix-red-hover transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          {/* Glow effect - subtle on mobile */}
          <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-netflix-red blur-sm md:h-4 md:w-4 md:blur-md" />
        </div>
      </div>

      {/* Milestone markers - Hidden on mobile for cleaner look */}
      <div className="mt-1.5 hidden justify-between text-[10px] text-neutral-600 md:mt-2 md:flex">
        <span>시작</span>
        <span>60%</span>
        <span>완료</span>
      </div>
    </div>
  );
}
