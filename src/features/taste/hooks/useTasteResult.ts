'use client';

import { useEffect, useMemo, useState } from 'react';
import { getContentById } from '../data/streamingContents';
import { getTasteResult } from '../storage/localTasteResultStorage';
import { StreamingContent, TasteMbtiResult } from '../types';

interface RatedContentEntry {
  rating: number;
  content: StreamingContent;
}

export function useTasteResult(resultId: string) {
  const [result, setResult] = useState<TasteMbtiResult | null>(null);

  useEffect(() => {
    setResult(getTasteResult(resultId));
  }, [resultId]);

  const ratedContents = useMemo<RatedContentEntry[]>(() => {
    if (!result) {
      return [];
    }

    return result.ratings
      .map((rating) => ({
        rating: rating.rating,
        content: getContentById(rating.contentId),
      }))
      .filter((item): item is RatedContentEntry => Boolean(item.content))
      .sort((left, right) => right.rating - left.rating);
  }, [result]);

  const recommendedContents = useMemo<StreamingContent[]>(() => {
    if (!result) {
      return [];
    }

    return result.recommendedContentIds
      .map((id) => getContentById(id))
      .filter((content): content is StreamingContent => Boolean(content));
  }, [result]);

  return {
    result,
    ratedContents,
    recommendedContents,
  };
}
