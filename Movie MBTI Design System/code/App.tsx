import React, { useState } from 'react';
import { HomePoster } from './HomePoster';
import { AnalyzingShuffle } from './AnalyzingShuffle';
import './screens.css';

/**
 * App — 두 화면을 잇는 가장 단순한 예시.
 *
 * 실제 프로젝트에선 React Router / Next.js 라우팅으로 대체하세요.
 * 여기선 useState 한 줄로 화면 전환을 보여줍니다.
 *
 * 화면 사이즈는 390 × 844 (iPhone 14 사이즈). 데스크톱에서 확인할 땐
 * 부모 div를 그대로 쓰고, 실제 모바일에선 100vw / 100vh 로 두면 됩니다.
 */
type Screen = 'home' | 'analyzing';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <div
      style={{
        width: 390,
        height: 844,
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,.4)',
        borderRadius: 32,
        overflow: 'hidden',
      }}
    >
      {screen === 'home' && (
        <HomePoster onStart={() => setScreen('analyzing')} />
      )}

      {screen === 'analyzing' && (
        <AnalyzingShuffle
          durationMs={4000}
          onComplete={() => {
            // 다음 화면(결과)이 준비되면 여기로 이동
            console.log('분석 완료 — 결과 화면으로 이동');
            // 데모용: 다시 홈으로
            setScreen('home');
          }}
        />
      )}
    </div>
  );
}
