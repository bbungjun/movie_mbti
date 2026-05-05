'use client';

import { TasteMbtiResult } from '../../types';
import { getSelectedAxisLabel } from './tasteResultLabels';

interface AxisInterpretation {
  title: string;
  body: string;
  cue: string;
}

const AXIS_INTERPRETATIONS: Record<string, Record<string, AxisInterpretation>> = {
  pace: {
    D: {
      title: '즉각적인 몰입 반응',
      body: '초반의 사건 밀도, 위기감, 다음 화를 누르게 만드는 추진력에 빠르게 반응합니다.',
      cue: '추천은 초반 1~2화 안에 판이 크게 움직이는 작품이 잘 맞습니다.',
    },
    A: {
      title: '오래 남는 여운 반응',
      body: '큰 사건보다 분위기, 정서의 잔상, 보고 난 뒤 곱씹게 되는 감각에 더 오래 반응합니다.',
      cue: '추천은 완급이 있고 장면의 공기가 오래 남는 작품이 잘 맞습니다.',
    },
  },
  drive: {
    C: {
      title: '설정이 이야기를 끄는 편',
      body: '세계관, 규칙, 장르적 콘셉트가 선명할수록 작품을 이해하고 따라가는 속도가 빨라집니다.',
      cue: '룰이 분명한 서바이벌, SF, 미스터리, 장르물이 만족도를 올립니다.',
    },
    E: {
      title: '정서가 이야기를 끄는 편',
      body: '인물의 마음이 설득되면 장르나 전개의 속도와 상관없이 끝까지 따라가는 힘이 생깁니다.',
      cue: '관계 변화와 감정선이 촘촘한 휴먼, 로맨스, 드라마가 잘 맞습니다.',
    },
  },
  focus: {
    P: {
      title: '이야기 전개를 따라 몰입',
      body: '복선, 반전, 사건의 인과처럼 이야기가 정교하게 맞물릴 때 만족도가 크게 올라갑니다.',
      cue: '구조가 탄탄하고 회수감이 있는 수사극, 복수극, 스릴러가 잘 맞습니다.',
    },
    R: {
      title: '관계를 따라 몰입',
      body: '누가 누구에게 어떤 마음을 갖고 있는지, 관계의 온도가 어떻게 달라지는지에 민감합니다.',
      cue: '케미, 갈등, 화해, 성장의 결이 살아 있는 작품이 잘 맞습니다.',
    },
  },
} as const;

function getAxisInterpretation(axis: TasteMbtiResult['axisResults'][number]) {
  const axisMap = AXIS_INTERPRETATIONS[axis.axis];
  return axisMap[axis.selectedCode];
}

function getSelectedScore(axis: TasteMbtiResult['axisResults'][number]) {
  return axis.selectedCode === axis.leftCode ? axis.leftScore : axis.rightScore;
}

function getCounterScore(axis: TasteMbtiResult['axisResults'][number]) {
  return axis.selectedCode === axis.leftCode ? axis.rightScore : axis.leftScore;
}

function getPercent(score: number) {
  return Math.round(score * 100);
}

function getConfidenceText(confidence: TasteMbtiResult['axisResults'][number]['confidence']) {
  if (confidence === 'high') {
    return '선호가 뚜렷하게 기울어져 있어요.';
  }

  if (confidence === 'medium') {
    return '한쪽이 조금 더 앞서지만 반대 취향도 함께 갖고 있어요.';
  }

  return '두 취향이 균형에 가까워 상황에 따라 반응이 달라질 수 있어요.';
}

interface TasteResultAnalysisSectionProps {
  compact?: boolean;
  result: TasteMbtiResult;
}

