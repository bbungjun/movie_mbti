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
    <section className="relative mx-auto flex h-[100dvh] w-full max-w-6xl flex-col overflow-hidden px-3 py-1.5 md:h-auto md:min-h-screen md:overflow-visible md:px-4 md:py-12">
      {/* Background glow effect - smaller on mobile */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 h-32 w-32 -translate-x-1/2 rounded-full bg-netflix-red/5 blur-3xl md:top-20 md:h-64 md:w-64" />
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col">
        {/* Header - Compact on mobile */}
        <div className="mb-1.5 shrink-0 md:mb-6">
          <div className="mx-auto max-w-[340px] sm:max-w-lg">
            {/* Step indicator - Always visible on mobile */}
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 md:px-3 md:py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-netflix-red" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:text-xs">
                {test.currentIndex + 1} / {test.totalCount}
              </span>
            </div>
            <h2 className="mt-0.5 text-[15px] font-black tracking-tight text-white md:mt-4 md:text-3xl">
              이 작품, 어땠나요?
            </h2>
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
