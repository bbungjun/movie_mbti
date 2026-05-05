import { TasteAxisResult } from '../../types';

const TRAIT_LABELS: Record<string, string> = {
  dopamine: '도파민',
  afterglow: '여운',
  concept: '설정 주도',
  emotionDriven: '정서 주도',
  plotDriven: '이야기 전개',
  relationshipDriven: '관계 주도',
  stimulation: '자극과 속도감',
  emotion: '감정선',
  imagination: '세계관',
  realism: '현실감',
  structure: '구조와 완성도',
  relationship: '관계와 캐릭터',
  closure: '종결감',
  novelty: '새로움',
};

export function getTopTraitLabel(trait: string) {
  return TRAIT_LABELS[trait] ?? trait;
}

export function getSelectedAxisLabel(axis: TasteAxisResult) {
  return axis.selectedCode === axis.leftCode ? axis.leftLabel : axis.rightLabel;
}
