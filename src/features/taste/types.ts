export type ContentType = 'movie' | 'series';

export interface TasteTraits {
  stimulation: number;
  emotion: number;
  imagination: number;
  realism: number;
  structure: number;
  relationship: number;
  closure: number;
  novelty: number;
}

export interface StreamingContent {
  id: string;
  title: string;
  type: ContentType;
  genres: string[];
  posterPath: string | null;
  year: string;
  summary: string;
  providers: string[];
  traits: TasteTraits;
}

export interface ContentRating {
  contentId: string;
  rating: number;
}

export interface TasteAxisResult {
  axis: 'energy' | 'world' | 'decision' | 'rhythm';
  leftCode: string;
  rightCode: string;
  selectedCode: string;
  label: string;
  confidence: 'high' | 'medium' | 'mixed';
  leftScore: number;
  rightScore: number;
}

export interface TasteResultCopy {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  watchStyle: string;
}

export interface TasteMbtiResult extends TasteResultCopy {
  id: string;
  sessionId: string;
  axisResults: TasteAxisResult[];
  topTraits: string[];
  ratings: ContentRating[];
  skippedContentIds: string[];
  recommendedContentIds: string[];
  createdAt: string;
}
