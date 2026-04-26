// Movie types
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  tagline: string;
}

// Genre types
export interface Genre {
  id: string;
  name: string;
  tmdbId: number;
  icon: string;
  color: string;
}

// World Cup types
export interface Match {
  id: string;
  round: number;
  matchNumber: number;
  movieA: Movie;
  movieB: Movie;
  winner?: Movie;
  timeSpentMs?: number;
}

export interface GameState {
  sessionId: string;
  genre: string;
  currentRound: number;
  currentMatch: number;
  matches: Match[];
  winners: Movie[];
  isComplete: boolean;
}

// Result types
export interface GameResult {
  id: string;
  sessionId: string;
  genre: string;
  winner: Movie;
  runnerUp: Movie;
  recommendations: Movie[];
  createdAt: string;
}

// Log types
export interface GameLog {
  sessionId: string;
  genre: string;
  round: number;
  movieAId: number;
  movieBId: number;
  winnerId: number;
  timeSpentMs: number;
}

// OTT types
export interface OTTProvider {
  id: number;
  name: string;
  logo_path: string;
}

export interface WatchProviders {
  flatrate?: OTTProvider[];
  rent?: OTTProvider[];
  buy?: OTTProvider[];
}

// API Response types
export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

// OTT FOR MBTI MVP types
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

export interface NetflixContent {
  id: string;
  title: string;
  type: ContentType;
  genres: string[];
  posterPath: string | null;
  year: string;
  summary: string;
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

export interface TasteMbtiResult {
  id: string;
  sessionId: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  strengths: string[];
  watchStyle: string;
  axisResults: TasteAxisResult[];
  topTraits: string[];
  ratings: ContentRating[];
  recommendedContentIds: string[];
  createdAt: string;
}
