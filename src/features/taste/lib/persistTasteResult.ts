import { TasteMbtiResult } from '../types';

export async function persistTasteResult(result: TasteMbtiResult) {
  const response = await fetch('/api/taste-results', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error(`Failed to persist taste result: ${response.status}`);
  }
}
