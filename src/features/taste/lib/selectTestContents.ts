import { StreamingContent } from '../types';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }
  return shuffled;
}

export function selectTestContents(
  allContents: StreamingContent[],
  count = 10
): StreamingContent[] {
  const safeCount = clamp(count, 0, allContents.length);
  return shuffleArray(allContents).slice(0, safeCount);
}
