'use client';

import { useSearchParams } from 'next/navigation';
import { TasteResultAnalysisSection } from './result/TasteResultAnalysisSection';
import { TasteResultContentSection } from './result/TasteResultContentSection';
import { TasteResultEmptyState } from './result/TasteResultEmptyState';
import { TasteResultHero } from './result/TasteResultHero';
import { useTasteAnalytics } from '../hooks/useTasteAnalytics';
import { useTasteResult } from '../hooks/useTasteResult';
import { useTasteResultShare } from '../hooks/useTasteResultShare';

interface TasteResultViewProps {
  resultId: string;
}

export function TasteResultView({ resultId }: TasteResultViewProps) {
  const searchParams = useSearchParams();
  const isShareMode = searchParams.get('share') === '1';
  const { isLoading, result, ratedContents, recommendedContents } = useTasteResult(resultId);
  const { isAnalyticsLoading, topRatedContents } = useTasteAnalytics(
    isShareMode ? null : result?.code ?? null
  );
  const {
    copied,
    shareNotice,
    handleInstagramShare,
    handleKakaoShare,
    handleNativeShare,
  } = useTasteResultShare(result);

  if (isLoading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center bg-netflix-black px-6 text-center text-white">
        <p className="text-sm font-semibold text-neutral-400">결과를 불러오는 중입니다...</p>
      </main>
    );
  }

  if (!result) {
    return <TasteResultEmptyState />;
  }

  return (
    <main
      className={
        isShareMode
          ? 'h-[100dvh] overflow-hidden bg-netflix-black text-white'
          : 'min-h-[100dvh] bg-netflix-black text-white'
      }
    >
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/10 via-transparent to-transparent" />
        <div className="absolute -top-20 left-1/2 h-48 w-[500px] -translate-x-1/2 rounded-full bg-netflix-red/10 blur-3xl md:-top-40 md:h-96 md:w-[1000px]" />

        <div
          className={
            isShareMode
              ? 'relative mx-auto max-w-6xl px-3 pb-2 pt-3 md:px-4 md:pb-3 md:pt-4'
              : 'relative mx-auto max-w-6xl px-4 pb-8 pt-6 md:pb-12 md:pt-8'
          }
        >
          <div
            className={
              isShareMode
                ? 'flex flex-col gap-2 md:grid md:grid-cols-[0.9fr_1.1fr] md:gap-3'
                : 'mt-6 flex flex-col gap-6 md:mt-8 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-8'
            }
          >
            <TasteResultHero
              copied={copied}
              compact={isShareMode}
              result={result}
              shareNotice={shareNotice}
              onInstagramShare={handleInstagramShare}
              onKakaoShare={handleKakaoShare}
              onNativeShare={handleNativeShare}
            />
            <TasteResultAnalysisSection compact={isShareMode} result={result} />
          </div>
        </div>
      </section>

      <TasteResultContentSection
        analyticsContents={topRatedContents}
        compact={isShareMode}
        isAnalyticsLoading={isAnalyticsLoading}
        ratedContents={ratedContents}
        recommendedContents={recommendedContents}
        result={result}
      />
    </main>
  );
}
