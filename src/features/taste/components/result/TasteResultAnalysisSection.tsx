'use client';

import { TasteMbtiResult } from '../../types';
import { getSelectedAxisLabel } from './tasteResultLabels';

interface TasteResultAnalysisSectionProps {
  result: TasteMbtiResult;
}

export function TasteResultAnalysisSection({
  result,
}: TasteResultAnalysisSectionProps) {
  return (
    <div className="animate-slide-up space-y-4 md:space-y-6">
      <section className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
        <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
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
        <div className="-mx-4 mt-3 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:mt-4 md:grid md:grid-cols-3 md:gap-3 md:overflow-visible md:px-0 md:pb-0">
          {result.strengths.map((strength) => (
            <div
              key={strength}
              className="shrink-0 rounded-lg bg-white/5 px-4 py-3 text-center transition-colors active:bg-white/10 md:rounded-xl md:p-4 md:hover:bg-white/10"
            >
              <p className="whitespace-nowrap text-sm font-semibold text-white md:whitespace-normal">
                {strength}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-netflix-red/20 bg-netflix-red/5 p-3 md:mt-4 md:rounded-xl md:p-4">
          <p className="text-sm text-neutral-300">{result.watchStyle}</p>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-neutral-900/50 p-4 backdrop-blur-sm md:rounded-2xl md:p-6">
        <h3 className="flex items-center gap-2 text-base font-bold md:gap-3 md:text-xl">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-800 md:h-8 md:w-8">
            <svg className="h-3.5 w-3.5 text-white md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
          </span>
          분석 축
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2 md:mt-4 md:gap-4">
          {result.axisResults.map((axis) => (
            <div key={axis.axis} className="rounded-lg bg-white/5 p-3 md:rounded-xl md:p-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 md:text-sm">
                  {axis.label}
                </span>
                <span className="text-lg font-black text-netflix-red md:text-2xl">
                  {axis.selectedCode}
                </span>
              </div>
              <p className="mt-1 text-sm font-semibold text-white md:text-base">
                {getSelectedAxisLabel(axis)}
              </p>
              <p className="mt-1 text-[10px] text-neutral-500 md:text-xs">
                {axis.leftLabel} ↔ {axis.rightLabel}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-800 md:mt-3 md:h-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-netflix-red to-netflix-red-hover transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      12,
                      (Math.max(axis.leftScore, axis.rightScore) /
                        (axis.leftScore + axis.rightScore || 1)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <p className="mt-1.5 text-[10px] text-neutral-500 md:mt-2 md:text-xs">
                {axis.confidence === 'mixed'
                  ? '균형형'
                  : axis.confidence === 'medium'
                    ? '조금 더 뚜렷'
                    : '뚜렷함'}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
