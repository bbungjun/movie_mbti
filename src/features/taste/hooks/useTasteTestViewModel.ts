'use client';

import { useMemo } from 'react';
import { StreamingContent } from '../types';
import { useTasteTestSession } from './useTasteTestSession';

type TasteTestSession = ReturnType<typeof useTasteTestSession>;

export function useTasteTestViewModel(session: TasteTestSession) {
  const topRatedPreview = useMemo(() => {
    return Object.entries(session.ratings)
      .sort((left, right) => right[1] - left[1])
      .slice(0, 2)
      .map(([id]) => session.testContents.find((item) => item.id === id)?.title)
      .filter(Boolean)
      .join(', ');
  }, [session.ratings, session.testContents]);

  const analysisPreviewContents = useMemo(() => {
    const orderedContentIds = Object.entries(session.ratings)
      .sort((left, right) => right[1] - left[1])
      .map(([contentId]) => contentId);

    const fallbackContentIds = session.testContents.map((content) => content.id);
    const uniqueIds = Array.from(
      new Set([...orderedContentIds, ...fallbackContentIds])
    ).slice(0, 5);

    return uniqueIds
      .map((contentId) =>
        session.testContents.find((content) => content.id === contentId)
      )
      .filter((content): content is StreamingContent => Boolean(content));
  }, [session.ratings, session.testContents]);

  return {
    topRatedPreview,
    analysisPreviewContents,
  };
}
