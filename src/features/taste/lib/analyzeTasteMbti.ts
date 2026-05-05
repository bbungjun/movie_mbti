import { FALLBACK_RESULT_COPY, RESULT_COPY } from '../data/resultCopy';
import { STREAMING_CONTENTS } from '../data/streamingContents';
import {
  ContentRating,
  StreamingContent,
  TasteAxisResult,
  TasteMbtiResult,
  TasteProfileAxes,
} from '../types';
import { recommendContents } from './recommendContents';

type AxisName = TasteAxisResult['axis'];
type AxisSignalMap = Record<AxisName, number>;

const AXIS_CONFIG = [
  {
    axis: 'pace',
    leftCode: 'D',
    rightCode: 'A',
    leftKey: 'dopamine',
    rightKey: 'afterglow',
    label: '반응 리듬',
    leftLabel: '도파민',
    rightLabel: '여운',
  },
  {
    axis: 'drive',
    leftCode: 'C',
    rightCode: 'E',
    leftKey: 'concept',
    rightKey: 'emotionDriven',
    label: '작품 구동력',
    leftLabel: '설정 주도',
    rightLabel: '정서 주도',
  },
  {
    axis: 'focus',
    leftCode: 'P',
    rightCode: 'R',
    leftKey: 'plotDriven',
    rightKey: 'relationshipDriven',
    label: '몰입 포인트',
    leftLabel: '이야기 전개',
    rightLabel: '관계 주도',
  },
] as const;

const RATING_WEIGHTS: Record<number, number> = {
  1: -1,
  2: -0.5,
  3: 0,
  4: 0.5,
  5: 1,
};

const AXIS_WEIGHT_FLOOR = 0.15;
const AXIS_WEIGHT_POWER = 4;
const CONTENT_WEIGHT_BASE = 0.45;
const CONTENT_WEIGHT_RANGE = 0.55;
const RELATIVE_BLEND = 0.08;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getRatingWeight(rating: number) {
  const rounded = Math.round(rating);
  return RATING_WEIGHTS[rounded] ?? clamp((rating - 3) / 2, -1, 1);
}

function getRelativeWeight(rating: number, averageRating: number) {
  return clamp((rating - averageRating) / 2, -1, 1);
}

function createEmptyAxisMap(): AxisSignalMap {
  return {
    pace: 0,
    drive: 0,
    focus: 0,
  };
}

function getContentAxisSignals(content: StreamingContent): AxisSignalMap {
  const { profileAxes } = content;

  return {
    pace: (profileAxes.dopamine - profileAxes.afterglow) / 100,
    drive: (profileAxes.concept - profileAxes.emotionDriven) / 100,
    focus: (profileAxes.plotDriven - profileAxes.relationshipDriven) / 100,
  };
}

function getAxisProminenceWeights(signals: AxisSignalMap): AxisSignalMap {
  const maxSignal = Math.max(
    ...Object.values(signals).map((value) => Math.abs(value)),
    0
  );

  if (maxSignal < 0.0001) {
    return {
      pace: AXIS_WEIGHT_FLOOR,
      drive: AXIS_WEIGHT_FLOOR,
      focus: AXIS_WEIGHT_FLOOR,
    };
  }

  return Object.fromEntries(
    Object.entries(signals).map(([axis, value]) => {
      const ratio = Math.abs(value) / maxSignal;
      const weight =
        AXIS_WEIGHT_FLOOR +
        (1 - AXIS_WEIGHT_FLOOR) * Math.pow(ratio, AXIS_WEIGHT_POWER);
      return [axis, weight];
    })
  ) as AxisSignalMap;
}

function getContentWeight(profileAxes: TasteProfileAxes) {
  const pairGaps = [
    Math.abs(profileAxes.dopamine - profileAxes.afterglow),
    Math.abs(profileAxes.concept - profileAxes.emotionDriven),
    Math.abs(profileAxes.plotDriven - profileAxes.relationshipDriven),
  ];
  const strongestGap = Math.max(...pairGaps, 0) / 100;
  return CONTENT_WEIGHT_BASE + strongestGap * CONTENT_WEIGHT_RANGE;
}

