import { describe, expect, it } from 'vitest';
import { analyzeTasteMbti } from './analyzeTasteMbti';

const SAMPLE_RATINGS = [
  { contentId: 'squid-game', rating: 5 },
  { contentId: 'kingdom', rating: 5 },
  { contentId: 'forest-of-secrets', rating: 4 },
  { contentId: 'when-life-gives-you-tangerines', rating: 2 },
  { contentId: 'reply-1988', rating: 1 },
];

describe('analyzeTasteMbti', () => {
  it('builds the expected profile result for a fixed ratings fixture', () => {
    const result = analyzeTasteMbti(
      SAMPLE_RATINGS,
      'session-1',
      'result-1',
      ['dp']
    );

    expect(result.id).toBe('result-1');
    expect(result.sessionId).toBe('session-1');
    expect(result.code).toBe('DCP');
    expect(result.topTraits).toEqual([
      'dopamine',
      'concept',
      'plotDriven',
    ]);
    expect(result.axisResults.map((axis) => axis.selectedCode)).toEqual([
      'D',
      'C',
      'P',
    ]);
    expect(result.axisResults.map((axis) => axis.confidence)).toEqual([
      'high',
      'high',
      'medium',
    ]);
    expect(result.skippedContentIds).toEqual(['dp']);
  });

  it('keeps recommendations to unrated and unskipped contents', () => {
    const result = analyzeTasteMbti(
      SAMPLE_RATINGS,
      'session-1',
      'result-1',
      ['dp']
    );
    const excludedIds = new Set([
      ...SAMPLE_RATINGS.map((rating) => rating.contentId),
      'dp',
    ]);

    expect(result.recommendedContentIds).toHaveLength(4);
    expect(
      result.recommendedContentIds.every((contentId) => !excludedIds.has(contentId))
    ).toBe(true);
  });
});
