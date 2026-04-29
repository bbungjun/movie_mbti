'use client';

import { useTasteTestPersistence } from './useTasteTestPersistence';
import { useTasteTestSession } from './useTasteTestSession';
import { useTasteTestSubmission } from './useTasteTestSubmission';
import { useTasteTestViewModel } from './useTasteTestViewModel';

export function useTasteTest() {
  const session = useTasteTestSession();
  useTasteTestPersistence(session);

  const submission = useTasteTestSubmission(session);
  const viewModel = useTasteTestViewModel(session);

  return {
    ...viewModel,
    ...session,
    ...submission,
    totalCount: session.testContents.length,
  };
}
