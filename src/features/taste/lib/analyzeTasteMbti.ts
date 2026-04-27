import { FALLBACK_RESULT_COPY, RESULT_COPY } from '../data/resultCopy';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import { ContentRating, StreamingContent, TasteAxisResult, TasteMbtiResult } from '../types';
import { recommendContents } from './recommendContents';

const TRAIT_KEYS = [
  'stimulation',
  'emotion',
  'imagination',
  'realism',
  'structure',
  'relationship',
  'closure',
  'novelty',
] as const;

const TRAIT_AVERAGES = STREAMING_CONTENTS.reduce(
  (acc, content, _, contents) => {
    TRAIT_KEYS.forEach((key) => {
      acc[key] += content.traits[key] / contents.length;
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

function getConfidence(leftScore: number, rightScore: number): TasteAxisResult['confidence'] {
  const total = Math.abs(leftScore) + Math.abs(rightScore) || 1;
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
  rightLabel: string,
  selectedCode: string = leftScore >= rightScore ? leftCode : rightCode
): TasteAxisResult {
  return {
    axis,
    leftCode,
    rightCode,
    selectedCode,
    label,
    leftLabel,
    rightLabel,
    confidence: getConfidence(leftScore, rightScore),
    leftScore,
    rightScore,
  };
}

function pickTieBreaker(seed: string, leftCode: string, rightCode: string) {
  const hash = Array.from(seed).reduce(
    (acc, character) => acc + character.charCodeAt(0),
    0
  );
  return hash % 2 === 0 ? leftCode : rightCode;
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
      const preferenceWeight = item.rating.rating - 3;
      TRAIT_KEYS.forEach((key) => {
        acc[key] +=
          (item.content.traits[key] - TRAIT_AVERAGES[key]) * preferenceWeight;
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

  const buildPreferenceAxisResult = (
    axis: TasteAxisResult['axis'],
    leftCode: string,
    rightCode: string,
    leftScore: number,
    rightScore: number,
    label: string,
    leftLabel: string,
    rightLabel: string
  ) => {
    const differential = leftScore - rightScore;
    const selectedCode =
      Math.abs(differential) < 0.0001
        ? pickTieBreaker(`${sessionId}:${axis}`, leftCode, rightCode)
        : differential > 0
          ? leftCode
          : rightCode;

    return buildAxisResult(
      axis,
      leftCode,
      rightCode,
      Math.max(differential, 0),
      Math.max(-differential, 0),
      label,
      leftLabel,
      rightLabel,
      selectedCode
    );
  };

  const axisResults = [
    buildPreferenceAxisResult(
      'energy',
      'E',
      'I',
      score.stimulation,
      score.emotion,
      '몰입 방향',
      '자극 반응',
      '감정 몰입'
    ),
    buildPreferenceAxisResult(
      'world',
      'N',
      'S',
      score.imagination,
      score.realism,
      '선호 세계',
      '세계관 탐색',
      '현실 공감'
    ),
    buildPreferenceAxisResult(
      'decision',
      'T',
      'F',
      score.structure,
      score.relationship,
      '선호 포인트',
      '플롯 완성도',
      '관계 서사'
    ),
    buildPreferenceAxisResult(
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
  const preferredTraits = Object.entries(score)
    .sort((a, b) => b[1] - a[1])
    .filter(([, value]) => value > 0)
    .slice(0, 3)
    .map(([trait]) => trait);
  const topTraits =
    preferredTraits.length > 0
      ? preferredTraits
      : Object.entries(score)
          .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
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
