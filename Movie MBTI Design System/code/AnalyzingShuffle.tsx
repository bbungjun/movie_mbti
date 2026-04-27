import React, { useEffect, useState } from 'react';

/**
 * AnalyzingShuffle — 분석 중 화면 (포스터 셔플)
 *
 * 5장의 포스터 카드가 3D로 셔플되며 진행률이 차오릅니다.
 *
 * 사용 예:
 *   <AnalyzingShuffle
 *     onComplete={() => navigate('/result')}
 *     durationMs={4000}
 *   />
 */

export interface PosterCard {
  /** 포스터 이미지 URL */
  img: string;
  /** 좌상단 칩 (장르 라벨) */
  chip: string;
  /** 영화/콘텐츠 제목 */
  title: string;
}

export interface AnalyzingShuffleProps {
  /** 보여줄 포스터 카드들. 미지정 시 기본 5종 사용 */
  cards?: PosterCard[];
  /**
   * 분석 완료까지 걸리는 시간(ms). 0 또는 음수면 자동완료 안 함
   * (데모 또는 백엔드가 끝났음을 알릴 때까지 기다리는 모드).
   * 기본값: 4000ms.
   */
  durationMs?: number;
  /** 분석 완료 시 호출 — 보통 결과 화면으로 라우팅 */
  onComplete?: () => void;
  /** 전체 검토 대상 풀 크기 (기본 12,847편) */
  poolSize?: number;
}

const DEFAULT_CARDS: PosterCard[] = [
  {
    img: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    chip: 'SF',
    title: '듄: 파트 2',
  },
  {
    img: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80',
    chip: '스릴러',
    title: '세븐',
  },
  {
    img: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?w=800&q=80',
    chip: '드라마',
    title: '라라랜드',
  },
  {
    img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
    chip: '느와르',
    title: '대부',
  },
  {
    img: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80',
    chip: '로맨스',
    title: '비포 선라이즈',
  },
];

export function AnalyzingShuffle({
  cards = DEFAULT_CARDS,
  durationMs = 4000,
  onComplete,
  poolSize = 12847,
}: AnalyzingShuffleProps) {
  const [pct, setPct] = useState(0);
  const [matched, setMatched] = useState(0);

  // 진행률 + 매칭 카운터 — durationMs 동안 0 → 100 으로 증가
  useEffect(() => {
    if (durationMs <= 0) return;

    const startedAt = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const ratio = Math.min(1, elapsed / durationMs);
      const nextPct = Math.round(ratio * 100);
      setPct(nextPct);
      setMatched(Math.round(ratio * poolSize * 0.34)); // 풀의 약 34% 검토

      if (ratio >= 1) {
        onComplete?.();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, onComplete, poolSize]);

  return (
    <div className="mm-screen">
      <div className="analyzing">
        <div className="analyzing-eyebrow">— MATCHING YOUR TASTE</div>

        {/* 5장의 카드가 차례로 회전·이동·페이드 — CSS 애니메이션이 처리 */}
        <div className="analyzing-deck" aria-hidden>
          {cards.slice(0, 5).map((c, i) => (
            <div key={i} className="analyzing-card">
              <div
                className="analyzing-card-img"
                style={{ backgroundImage: `url(${c.img})` }}
              />
              <div className="analyzing-card-overlay">
                <div className="analyzing-card-chip">{c.chip}</div>
                <div className="analyzing-card-title">{c.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="analyzing-info">
          <div className="analyzing-now">SCANNING POOL</div>
          <h2 className="analyzing-title">취향과 맞는 작품 찾는 중</h2>
          <p
            className="analyzing-meta"
            aria-live="polite"
          >
            <b>{matched.toLocaleString()}</b>편 검토 완료 · 약{' '}
            {poolSize.toLocaleString()}편 중
          </p>
        </div>

        <div
          className="analyzing-bar"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="분석 진행률"
        >
          <div
            className="analyzing-bar-fill"
            style={{ width: `${pct}%` }}
          />
          <div className="analyzing-bar-text">
            <span>분석 진행률</span>
            <b>{pct}%</b>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyzingShuffle;
