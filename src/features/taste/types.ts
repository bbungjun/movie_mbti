export type ContentType = 'movie' | 'series';

export interface TasteTraits {
  /** 사건 밀도, 긴장감, 액션성 */
  stimulation: number;
  /** 감정선, 여운, 내면 묘사 */
  emotion: number;
  /** 세계관, 설정 신선도, 콘셉트의 강도 */
  imagination: number;
  /** 생활감, 사회성, 현실적 설득력 */
  realism: number;
  /** 이야기 전개 정교함, 복선/회수, 완성도 */
  structure: number;
  /** 캐릭터 관계, 케미, 공감성 */
  relationship: number;
  /** 결말 만족도, 정리감, 완주 보상 */
  closure: number;
  /** 변주, 예측불가, 형식적 새로움 */
  novelty: number;
}

export interface TasteProfileAxes {
  dopamine: number;
  afterglow: number;
  concept: number;
  emotionDriven: number;
  plotDriven: number;
  relationshipDriven: number;
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
  profileAxes: TasteProfileAxes;
}

export interface ContentRating {
  contentId: string;
  rating: number;
}

export interface TasteAxisResult {
  axis: 'pace' | 'drive' | 'focus';
  leftCode: string;
  rightCode: string;
  selectedCode: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
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

export interface TasteProfileResult extends TasteResultCopy {
  id: string;
  sessionId: string;
  axisResults: TasteAxisResult[];
  topTraits: Array<keyof TasteProfileAxes>;
  ratings: ContentRating[];
  skippedContentIds: string[];
  recommendedContentIds: string[];
  createdAt: string;
}

export type TasteMbtiResult = TasteProfileResult;

export interface TasteAnalyticsContent {
  contentId: string;
  averageRating: number;
  votes: number;
}

export interface TasteAnalyticsResult {
  code: string;
  topRatedContents: TasteAnalyticsContent[];
}
