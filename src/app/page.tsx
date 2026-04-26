import { TasteTestFlow } from '@/features/taste/components/TasteTestFlow';

export default function Home() {
  return (
    <main className="min-h-[100dvh] bg-netflix-black">
      {/* Hero Section - Mobile First */}
      <section className="relative overflow-hidden">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-netflix-red/5 via-transparent to-transparent" />
        <div className="absolute -top-20 left-1/2 h-40 w-[400px] -translate-x-1/2 rounded-full bg-netflix-red/10 blur-3xl md:-top-40 md:h-80 md:w-[800px]" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-8 md:gap-8 md:pb-12 md:pt-20">
          {/* Mobile: Stacked layout, Desktop: Grid */}
          <div className="flex flex-col gap-6 md:grid md:grid-cols-[1.2fr_0.8fr] md:items-center md:gap-10">
            {/* Hero Content */}
            <div className="animate-fade-in text-center md:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-netflix-red/30 bg-netflix-red/10 px-3 py-1.5 md:px-4 md:py-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-netflix-red opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-netflix-red" />
                </span>
                <span className="text-xs font-semibold tracking-wide text-netflix-red md:text-sm">
                  OTT FOR MBTI
                </span>
              </div>

              {/* Title - Larger on mobile for impact */}
              <h1 className="mt-4 text-3xl font-black leading-[1.15] tracking-tight text-white md:mt-6 md:text-5xl lg:text-6xl">
                당신의{' '}
                <span className="text-gradient">콘텐츠 DNA</span>
                <br className="md:hidden" />를 찾아드릴게요
              </h1>

              {/* Description - Shorter on mobile */}
              <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-neutral-400 md:mx-0 md:mt-6 md:max-w-xl md:text-lg">
                Netflix 인기작 20개에 별점을 매기면
                <span className="text-white"> 취향 MBTI</span>와
                <span className="text-white"> 맞춤 추천</span>을 받아요
              </p>

              {/* CTA - Full width on mobile */}
              <div className="mt-6 flex flex-col items-center gap-3 md:mt-8 md:flex-row md:gap-4">
                <a
                  href="#test"
                  className="btn-netflix flex w-full items-center justify-center gap-2 text-base md:w-auto md:text-lg"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  테스트 시작하기
                </a>
                <span className="text-sm text-neutral-500">약 3분 소요</span>
              </div>
            </div>

            {/* How-to Card - Simplified on mobile */}
            <div className="animate-slide-up rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/90 to-neutral-950/90 p-5 shadow-xl backdrop-blur-sm md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-netflix-red md:h-10 md:w-10">
                  <svg className="h-4 w-4 text-white md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-base font-bold text-white md:text-lg">이렇게 진행돼요</h2>
              </div>

              {/* Steps - Horizontal scroll hint on mobile */}
              <ol className="mt-5 space-y-3 md:mt-6 md:space-y-4">
                <li className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors active:bg-white/10 md:items-start md:gap-4 md:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-netflix-red text-xs font-black text-white md:h-8 md:w-8 md:text-sm">
                    1
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white md:text-base">본 작품에 별점 남기기</p>
                    <p className="hidden text-sm text-neutral-400 md:mt-1 md:block">1~5점으로 평가해주세요</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors active:bg-white/10 md:items-start md:gap-4 md:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-netflix-red text-xs font-black text-white md:h-8 md:w-8 md:text-sm">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white md:text-base">안 본 작품은 Skip</p>
                    <p className="hidden text-sm text-neutral-400 md:mt-1 md:block">최소 12개 이상 평가가 필요해요</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors active:bg-white/10 md:items-start md:gap-4 md:p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-netflix-red text-xs font-black text-white md:h-8 md:w-8 md:text-sm">
                    3
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white md:text-base">취향 MBTI 결과 확인</p>
                    <p className="hidden text-sm text-neutral-400 md:mt-1 md:block">맞춤 추천도 함께 받아보세요</p>
                  </div>
                </li>
              </ol>

              <p className="mt-4 text-center text-xs text-neutral-500 md:mt-6">
                비공식 엔터테인먼트용 테스트입니다
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Test Section */}
      <div id="test">
        <TasteTestFlow />
      </div>

      {/* Footer - Minimal on mobile */}
      <footer className="border-t border-white/5 bg-neutral-950 px-4 py-6 md:py-8">
        <div className="mx-auto max-w-6xl text-center text-xs text-neutral-600 md:text-sm">
          <p>본 서비스는 Netflix 공식 서비스가 아닙니다.</p>
          <p className="mt-1 hidden md:block">포스터 이미지는 TMDB에서 제공됩니다.</p>
        </div>
      </footer>
    </main>
  );
}
