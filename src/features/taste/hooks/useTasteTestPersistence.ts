'use client';

import { useEffect } from 'react';
import {
  loadInProgressTest,
  saveInProgressTest,
} from '../storage/localTasteResultStorage';
import { useTasteTestSession } from './useTasteTestSession';

type TasteTestSession = ReturnType<typeof useTasteTestSession>;

export function useTasteTestPersistence(session: TasteTestSession) {
  const {
    currentIndex,
    hydrateFromSaved,
    isLoaded,
    isTestStarted,
    serializedRatings,
    skippedIds,
    testContents,
  } = session;

  useEffect(() => {
    const saved = loadInProgressTest();
    hydrateFromSaved(saved);
  }, [hydrateFromSaved]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveInProgressTest({
      ratings: serializedRatings,
      skippedContentIds: Array.from(skippedIds),
      isTestStarted,
      currentIndex,
      testContentIds: testContents.map((content) => content.id),
    });
  }, [
    currentIndex,
    isLoaded,
    isTestStarted,
    serializedRatings,
    skippedIds,
    testContents,
  ]);
}
