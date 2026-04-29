'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewSession } from '@/lib/utils';
import { analyzeTasteMbti } from '../lib/analyzeTasteMbti';
import {
  clearInProgressTest,
  saveTasteResult,
} from '../storage/localTasteResultStorage';
import { useTasteTestSession } from './useTasteTestSession';

type TasteTestSession = ReturnType<typeof useTasteTestSession>;

export function useTasteTestSubmission(session: TasteTestSession) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingResultId, setPendingResultId] = useState<string | null>(null);

  useEffect(() => {
    if (!pendingResultId) {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.push(`/result/${pendingResultId}`);
    }, 4000);

    return () => window.clearTimeout(timeout);
  }, [pendingResultId, router]);

  const submit = useCallback(() => {
    if (!session.canSubmit || isSubmitting || pendingResultId !== null) {
      return;
    }

    setIsSubmitting(true);

    const sessionId = createNewSession();
    const skippedContentIds = Array.from(session.skippedIds);
    const result = analyzeTasteMbti(
      session.serializedRatings,
      sessionId,
      undefined,
      skippedContentIds
    );

    saveTasteResult(result);
    clearInProgressTest();
    setPendingResultId(result.id);
  }, [
    isSubmitting,
    pendingResultId,
    session.canSubmit,
    session.serializedRatings,
    session.skippedIds,
  ]);

  return {
    submit,
    isSubmitting,
    isAnalyzing: pendingResultId !== null,
  };
}
