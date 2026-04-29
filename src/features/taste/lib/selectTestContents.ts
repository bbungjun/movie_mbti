import { StreamingContent } from '../types';

type AxisName = 'pace' | 'drive' | 'focus';
type PoleCode = 'D' | 'A' | 'C' | 'E' | 'P' | 'R';
type AxisSignalMap = Record<AxisName, number>;

const AXIS_POLES: Array<{
  code: PoleCode;
  axis: AxisName;
  key: keyof StreamingContent['profileAxes'];
  oppositeKey: keyof StreamingContent['profileAxes'];
}> = [
  { code: 'D', axis: 'pace', key: 'dopamine', oppositeKey: 'afterglow' },
  { code: 'A', axis: 'pace', key: 'afterglow', oppositeKey: 'dopamine' },
  { code: 'C', axis: 'drive', key: 'concept', oppositeKey: 'emotionDriven' },
  { code: 'E', axis: 'drive', key: 'emotionDriven', oppositeKey: 'concept' },
  { code: 'P', axis: 'focus', key: 'plotDriven', oppositeKey: 'relationshipDriven' },
  { code: 'R', axis: 'focus', key: 'relationshipDriven', oppositeKey: 'plotDriven' },
];

const ANCHOR_GAP_WEIGHT = 0.72;
const ANCHOR_ABSOLUTE_WEIGHT = 0.28;
const GENRE_DIVERSITY_BONUS = 14;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getAxisSignals(content: StreamingContent): AxisSignalMap {
  const { profileAxes } = content;

  return {
    pace: (profileAxes.dopamine - profileAxes.afterglow) / 100,
    drive: (profileAxes.concept - profileAxes.emotionDriven) / 100,
    focus: (profileAxes.plotDriven - profileAxes.relationshipDriven) / 100,
  };
}

function getPoleGap(
  content: StreamingContent,
  pole: (typeof AXIS_POLES)[number]
) {
  const { profileAxes } = content;
  return profileAxes[pole.key] - profileAxes[pole.oppositeKey];
}

function getAnchorScore(
  content: StreamingContent,
  pole: (typeof AXIS_POLES)[number]
) {
  const { profileAxes } = content;
  const targetValue = profileAxes[pole.key];
  const gap = getPoleGap(content, pole);

  return gap * ANCHOR_GAP_WEIGHT + targetValue * ANCHOR_ABSOLUTE_WEIGHT;
}

function compareByScoreThenId<T extends { score: number; content: StreamingContent }>(
  left: T,
  right: T
) {
  if (right.score !== left.score) {
    return right.score - left.score;
  }

  return left.content.id.localeCompare(right.content.id);
}

function getRankedPoleCandidates(
  allContents: StreamingContent[],
  selectedIds: Set<string>,
  pole: (typeof AXIS_POLES)[number]
) {
  return allContents
    .filter((content) => !selectedIds.has(content.id))
    .map((content) => ({
      content,
      gap: getPoleGap(content, pole),
      score: getAnchorScore(content, pole),
    }))
    .filter((item) => item.gap > 0)
    .sort(compareByScoreThenId);
}

function selectAxisAnchors(
  allContents: StreamingContent[],
  count: number
) {
  const selected: StreamingContent[] = [];
  const selectedIds = new Set<string>();
  const remainingPoles = [...AXIS_POLES];
  const anchorTarget = Math.min(count, AXIS_POLES.length);

  while (selected.length < anchorTarget && remainingPoles.length > 0) {
    const candidatePools = remainingPoles
      .map((pole) => ({
        pole,
        candidates: getRankedPoleCandidates(allContents, selectedIds, pole),
      }))
      .filter((pool) => pool.candidates.length > 0);

    if (candidatePools.length === 0) {
      break;
    }

    candidatePools.sort((left, right) => {
      if (left.candidates.length !== right.candidates.length) {
        return left.candidates.length - right.candidates.length;
      }

      const leftTopScore = left.candidates[0]?.score ?? -Infinity;
      const rightTopScore = right.candidates[0]?.score ?? -Infinity;
      if (rightTopScore !== leftTopScore) {
        return rightTopScore - leftTopScore;
      }

      return left.pole.code.localeCompare(right.pole.code);
    });

    const chosenPool = candidatePools[0];
    const chosenCandidate = chosenPool.candidates[0];

    selected.push(chosenCandidate.content);
    selectedIds.add(chosenCandidate.content.id);

    const chosenIndex = remainingPoles.findIndex(
      (pole) => pole.code === chosenPool.pole.code
    );
    if (chosenIndex >= 0) {
      remainingPoles.splice(chosenIndex, 1);
    }
  }

  return {
    selected,
    selectedIds,
  };
}

function getBalanceError(selected: StreamingContent[]) {
  if (selected.length === 0) {
    return Infinity;
  }

  const signalTotals = selected.reduce<AxisSignalMap>(
    (acc, content) => {
      const signals = getAxisSignals(content);
      acc.pace += signals.pace;
      acc.drive += signals.drive;
      acc.focus += signals.focus;
      return acc;
    },
    { pace: 0, drive: 0, focus: 0 }
  );

  const meanSignals = {
    pace: signalTotals.pace / selected.length,
    drive: signalTotals.drive / selected.length,
    focus: signalTotals.focus / selected.length,
  };

  return (
    meanSignals.pace ** 2 +
    meanSignals.drive ** 2 +
    meanSignals.focus ** 2
  );
}

function getGenreNoveltyRatio(
  candidate: StreamingContent,
  selected: StreamingContent[]
) {
  if (selected.length === 0) {
    return 1;
  }

  const selectedGenres = new Set(selected.flatMap((content) => content.genres));
  const newGenres = candidate.genres.filter((genre) => !selectedGenres.has(genre));

  return newGenres.length / Math.max(candidate.genres.length, 1);
}

function getBalanceCandidateScore(
  candidate: StreamingContent,
  selected: StreamingContent[]
) {
  const currentError = getBalanceError(selected);
  const projectedError = getBalanceError([...selected, candidate]);
  const balanceImprovement =
    Number.isFinite(currentError) ? currentError - projectedError : 0;
  const genreNovelty = getGenreNoveltyRatio(candidate, selected);

  return balanceImprovement * 100 + genreNovelty * GENRE_DIVERSITY_BONUS;
}

function fillBalanceSlots(
  allContents: StreamingContent[],
  selected: StreamingContent[],
  selectedIds: Set<string>,
  count: number
) {
  while (selected.length < count) {
    const candidates = allContents
      .filter((content) => !selectedIds.has(content.id))
      .map((content) => ({
        content,
        score: getBalanceCandidateScore(content, selected),
      }))
      .sort(compareByScoreThenId);

    const nextCandidate = candidates[0];
    if (!nextCandidate) {
      break;
    }

    selected.push(nextCandidate.content);
    selectedIds.add(nextCandidate.content.id);
  }

  return selected;
}

export function selectTestContents(
  allContents: StreamingContent[],
  count = 10
): StreamingContent[] {
  const safeCount = clamp(count, 0, allContents.length);
  if (allContents.length <= safeCount) {
    return [...allContents];
  }

  const { selected, selectedIds } = selectAxisAnchors(allContents, safeCount);

  return fillBalanceSlots(allContents, selected, selectedIds, safeCount);
}
