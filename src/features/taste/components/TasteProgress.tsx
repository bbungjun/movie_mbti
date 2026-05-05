'use client';

interface TasteProgressProps {
  currentIndex: number;
  totalCount: number;
  answeredCount: number;
}

export function TasteProgress({ currentIndex, totalCount, answeredCount }: TasteProgressProps) {
  const progress = totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;
  const roundedProgress = Math.round(progress);

  return (
    <div className="mx-auto mb-2 w-full max-w-[340px] shrink-0 rounded-xl border border-white/10 bg-white/[0.04] p-2.5 sm:max-w-lg md:mb-8 md:rounded-2xl md:p-4">
      <div className="mb-2 flex items-end justify-between gap-3 md:mb-3">
        <div>
          <p className="text-[10px] font-semibold uppercase text-neutral-500 md:text-xs">
            진행률
          </p>
          <div className="mt-0.5 flex items-baseline gap-1.5">
            <span className="text-2xl font-black leading-none text-white md:text-4xl">
              {roundedProgress}
            </span>
            <span className="text-sm font-bold text-netflix-red md:text-xl">%</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-white md:text-lg">
            {answeredCount}
            <span className="text-[11px] font-medium text-neutral-500 md:text-sm">
              {' '}
              / {totalCount}
            </span>
          </p>
          <p className="mt-0.5 text-[10px] text-neutral-500 md:text-xs">
            현재 {currentIndex + 1}번째 작품
          </p>
        </div>
      </div>

      <div className="relative h-3 overflow-hidden rounded-full bg-neutral-800 md:h-4">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-netflix-red to-netflix-red-hover transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 h-4 w-4 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/80 blur-sm md:h-5 md:w-5" />
        </div>
      </div>
    </div>
  );
}
