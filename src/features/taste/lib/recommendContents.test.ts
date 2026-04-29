import { describe, expect, it } from 'vitest';
import { TasteAxisResult } from '../types';
import { recommendContents } from './recommendContents';

const SAMPLE_RATINGS = [
  { contentId: 'squid-game', rating: 5 },
  { contentId: 'kingdom', rating: 5 },
  { contentId: 'forest-of-secrets', rating: 4 },
  { contentId: 'when-life-gives-you-tangerines', rating: 2 },
  { contentId: 'reply-1988', rating: 1 },
];

const SAMPLE_AXES: TasteAxisResult[] = [
  {
    axis: 'pace',
    leftCode: 'D',
    rightCode: 'A',
    selectedCode: 'D',
    label: '반응 리듬',
    leftLabel: '도파민',
    rightLabel: '여운',
    confidence: 'high',
    leftScore: 0.91,
    rightScore: 0.09,
  },
  {
    axis: 'drive',
    leftCode: 'C',
    rightCode: 'E',
    selectedCode: 'C',
    label: '작품 구동축',
    leftLabel: '설정 주도',
    rightLabel: '정서 주도',
    confidence: 'high',
    leftScore: 0.87,
    rightScore: 0.13,
  },
  {
    axis: 'focus',
    leftCode: 'P',
    rightCode: 'R',
    selectedCode: 'P',
    label: '몰입 포인트',
    leftLabel: '플롯 주도',
    rightLabel: '관계 주도',
    confidence: 'medium',
    leftScore: 0.69,
    rightScore: 0.31,
  },
];

describe('recommendContents', () => {
  it('returns stable recommendations aligned to the selected axes', () => {
    const recommendations = recommendContents(SAMPLE_RATINGS, SAMPLE_AXES, ['dp']);

    expect(recommendations).toEqual([
      'the-8-show',
      'gyeongseong-creature',
      'a-killer-paradox',
      'mask-girl',
    ]);
  });

  it('never recommends already rated or skipped contents', () => {
    const recommendations = recommendContents(SAMPLE_RATINGS, SAMPLE_AXES, ['dp']);
    const excludedIds = new Set([
      ...SAMPLE_RATINGS.map((rating) => rating.contentId),
      'dp',
    ]);

    expect(recommendations.every((contentId) => !excludedIds.has(contentId))).toBe(
      true
    );
    expect(new Set(recommendations).size).toBe(recommendations.length);
  });
});
