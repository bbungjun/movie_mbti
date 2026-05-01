'use client';

import { useEffect } from 'react';
import { getTMDBImageUrl } from '@/lib/utils';
import { useTasteTest } from '../context/TasteTestContext';
import { TasteAnalyzingShuffle } from './TasteAnalyzingShuffle';
import { TasteContentCard } from './TasteContentCard';
import { TasteProgress } from './TasteProgress';
import { TasteTestFooter } from './TasteTestFooter';

export function TasteTestFlow() {
  const test = useTasteTest();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const isSmallScreen = window.matchMedia('(max-width: 640px)').matches;
    const posterSize = isSmallScreen ? 'w342' : 'w500';

    test.testContents
      .slice(test.currentIndex, test.currentIndex + 3)
      .forEach((content) => {
        const poster = new window.Image();
        poster.decoding = 'async';
        poster.src = getTMDBImageUrl(content.posterPath, posterSize);
      });
  }, [test.currentIndex, test.testContents]);

  if (test.isAnalyzing) {
    return (
      <TasteAnalyzingShuffle
        cards={test.analysisPreviewContents.map((content) => ({
          img: getTMDBImageUrl(content.posterPath, 'w500'),
          chip: content.genres[0] ?? 'NETFLIX',
          title: content.title,
        }))}
      />
    );
  }

  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 py-6 md:py-12">
      {/* Background glow effect - smaller on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full bg-netflix-red/5 blur-3xl md:top-20 md:h-64 md:w-64" />
      </div>

      <div className="relative">
        {/* Header - Compact on mobile */}
        <div className="mb-5 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between md:gap-4">
          <div>
            {/* Step indicator - Always visible on mobile */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 md:px-3 md:py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-netflix-red" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:text-xs">
                {test.currentIndex + 1} / {test.totalCount}
              </span>
            </div>
            <h2 className="mt-2 text-xl font-black tracking-tight text-white md:mt-4 md:text-3xl">
              이 작품, 어땠나요?
            </h2>
          </div>

          {/* Stats Badge - Simplified on mobile */}
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm md:gap-3 md:px-5 md:py-3">
            <div className="text-center">
              <p className="text-lg font-black text-netflix-red md:text-2xl">{test.ratedCount}</p>
              <p className="text-[10px] text-neutral-500 md:text-xs">평가</p>
            </div>
            <div className="h-6 w-px bg-white/10 md:h-8" />
            <div className="text-center">
              <p className="text-lg font-black text-neutral-400 md:text-2xl">{test.skippedCount}</p>
              <p className="text-[10px] text-neutral-500 md:text-xs">스킵</p>
            </div>
            {/* Top rated - hidden on mobile for space */}
            {test.topRatedPreview && (
              <>
                <div className="hidden h-8 w-px bg-white/10 sm:block" />
                <div className="hidden sm:block">
                  <p className="text-[10px] text-neutral-500 md:text-xs">최고 평점</p>
                  <p className="mt-0.5 max-w-[100px] truncate text-xs font-semibold text-white md:max-w-[120px] md:text-sm">
                    {test.topRatedPreview}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        <TasteProgress
          currentIndex={test.currentIndex}
          totalCount={test.totalCount}
          answeredCount={test.answeredCount}
        />

        <TasteContentCard
          content={test.currentContent}
          rating={test.currentRating}
          isSkipped={test.isSkipped}
          onRate={test.rateCurrentContent}
          onSkip={test.skipCurrentContent}
        />

        <TasteTestFooter
          currentIndex={test.currentIndex}
          isLast={test.isLast}
          canSubmit={test.canSubmit}
          isSubmitting={test.isSubmitting}
          ratedCount={test.ratedCount}
          onPrevious={test.goPrevious}
          onNext={test.goNext}
          onSubmit={test.submit}
        />
      </div>
    </section>
  );
}
