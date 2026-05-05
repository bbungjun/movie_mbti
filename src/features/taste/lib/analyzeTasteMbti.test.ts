import { describe, expect, it } from 'vitest';
import { RESULT_COPY } from '../data/resultCopy';
import { ContentRating } from '../types';
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

  it.each([
    {
      code: 'DCP',
      ratings: [{ contentId: 'squid-game', rating: 5 }],
    },
    {
      code: 'DCR',
      ratings: [
        { contentId: 'all-of-us-are-dead', rating: 5 },
        { contentId: 'gyeongseong-creature', rating: 5 },
      ],
    },
    {
      code: 'DEP',
      ratings: [{ contentId: 'bloodhounds', rating: 5 }],
    },
    {
      code: 'DER',
      ratings: [{ contentId: 'all-of-us-are-dead', rating: 5 }],
    },
    {
      code: 'ACP',
      ratings: [{ contentId: 'forest-of-secrets', rating: 5 }],
    },
    {
      code: 'ACR',
      ratings: [{ contentId: 'alchemy-of-souls', rating: 5 }],
    },
    {
      code: 'AEP',
      ratings: [{ contentId: 'the-glory', rating: 5 }],
    },
    {
      code: 'AER',
      ratings: [{ contentId: 'when-life-gives-you-tangerines', rating: 5 }],
    },
  ] satisfies Array<{ code: keyof typeof RESULT_COPY; ratings: ContentRating[] }>)(
    'classifies ratings as $code and returns the matching result copy',
    ({ code, ratings }) => {
      const result = analyzeTasteMbti(
        ratings,
        `session-${code}`,
        `result-${code}`
      );

      expect(result.code).toBe(code);
      expect(result.axisResults.map((axis) => axis.selectedCode).join('')).toBe(
        code
      );
      expect(result.title).toBe(RESULT_COPY[code].title);
      expect(result.subtitle).toBe(RESULT_COPY[code].subtitle);
      expect(result.description).toBe(RESULT_COPY[code].description);
      expect(result.strengths).toEqual(RESULT_COPY[code].strengths);
      expect(result.watchStyle).toBe(RESULT_COPY[code].watchStyle);
    }
  );
});
