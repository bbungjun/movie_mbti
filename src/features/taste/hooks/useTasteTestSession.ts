'use client';

import { useCallback, useMemo, useState } from 'react';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { selectTestContents } from '../lib/selectTestContents';
import { InProgressTasteTest } from '../storage/localTasteResultStorage';
import { StreamingContent } from '../types';

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

function createSelectedTestContents() {
  return shuffleArray(selectTestContents(STREAMING_CONTENTS, 10));
}

function getSavedTestContents(saved: InProgressTasteTest | null) {
  if (!saved) {
    return createSelectedTestContents();
  }

  const orderedContents = saved.testContentIds
    .map((id) => STREAMING_CONTENTS.find((content) => content.id === id))
    .filter((content): content is StreamingContent => Boolean(content));

  return orderedContents.length > 0
    ? orderedContents
    : createSelectedTestContents();
}

export function useTasteTestSession() {
  const [testContents, setTestContents] = useState<StreamingContent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [skippedIds, setSkippedIds] = useState<Set<string>>(new Set());
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const hydrateFromSaved = useCallback((saved: InProgressTasteTest | null) => {
    if (saved) {
      setRatings(
        saved.ratings.reduce<Record<string, number>>((acc, rating) => {
          acc[rating.contentId] = rating.rating;
          return acc;
        }, {})
      );
      setSkippedIds(new Set(saved.skippedContentIds));
      setCurrentIndex(saved.currentIndex);
      setIsTestStarted(saved.isTestStarted);
    } else {
      setRatings({});
      setSkippedIds(new Set());
      setCurrentIndex(0);
      setIsTestStarted(false);
    }

    setTestContents(getSavedTestContents(saved));
    setIsLoaded(true);
  }, []);

  const currentContent = testContents[currentIndex] ?? null;
  const currentRating = currentContent ? ratings[currentContent.id] ?? 0 : 0;
  const isSkipped = currentContent ? skippedIds.has(currentContent.id) : false;
  const ratedCount = Object.keys(ratings).length;
  const skippedCount = skippedIds.size;
  const answeredCount = ratedCount + skippedCount;
  const canSubmit = ratedCount > 0;
  const isLast =
    testContents.length > 0 && currentIndex === testContents.length - 1;

  const serializedRatings = useMemo(
    () =>
      Object.entries(ratings).map(([contentId, rating]) => ({
        contentId,
        rating,
      })),
    [ratings]
  );

  const startTest = useCallback(() => {
    setIsTestStarted(true);
  }, []);

  const rateCurrentContent = useCallback((rating: number) => {
    setRatings((current) => {
      if (!currentContent) {
        return current;
      }

      return { ...current, [currentContent.id]: rating };
    });

    setSkippedIds((current) => {
      if (!currentContent) {
        return current;
      }

      const next = new Set(current);
      next.delete(currentContent.id);
      return next;
    });
  }, [currentContent]);

  const skipCurrentContent = useCallback(() => {
    if (!currentContent) {
      return;
    }

    if (skippedIds.has(currentContent.id)) {
      setSkippedIds((current) => {
        const next = new Set(current);
        next.delete(currentContent.id);
        return next;
      });
      return;
    }

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

    if (!isLast) {
      setCurrentIndex((index) => Math.min(testContents.length - 1, index + 1));
    }
  }, [currentContent, isLast, skippedIds, testContents.length]);

  const goPrevious = useCallback(() => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentIndex((index) => Math.min(testContents.length - 1, index + 1));
  }, [testContents.length]);

  return {
    testContents,
    currentContent,
    currentIndex,
    currentRating,
    ratings,
    ratedCount,
    skippedIds,
    skippedCount,
    answeredCount,
    isSkipped,
    isLast,
    canSubmit,
    isTestStarted,
    isLoaded,
    serializedRatings,
    startTest,
    rateCurrentContent,
    skipCurrentContent,
    goPrevious,
    goNext,
    hydrateFromSaved,
  };
}
