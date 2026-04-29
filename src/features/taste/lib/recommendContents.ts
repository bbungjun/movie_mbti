import { STREAMING_CONTENTS } from '../data/streamingContents';
import {
  ContentRating,
  StreamingContent,
  TasteAxisResult,
  TasteProfileAxes,
} from '../types';

const PROFILE_KEYS: Array<keyof TasteProfileAxes> = [
  'dopamine',
  'afterglow',
  'concept',
  'emotionDriven',
  'plotDriven',
  'relationshipDriven',
];

function buildTasteProfile(ratings: ContentRating[]) {
  const ratedContents = ratings
    .map((rating) => ({
      rating,
      content: STREAMING_CONTENTS.find((item) => item.id === rating.contentId),
    }))
    .filter(
      (item): item is { rating: ContentRating; content: StreamingContent } =>
        Boolean(item.content)
    );

  if (ratedContents.length === 0) {
    return null;
  }

  const weightedTotals = ratedContents.reduce(
    (acc, item) => {
      const weight = item.rating.rating;
      const { profileAxes } = item.content;

      PROFILE_KEYS.forEach((key) => {
        acc[key] += profileAxes[key] * weight;
      });
      acc.totalWeight += weight;
      return acc;
    },
    {
      dopamine: 0,
      afterglow: 0,
      concept: 0,
      emotionDriven: 0,
      plotDriven: 0,
      relationshipDriven: 0,
      totalWeight: 0,
    }
  );

  const totalWeight = weightedTotals.totalWeight || 1;

  return {
    dopamine: weightedTotals.dopamine / totalWeight,
    afterglow: weightedTotals.afterglow / totalWeight,
    concept: weightedTotals.concept / totalWeight,
    emotionDriven: weightedTotals.emotionDriven / totalWeight,
    plotDriven: weightedTotals.plotDriven / totalWeight,
    relationshipDriven: weightedTotals.relationshipDriven / totalWeight,
  };
}

function getAxisScore(content: StreamingContent, preferred: Set<string>) {
  const { profileAxes } = content;
  let score = 0;

  if (preferred.has('D')) score += profileAxes.dopamine;
  if (preferred.has('A')) score += profileAxes.afterglow;
  if (preferred.has('C')) score += profileAxes.concept;
  if (preferred.has('E')) score += profileAxes.emotionDriven;
  if (preferred.has('P')) score += profileAxes.plotDriven;
  if (preferred.has('R')) score += profileAxes.relationshipDriven;

  return score;
}

function getGenreSimilarity(content: StreamingContent, reference: StreamingContent) {
  const referenceGenres = new Set(reference.genres);
  const sharedCount = content.genres.filter((genre) => referenceGenres.has(genre)).length;
  return sharedCount / Math.max(content.genres.length, reference.genres.length, 1);
}

const MAX_L2_DISTANCE = 100 * Math.sqrt(PROFILE_KEYS.length);

function getProfileSimilarity(
  content: StreamingContent,
  profile: TasteProfileAxes | null
) {
  if (!profile) return 0;

  const { profileAxes: contentProfile } = content;
  const squaredDistance = PROFILE_KEYS.reduce(
    (sum, key) => sum + Math.pow(contentProfile[key] - profile[key], 2),
    0
  );

  return 1 - Math.sqrt(squaredDistance) / MAX_L2_DISTANCE;
}

function getPreferenceReferences(ratings: ContentRating[]) {
  const ratedContents = ratings
    .map((rating) => ({
      rating,
      content: STREAMING_CONTENTS.find((item) => item.id === rating.contentId),
    }))
    .filter(
      (item): item is { rating: ContentRating; content: StreamingContent } =>
        Boolean(item.content)
    );

  const fiveStarContents = ratedContents.filter((item) => item.rating.rating === 5);
  if (fiveStarContents.length > 0) return fiveStarContents;

  const highRatedContents = ratedContents.filter((item) => item.rating.rating >= 4);
  if (highRatedContents.length > 0) return highRatedContents;

  return ratedContents;
}

export function recommendContents(
  ratings: ContentRating[],
  axes: TasteAxisResult[],
  skippedContentIds: string[] = []
): string[] {
  const ratedIds = new Set(ratings.map((rating) => rating.contentId));
  const preferred = new Set(axes.map((axis) => axis.selectedCode));
  const skippedIds = new Set(skippedContentIds);
  const preferenceReferences = getPreferenceReferences(ratings);
  const tasteProfile = buildTasteProfile(ratings);

  return STREAMING_CONTENTS
    .filter((content) => !ratedIds.has(content.id))
    .map((content) => {
      const referenceScore = preferenceReferences.reduce((sum, reference) => {
        const genreScore = getGenreSimilarity(content, reference.content) * 45;
        const profileScore =
          getProfileSimilarity(content, reference.content.profileAxes) * 25;
        const ratingWeight = reference.rating.rating / 5;
        return sum + (genreScore + profileScore) * ratingWeight;
      }, 0);
      const averageReferenceScore =
        preferenceReferences.length > 0
          ? referenceScore / preferenceReferences.length
          : 0;
      const profileScore = getProfileSimilarity(content, tasteProfile) * 30;
      const axisScore = getAxisScore(content, preferred) * 0.04;
      const skippedScore = skippedIds.has(content.id) ? 8 : 0;
      const score = averageReferenceScore + profileScore + axisScore + skippedScore;
      return { id: content.id, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.id);
}
