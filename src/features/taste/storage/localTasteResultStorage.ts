import { TasteMbtiResult } from '../types';

const STORAGE_KEY = 'tasteMbtiResults';

export function saveTasteResult(result: TasteMbtiResult): string {
  if (typeof window !== 'undefined') {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    results[result.id] = result;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }

  return result.id;
}

export function getTasteResult(id: string): TasteMbtiResult | null {
  if (typeof window === 'undefined') return null;

  const results = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return results[id] || null;
}

export function clearTasteResults(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
