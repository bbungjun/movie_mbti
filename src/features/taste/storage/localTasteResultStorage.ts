import { ContentRating, TasteMbtiResult } from '../types';

const STORAGE_KEYS = {
  RESULTS: 'tasteProfileResultsV2',
  IN_PROGRESS: 'tasteTestInProgressV3',
} as const;

export interface InProgressTasteTest {
  ratings: ContentRating[];
  skippedContentIds: string[];
  isTestStarted: boolean;
  currentIndex: number;
  testContentIds: string[];
}

/**
 * 완료된 테스트 결과 저장
 */
export function saveTasteResult(result: TasteMbtiResult): string {
  if (typeof window !== 'undefined') {
    const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '{}');
    results[result.id] = result;
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  }

  return result.id;
}

/**
 * 완료된 테스트 결과 조회
 */
export function getTasteResult(id: string): TasteMbtiResult | null {
  if (typeof window === 'undefined') return null;

  const results = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESULTS) || '{}');
  return results[id] || null;
}

/**
 * 모든 완료 결과 삭제
 */
export function clearTasteResults(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.RESULTS);
  }
}

/**
 * 진행 중인 테스트 상태 저장
 */
export function saveInProgressTest(data: InProgressTasteTest): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.IN_PROGRESS, JSON.stringify(data));
  }
}

/**
 * 진행 중인 테스트 상태 로드
 */
export function loadInProgressTest(): InProgressTasteTest | null {
  if (typeof window === 'undefined') return null;

  const data = localStorage.getItem(STORAGE_KEYS.IN_PROGRESS);
  if (!data) return null;

  try {
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to parse in-progress test data', e);
    return null;
  }
}

/**
 * 진행 중인 테스트 상태 삭제
 */
export function clearInProgressTest(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS);
  }
}
