'use client';

import { useEffect, useState } from 'react';

export interface TasteAnalyzingCard {
  img: string;
  chip: string;
  title: string;
}

interface TasteAnalyzingShuffleProps {
  cards: TasteAnalyzingCard[];
  durationMs?: number;
  poolSize?: number;
  onComplete?: () => void;
}

export function TasteAnalyzingShuffle({
  cards,
  durationMs = 4000,
  poolSize = 12847,
  onComplete,
}: TasteAnalyzingShuffleProps) {
  const [pct, setPct] = useState(0);
  const [matched, setMatched] = useState(0);

  useEffect(() => {
    if (durationMs <= 0) return;

    const startedAt = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const ratio = Math.min(1, elapsed / durationMs);
      const nextPct = Math.round(ratio * 100);

      setPct(nextPct);
      setMatched(Math.round(ratio * poolSize * 0.34));

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
    <div className="mm-screen mm-analyzing-overlay">
      <div className="analyzing">
        <div className="analyzing-eyebrow">MATCHING YOUR TASTE</div>

        <div className="analyzing-deck" aria-hidden>
          {cards.slice(0, 5).map((card) => (
            <div key={`${card.title}-${card.chip}`} className="analyzing-card">
              <div
                className="analyzing-card-img"
                style={{ backgroundImage: `url(${card.img})` }}
              />
              <div className="analyzing-card-overlay">
                <div className="analyzing-card-chip">{card.chip}</div>
                <div className="analyzing-card-title">{card.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="analyzing-info">
          <div className="analyzing-now">SCANNING POOL</div>
          <h2 className="analyzing-title">취향과 맞는 작품 찾는 중</h2>
          <p className="analyzing-meta" aria-live="polite">
            <b>{matched.toLocaleString()}</b>편 검토 완료 · 약{' '}
            {poolSize.toLocaleString()}편 중
          </p>
        </div>

        <div
          className="analyzing-bar"
          role="progressbar"
          aria-label="분석 진행률"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
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