function getAxisScores(
  ratedContents: Array<{ rating: ContentRating; content: StreamingContent }>
) {
  if (ratedContents.length === 0) {
    return createEmptyAxisMap();
  }

  const averageRating =
    ratedContents.reduce((sum, item) => sum + item.rating.rating, 0) /
    ratedContents.length;

  const baseNumerator = createEmptyAxisMap();
  const baseDenominator = createEmptyAxisMap();
  const relativeNumerator = createEmptyAxisMap();
  const relativeDenominator = createEmptyAxisMap();

  ratedContents.forEach((item) => {
    const { profileAxes } = item.content;
    const signals = getContentAxisSignals(item.content);
    const prominenceWeights = getAxisProminenceWeights(signals);
    const contentWeight = getContentWeight(profileAxes);
    const ratingWeight = getRatingWeight(item.rating.rating);
    const relativeWeight = getRelativeWeight(item.rating.rating, averageRating);

    AXIS_CONFIG.forEach(({ axis }) => {
      const effectiveWeight = prominenceWeights[axis] * contentWeight;
      const signal = signals[axis];

      baseNumerator[axis] += ratingWeight * signal * effectiveWeight;
      baseDenominator[axis] += Math.abs(ratingWeight) * effectiveWeight;

      relativeNumerator[axis] += relativeWeight * signal * effectiveWeight;
      relativeDenominator[axis] += Math.abs(relativeWeight) * effectiveWeight;
    });
  });

  return AXIS_CONFIG.reduce((acc, { axis }) => {
    const baseScore =
      baseDenominator[axis] > 0
        ? baseNumerator[axis] / baseDenominator[axis]
        : 0;
    const relativeScore =
      relativeDenominator[axis] > 0
        ? relativeNumerator[axis] / relativeDenominator[axis]
        : 0;

    acc[axis] = clamp(
      baseScore * (1 - RELATIVE_BLEND) + relativeScore * RELATIVE_BLEND,
      -1,
      1
    );

    return acc;
  }, createEmptyAxisMap());
}

function getConfidence(leftScore: number, rightScore: number): TasteAxisResult['confidence'] {
  const total = Math.abs(leftScore) + Math.abs(rightScore) || 1;
  const gap = Math.abs(leftScore - rightScore) / total;
  if (gap > 0.42) return 'high';
  if (gap > 0.18) return 'medium';
  return 'mixed';
}

function pickTieBreaker(seed: string, leftCode: string, rightCode: string) {
  const hash = Array.from(seed).reduce(
    (acc, character) => acc + character.charCodeAt(0),
    0
  );
  return hash % 2 === 0 ? leftCode : rightCode;
}

function buildAxisResult(
  config: (typeof AXIS_CONFIG)[number],
  axisScore: number,
  sessionId: string
): TasteAxisResult {
  const leftScore = clamp(0.5 + axisScore / 2, 0, 1);
  const rightScore = clamp(0.5 - axisScore / 2, 0, 1);
  const selectedCode =
    Math.abs(axisScore) < 0.0001
      ? pickTieBreaker(
          `${sessionId}:${config.axis}`,
          config.leftCode,
          config.rightCode
        )
      : axisScore >= 0
        ? config.leftCode
        : config.rightCode;

  return {
    axis: config.axis,
    leftCode: config.leftCode,
    rightCode: config.rightCode,
    selectedCode,
    label: config.label,
    leftLabel: config.leftLabel,
    rightLabel: config.rightLabel,
    confidence: getConfidence(leftScore, rightScore),
    leftScore,
    rightScore,
  };
}

function getTopTraits(
  axisScores: AxisSignalMap,
  axisResults: TasteAxisResult[]
): Array<keyof TasteProfileAxes> {
  const selectedKeys = AXIS_CONFIG.map((config) => {
    const axisResult = axisResults.find((item) => item.axis === config.axis);
    const selectedCode = axisResult?.selectedCode ?? config.leftCode;

    return {
      key:
        selectedCode === config.leftCode ? config.leftKey : config.rightKey,
      weight: Math.abs(axisScores[config.axis]),
    };
  });

  return selectedKeys
    .sort((a, b) => b.weight - a.weight)
    .map((item) => item.key);
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
    .filter(
      (item): item is { rating: ContentRating; content: StreamingContent } =>
        Boolean(item.content)
    );

  const axisScores = getAxisScores(ratedContents);
  const axisResults = AXIS_CONFIG.map((config) =>
    buildAxisResult(config, axisScores[config.axis], sessionId)
  );

  const code = axisResults.map((axis) => axis.selectedCode).join('');
  const copy = RESULT_COPY[code] ?? FALLBACK_RESULT_COPY;

  return {
    ...copy,
    code,
    id,
    sessionId,
    axisResults,
    topTraits: getTopTraits(axisScores, axisResults),
    ratings,
    skippedContentIds,
    recommendedContentIds: recommendContents(
      ratings,
      axisResults,
      skippedContentIds
    ),
    createdAt: new Date().toISOString(),
  };
}
