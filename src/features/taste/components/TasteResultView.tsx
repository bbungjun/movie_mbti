'use client';

import { TasteResultAnalysisSection } from './result/TasteResultAnalysisSection';
import { TasteResultContentSection } from './result/TasteResultContentSection';
import { TasteResultEmptyState } from './result/TasteResultEmptyState';
import { TasteResultHero } from './result/TasteResultHero';
import { useTasteResult } from '../hooks/useTasteResult';
import { useTasteResultShare } from '../hooks/useTasteResultShare';

interface TasteResultViewProps {
  resultId: string;
}

export function TasteResultView({ resultId }: TasteResultViewProps) {
  const { result, ratedContents, recommendedContents } = useTasteResult(resultId);
  const {
    copied,
    shareNotice,
    handleInstagramShare,
    handleKakaoShare,
    handleNativeShare,
  } = useTasteResultShare(result);

  if (!result) {
    return <TasteResultEmptyState />;
  }

  return (
    <main className="min-h-[100dvh] bg-netflix-black text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/10 via-transparent to-transparent" />
        <div className="absolute -top-20 left-1/2 h-48 w-[500px] -translate-x-1/2 rounded-full bg-netflix-red/10 blur-3xl md:-top-40 md:h-96 md:w-[1000px]" />

        <div className="relative mx-auto max-w-6xl px-4 pb-8 pt-6 md:pb-12 md:pt-8">
          <div className="mt-6 flex flex-col gap-6 md:mt-8 lg:grid lg:grid-cols-[1fr_1.2fr] lg:gap-8">
            <TasteResultHero
              copied={copied}
              result={result}
              shareNotice={shareNotice}
              onInstagramShare={handleInstagramShare}
              onKakaoShare={handleKakaoShare}
              onNativeShare={handleNativeShare}
            />
            <TasteResultAnalysisSection result={result} />
          </div>
        </div>
      </section>

      <TasteResultContentSection
        ratedContents={ratedContents}
        recommendedContents={recommendedContents}
        result={result}
      />
    </main>
  );
}
