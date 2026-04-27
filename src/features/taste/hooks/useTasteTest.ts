'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewSession } from '@/lib/utils';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { analyzeTasteMbti } from '../lib/analyzeTasteMbti';
import { saveTasteResult } from '../storage/localTasteResultStorage';

export const TEST_CONTENTS = STREAMING_CONTENTS.slice(0, 20);
export const MIN_REQUIRED_RATINGS = 12;

export function useTasteTest() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [skippedIds, setSkippedIds] = useState<Set<string>>(() => new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingResultId, setPendingResultId] = useState<string | null>(null);

  const currentContent = TEST_CONTENTS[currentIndex];
  const currentRating = ratings[currentContent.id] ?? 0;
  const isSkipped = skippedIds.has(currentContent.id);
  const ratedCount = Object.keys(ratings).length;
  const skippedCount = skippedIds.size;
  const answeredCount = ratedCount + skippedCount;
  const canSubmit = ratedCount >= MIN_REQUIRED_RATINGS;
  const isLast = currentIndex === TEST_CONTENTS.length - 1;
  const isAnalyzing = pendingResultId !== null;

  const topRatedPreview = useMemo(() => {
    return Object.entries(ratings)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([id]) => TEST_CONTENTS.find((item) => item.id === id)?.title)
      .filter(Boolean)
      .join(', ');
  }, [ratings]);

  const analysisPreviewContents = useMemo(() => {
    const orderedContentIds = Object.entries(ratings)
      .sort((a, b) => b[1] - a[1])
      .map(([contentId]) => contentId);

    const fallbackContentIds = TEST_CONTENTS.map((content) => content.id);
    const uniqueIds = Array.from(
      new Set([...orderedContentIds, ...fallbackContentIds])
    ).slice(0, 5);

    return uniqueIds
      .map((contentId) =>
        TEST_CONTENTS.find((content) => content.id === contentId)
      )
      .filter(
        (content): content is (typeof TEST_CONTENTS)[number] => Boolean(content)
      );
  }, [ratings]);

  useEffect(() => {
    if (!pendingResultId) return;

    const timeout = window.setTimeout(() => {
      router.push(`/result/${pendingResultId}`);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [pendingResultId, router]);

  const rateCurrentContent = (rating: number) => {
    setRatings((current) => ({ ...current, [currentContent.id]: rating }));
    setSkippedIds((current) => {
      const next = new Set(current);
      next.delete(currentContent.id);
      return next;
    });
  };

  const skipCurrentContent = () => {
    setRatings((current) => {
      const next = { ...current };
      delete next[currentContent.id];
      return next;
    });
    setSkippedIds((current) => {
      const next = new Set(current);
      next.add(currentContent.id);
      return next;
    });
  };

  const goPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goNext = () => {
    setCurrentIndex((index) => Math.min(TEST_CONTENTS.length - 1, index + 1));
  };

  const submit = () => {
    if (!canSubmit || isSubmitting || isAnalyzing) return;

    setIsSubmitting(true);
    const sessionId = createNewSession();
    const ratingEntries = Object.entries(ratings).map(([contentId, rating]) => ({ contentId, rating }));
    const skippedContentIds = Array.from(skippedIds);
    const result = analyzeTasteMbti(
      ratingEntries,
      sessionId,
      undefined,
      skippedContentIds
    );
    saveTasteResult(result);
    setPendingResultId(result.id);
  };

  return {
    analysisPreviewContents,
    currentContent,
    currentIndex,
    currentRating,
    isSkipped,
    ratedCount,
    skippedCount,
    answeredCount,
    canSubmit,
    isLast,
    isAnalyzing,
    isSubmitting,
    topRatedPreview,
    totalCount: TEST_CONTENTS.length,
    minRequiredRatings: MIN_REQUIRED_RATINGS,
    rateCurrentContent,
    skipCurrentContent,
    goPrevious,
    goNext,
    submit,
  };
}
