'use client';

import { useEffect, useMemo, useState } from 'react';
import { getContentById } from '../data/streamingContents';
import { getTasteResult, saveTasteResult } from '../storage/localTasteResultStorage';
import { StreamingContent, TasteMbtiResult } from '../types';

interface RatedContentEntry {
  rating: number;
  content: StreamingContent;
}

export function useTasteResult(resultId: string) {
  const [result, setResult] = useState<TasteMbtiResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const localResult = getTasteResult(resultId);

    if (localResult) {
      setResult(localResult);
      setIsLoading(false);
      return () => {
        isActive = false;
      };
    }

    setIsLoading(true);
    fetch(`/api/taste-results?id=${encodeURIComponent(resultId)}`)
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json() as Promise<TasteMbtiResult>;
      })
      .then((remoteResult) => {
        if (!isActive) {
          return;
        }

        if (remoteResult) {
          saveTasteResult(remoteResult);
        }

        setResult(remoteResult);
      })
      .catch(() => {
        if (isActive) {
          setResult(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
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
    isLoading,
    result,
    ratedContents,
    recommendedContents,
  };
}
