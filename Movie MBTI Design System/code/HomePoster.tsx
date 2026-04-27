import React from 'react';

/**
 * HomePoster — 첫 진입 화면 (Netflix 클래식 톤)
 *
 * 사용 예:
 *   <HomePoster
 *     posterUrl="https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80"
 *     onStart={() => navigate('/analyzing')}
 *   />
 *
 * Tailwind를 쓰지 않아도 동작합니다 — 모든 스타일은 ./screens.css 의
 * .mm-* / .home-* 클래스에 들어있어요. 페이지 진입 시 한 번만 import 하세요.
 */
export interface HomePosterProps {
  /** 히어로 배경에 깔리는 포스터 이미지 URL */
  posterUrl?: string;
  /** "테스트 시작하기" 버튼 클릭 시 호출 — 보통 라우터 이동 */
  onStart?: () => void;
  /** 우상단 메뉴(⋮) 버튼 클릭 — 미구현이면 생략 */
  onMenu?: () => void;
}

const DEFAULT_POSTER =
  'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80';

export function HomePoster({
  posterUrl = DEFAULT_POSTER,
  onStart,
  onMenu,
}: HomePosterProps) {
  return (
    <div className="mm-screen">
      {/* 배경 레이어 — 포스터 → 사이드 페이드 → 하단 페이드 순으로 위에 쌓임 */}
      <div
        className="home-poster"
        style={{ backgroundImage: `url(${posterUrl})` }}
        aria-hidden
      />
      <div className="home-side" aria-hidden />
      <div className="home-fade" aria-hidden />

      {/* 상단 — 로고 + 메뉴 */}
      <header className="home-top">
        <div className="home-logo">
          M<i>MBTI</i>
        </div>
        <button
          type="button"
          className="home-menu"
          onClick={onMenu}
          aria-label="메뉴 열기"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="#fff" strokeWidth={2}>
            <circle cx="12" cy="6" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="18" r="1.5" />
          </svg>
        </button>
      </header>

      {/* 하단 콘텐츠 블록 — 칩 → 타이틀 → 리드 → 통계 → CTA */}
      <main className="home-content">
        <Eyebrow>OTT 취향 분석</Eyebrow>

        <div style={{ height: 14 }} />

        <div className="home-tags">
          <span className="home-tag home-tag--red">N 시리즈</span>
          <span className="home-tag">12개 질문</span>
          <span className="home-tag">3분</span>
        </div>

        <h1 className="home-title">
          당신의<br />
          <em>콘텐츠 DNA</em>
        </h1>

        <p className="home-lede">
          12가지 질문으로 찾아내는 나만의 OTT 성향. 64,000명이 이미 발견했어요.
        </p>

        <div className="home-stats">
          <span><b>★ 4.9</b></span>
          <span className="home-stats-dot" />
          <span><b>64K</b> 참여</span>
          <span className="home-stats-dot" />
          <span>2025</span>
        </div>

        <button
          type="button"
          className="mm-cta mm-cta--glow"
          onClick={onStart}
        >
          테스트 시작하기 <span className="mm-cta-arrow">›</span>
        </button>
        <div className="mm-note">무료 · 로그인 없이 바로 시작</div>
      </main>
    </div>
  );
}

/* 작은 빨간 점 + 라벨 — 상단 인디케이터 */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mm-eyebrow">
      <span className="mm-eyebrow-dot">
        <span />
        <span />
      </span>
      {children}
    </div>
  );
}

export default HomePoster;