export function TasteResultAnalysisSection({
  compact = false,
  result,
}: TasteResultAnalysisSectionProps) {
  return (
    <div className={`animate-slide-up ${compact ? 'space-y-2' : 'space-y-4 md:space-y-6'}`}>
      <section
        className={`rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm ${
          compact ? 'p-3' : 'p-4 md:rounded-2xl md:p-6'
        }`}
      >
        <h3 className={`flex items-center gap-2 font-bold md:gap-3 ${compact ? 'text-sm' : 'text-base md:text-xl'}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-netflix-red md:h-8 md:w-8">
            <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          취향 해석
        </h3>
        <div
          className={
            compact
              ? 'mt-2 grid grid-cols-3 gap-1.5'
              : '-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-4 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0'
          }
        >
          {result.strengths.map((strength) => (
            <div
              key={strength}
              className={`shrink-0 rounded-lg bg-white/5 text-center transition-colors active:bg-white/10 md:hover:bg-white/10 ${
                compact ? 'px-2 py-2' : 'px-4 py-3 md:rounded-xl md:p-4'
              }`}
            >
              <p
                className={`font-semibold text-white ${
                  compact
                    ? 'truncate text-[11px]'
                    : 'whitespace-nowrap text-sm md:whitespace-normal'
                }`}
              >
                {strength}
              </p>
            </div>
          ))}
        </div>
        <div
          className={`mt-2 rounded-lg border border-netflix-red/20 bg-netflix-red/5 ${
            compact ? 'p-2' : 'p-3 md:mt-4 md:rounded-xl md:p-4'
          }`}
        >
          <p className={`text-neutral-300 ${compact ? 'line-clamp-2 text-xs' : 'text-sm'}`}>
            {result.watchStyle}
          </p>
        </div>
        {!compact ? (
          <div className="mt-4 rounded-xl bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              읽는 법
            </p>
            <p className="mt-2 text-sm leading-relaxed text-neutral-300">
              이 코드는 작품을 좋아하는 이유를 세 갈래로 나눠 본 결과예요.
              먼저 어떤 속도로 몰입하는지, 그다음 무엇이 이야기를 움직인다고
              느끼는지, 마지막으로 이야기 전개와 관계 중 어디에 시선이 더 오래 머무는지
              를 합쳐 해석합니다.
            </p>
          </div>
        ) : null}
      </section>

      <section
        className={`rounded-xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm ${
          compact ? 'p-3' : 'p-4 md:rounded-2xl md:p-6'
        }`}
      >
        <h3 className={`flex items-center gap-2 font-bold md:gap-3 ${compact ? 'text-sm' : 'text-base md:text-xl'}`}>
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 md:h-8 md:w-8">
            <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </span>
          분석 축
        </h3>
        <div className={`mt-2 grid gap-2 ${compact ? 'grid-cols-3' : 'grid-cols-1 md:mt-4 md:gap-4'}`}>
          {result.axisResults.map((axis) => (
            <div
              key={axis.axis}
              className={`rounded-lg bg-white/5 ${compact ? 'p-2' : 'p-3 md:rounded-xl md:p-4'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-neutral-400 ${compact ? 'text-[9px]' : 'text-[10px] md:text-sm'}`}>
                  {axis.label}
                </span>
                <span className={`font-black text-netflix-red ${compact ? 'text-base' : 'text-lg md:text-2xl'}`}>
                  {axis.selectedCode}
                </span>
              </div>
              <p className={`mt-1 font-semibold text-white ${compact ? 'truncate text-[11px]' : 'text-sm md:text-base'}`}>
                {getSelectedAxisLabel(axis)}
              </p>
              <p className={`mt-1 text-neutral-500 ${compact ? 'hidden' : 'text-[10px] md:text-xs'}`}>
                {axis.leftLabel} ↔ {axis.rightLabel}
              </p>
              <div className={`overflow-hidden rounded-full bg-neutral-800 ${compact ? 'mt-1.5 h-1' : 'mt-3 h-2'}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-netflix-red to-netflix-red-hover transition-all duration-500"
                  style={{
                    width: `${Math.max(12, getPercent(getSelectedScore(axis)))}%`,
                  }}
                />
              </div>
              {!compact ? (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <span>
                      {getSelectedAxisLabel(axis)} {getPercent(getSelectedScore(axis))}%
                    </span>
                    <span>
                      반대 성향 {getPercent(getCounterScore(axis))}%
                    </span>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <p className="text-sm font-semibold text-white">
                      {getAxisInterpretation(axis).title}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-neutral-400">
                      {getAxisInterpretation(axis).body}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-netflix-red">
                      {getAxisInterpretation(axis).cue}
                    </p>
                  </div>
                  <p className="text-[11px] text-neutral-500">
                    {getConfidenceText(axis.confidence)}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
