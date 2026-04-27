import { FALLBACK_RESULT_COPY, RESULT_COPY } from '../data/resultCopy';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { ContentRating, StreamingContent, TasteAxisResult, TasteMbtiResult } from '../types';
import { recommendContents } from './recommendContents';

function getConfidence(leftScore: number, rightScore: number): TasteAxisResult['confidence'] {
  const total = leftScore + rightScore || 1;
  const gap = Math.abs(leftScore - rightScore) / total;
  if (gap > 0.22) return 'high';
  if (gap > 0.1) return 'medium';
  return 'mixed';
}

function buildAxisResult(
  axis: TasteAxisResult['axis'],
  leftCode: string,
  rightCode: string,
  leftScore: number,
  rightScore: number,
  label: string,
  leftLabel: string,
  rightLabel: string
): TasteAxisResult {
  return {
    axis,
    leftCode,
    rightCode,
    selectedCode: leftScore >= rightScore ? leftCode : rightCode,
    label,
    leftLabel,
    rightLabel,
    confidence: getConfidence(leftScore, rightScore),
    leftScore,
    rightScore,
  };
}

export function analyzeTasteMbti(
  ratings: ContentRating[],
  sessionId: string,
  id: string = crypto.randomUUID(),
  skippedContentIds: string[] = []
): TasteMbtiResult {
  const ratedContents = ratings
    .map((rating) => ({
      rating,
      content: STREAMING_CONTENTS.find((item) => item.id === rating.contentId),
    }))
    .filter((item): item is { rating: ContentRating; content: StreamingContent } => Boolean(item.content));

  const score = ratedContents.reduce(
    (acc, item) => {
      const weight = item.rating.rating;
      Object.entries(item.content.traits).forEach(([key, value]) => {
        acc[key as keyof typeof acc] += value * weight;
      });
      return acc;
    },
    {
      stimulation: 0,
      emotion: 0,
      imagination: 0,
      realism: 0,
      structure: 0,
      relationship: 0,
      closure: 0,
      novelty: 0,
    }
  );

  const axisResults = [
    buildAxisResult(
      'energy',
      'E',
      'I',
      score.stimulation,
      score.emotion,
      '몰입 방향',
      '자극 반응',
      '감정 몰입'
    ),
    buildAxisResult(
      'world',
      'N',
      'S',
      score.imagination,
      score.realism,
      '선호 세계',
      '세계관 탐색',
      '현실 공감'
    ),
    buildAxisResult(
      'decision',
      'T',
      'F',
      score.structure,
      score.relationship,
      '선호 포인트',
      '플롯 완성도',
      '관계 서사'
    ),
    buildAxisResult(
      'rhythm',
      'J',
      'P',
      score.closure,
      score.novelty,
      '시청 리듬',
      '정리된 결말',
      '새로운 변주'
    ),
  ];

  const code = axisResults.map((axis) => axis.selectedCode).join('');
  const copy = RESULT_COPY[code] ?? FALLBACK_RESULT_COPY;
  const topTraits = Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([trait]) => trait);

  return {
    ...copy,
    code,
    id,
    sessionId,
    axisResults,
    topTraits,
    ratings,
    skippedContentIds,
    recommendedContentIds: recommendContents(ratings, axisResults, skippedContentIds),
    createdAt: new Date().toISOString(),
  };
}
