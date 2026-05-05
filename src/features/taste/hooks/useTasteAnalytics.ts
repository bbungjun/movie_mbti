'use client';

import { useEffect, useMemo, useState } from 'react';
import { getContentById } from '../data/streamingContents';
import {
  StreamingContent,
  TasteAnalyticsContent,
  TasteAnalyticsResult,
} from '../types';

export interface TasteAnalyticsContentEntry extends TasteAnalyticsContent {
  content: StreamingContent;
}

export function useTasteAnalytics(code: string | null) {
  const [analytics, setAnalytics] = useState<TasteAnalyticsResult | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!code) {
      setAnalytics(null);
      setIsAnalyticsLoading(false);
      return;
    }

    let isActive = true;
    setIsAnalyticsLoading(true);

    fetch(`/api/taste-results/analytics?code=${encodeURIComponent(code)}`)
      .then((response) => {
        if (!response.ok) {
          return null;
        }

        return response.json() as Promise<TasteAnalyticsResult>;
      })
      .then((result) => {
        if (isActive) {
          setAnalytics(result);
        }
      })
      .catch(() => {
        if (isActive) {
          setAnalytics(null);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsAnalyticsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [code]);

  const topRatedContents = useMemo<TasteAnalyticsContentEntry[]>(() => {
    if (!analytics) {
      return [];
    }

    return analytics.topRatedContents
      .map((item) => ({
        ...item,
        content: getContentById(item.contentId),
      }))
      .filter(
        (item): item is TasteAnalyticsContentEntry => Boolean(item.content)
      );
  }, [analytics]);

  return {
    isAnalyticsLoading,
    topRatedContents,
  };
}
