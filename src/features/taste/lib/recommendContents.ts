import { STREAMING_CONTENTS } from '../data/streamingContents';
import { ContentRating, StreamingContent, TasteAxisResult, TasteTraits } from '../types';

const TRAIT_KEYS: Array<keyof TasteTraits> = [
  'stimulation',
  'emotion',
  'imagination',
  'realism',
  'structure',
  'relationship',
  'closure',
  'novelty',
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
      TRAIT_KEYS.forEach((key) => {
        acc[key] += item.content.traits[key] * weight;
      });
      acc.totalWeight += weight;
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
      totalWeight: 0,
    }
  );

  const totalWeight = weightedTotals.totalWeight || 1;

  return {
    stimulation: weightedTotals.stimulation / totalWeight,
    emotion: weightedTotals.emotion / totalWeight,
    imagination: weightedTotals.imagination / totalWeight,
    realism: weightedTotals.realism / totalWeight,
    structure: weightedTotals.structure / totalWeight,
    relationship: weightedTotals.relationship / totalWeight,
    closure: weightedTotals.closure / totalWeight,
    novelty: weightedTotals.novelty / totalWeight,
  };
}

function getAxisScore(content: StreamingContent, preferred: Set<string>) {
  let score = 0;
  if (preferred.has('E')) score += content.traits.stimulation;
  if (preferred.has('I')) score += content.traits.emotion;
  if (preferred.has('N')) score += content.traits.imagination;
  if (preferred.has('S')) score += content.traits.realism;
  if (preferred.has('T')) score += content.traits.structure;
  if (preferred.has('F')) score += content.traits.relationship;
  if (preferred.has('J')) score += content.traits.closure;
  if (preferred.has('P')) score += content.traits.novelty;
  return score;
}

function getGenreSimilarity(content: StreamingContent, reference: StreamingContent) {
  const referenceGenres = new Set(reference.genres);
  const sharedCount = content.genres.filter((genre) => referenceGenres.has(genre)).length;
  return sharedCount / Math.max(content.genres.length, reference.genres.length, 1);
}

function getTraitSimilarity(content: StreamingContent, reference: StreamingContent) {
  const distance = TRAIT_KEYS.reduce((sum, key) => sum + Math.abs(content.traits[key] - reference.traits[key]), 0);
  return 1 - distance / (TRAIT_KEYS.length * 100);
}

function getProfileSimilarity(content: StreamingContent, profile: TasteTraits | null) {
  if (!profile) return 0;

  const distance = TRAIT_KEYS.reduce(
    (sum, key) => sum + Math.abs(content.traits[key] - profile[key]),
    0
  );

  return 1 - distance / (TRAIT_KEYS.length * 100);
}

function getPreferenceReferences(ratings: ContentRating[]) {
  const ratedContents = ratings
    .map((rating) => ({
      rating,
      content: STREAMING_CONTENTS.find((item) => item.id === rating.contentId),
    }))
    .filter((item): item is { rating: ContentRating; content: StreamingContent } => Boolean(item.content));

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
        const genreScore = getGenreSimilarity(content, reference.content) * 50;
        const traitScore = getTraitSimilarity(content, reference.content) * 20;
        const ratingWeight = reference.rating.rating / 5;
        return sum + (genreScore + traitScore) * ratingWeight;
      }, 0);
      const averageReferenceScore = preferenceReferences.length > 0 ? referenceScore / preferenceReferences.length : 0;
      const profileScore = getProfileSimilarity(content, tasteProfile) * 30;
      const axisScore = getAxisScore(content, preferred) * 0.03;
      const skippedScore = skippedIds.has(content.id) ? 8 : 0;
      const score = averageReferenceScore + profileScore + axisScore + skippedScore;
      return { id: content.id, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((item) => item.id);
}
