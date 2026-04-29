interface TasteHomePosterProps {
  posterUrl: string;
  onStart: () => void;
}

export function TasteHomePoster({
  posterUrl,
  onStart,
}: TasteHomePosterProps) {
  return (
    <section className="mm-screen mm-home-screen">
      <div
        className="home-poster"
        style={{ backgroundImage: `url(${posterUrl})` }}
        aria-hidden
      />
      <div className="home-side" aria-hidden />
      <div className="home-fade" aria-hidden />

      <header className="home-top">
        <div className="home-logo">
          Movie<i>MBTI</i>
        </div>
        <div className="home-menu" aria-hidden>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth={2}
          >
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </div>
      </header>

      <main className="home-content">
        <div className="mm-eyebrow">
          <span className="mm-eyebrow-dot">
            <span />
            <span />
          </span>
          OTT 취향 분석
        </div>

        <div className="home-tags">
          <span className="home-tag home-tag--red">Netflix 시리즈</span>
          <span className="home-tag">20개 작품</span>
          <span className="home-tag">약 3분</span>
        </div>

        <h1 className="home-title">
          당신의
          <em>콘텐츠 DNA</em>
        </h1>

        <p className="home-lede">
          좋아하는 작품에 별점을 남기면 나만의 OTT 성향과 추천 콘텐츠를
          바로 확인할 수 있어요.
        </p>

        <div className="home-stats" aria-label="테스트 요약">
          <span>
            <b>20</b> 작품
          </span>
          <span className="home-stats-dot" />
          <span>
            <b>12+</b> 평가
          </span>
          <span className="home-stats-dot" />
          <span>즉시 결과</span>
        </div>

        <button 
          onClick={onStart}
          className="mm-cta mm-cta--glow w-full sm:w-auto"
        >
          테스트 시작하기 <span className="mm-cta-arrow">›</span>
        </button>
        <div className="mm-note">무료 · 로그인 없이 바로 시작</div>
      </main>
    </section>
  );
}
