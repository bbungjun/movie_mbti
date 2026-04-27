# MMBTI — 모바일 UX 구현 코드

선택하신 두 화면을 React 컴포넌트로 정리한 패키지입니다.

- **`HomePoster`** — 홈 화면 #1 (정적 포스터, Netflix 클래식 톤)
- **`AnalyzingShuffle`** — 분석 중 화면 #2 (포스터 셔플 카드 더미)

## 파일 구성

```
code/
├── screens.css          # 두 화면이 공유하는 스타일 (필수 import)
├── HomePoster.tsx       # 홈 화면 컴포넌트
├── AnalyzingShuffle.tsx # 분석 중 화면 컴포넌트
└── App.tsx              # 두 화면을 잇는 최소 예시
```

## 빠른 시작

```tsx
import { HomePoster } from './HomePoster';
import { AnalyzingShuffle } from './AnalyzingShuffle';
import './screens.css'; // 진입 지점에 한 번만

function MyApp() {
  const [step, setStep] = useState<'home' | 'analyzing'>('home');

  if (step === 'home')
    return <HomePoster onStart={() => setStep('analyzing')} />;

  return (
    <AnalyzingShuffle
      durationMs={4000}
      onComplete={() => navigate('/result')}
    />
  );
}
```

## 의존성

- **React 18+** (TypeScript)
- 외부 라이브러리 **없음** — Tailwind, framer-motion 등 불필요
- 모든 애니메이션은 순수 CSS keyframes로 구동

> 자바스크립트로 쓰실 거면 `.tsx` → `.jsx`로 바꾸고 `interface` 블록만 지우면
> 그대로 동작합니다.

## 폰트

`Inter` 와 `Noto Sans KR`을 사용합니다. 진입 지점 HTML 또는 `_document.tsx`에
다음을 추가하세요:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;700;900&display=swap"
  rel="stylesheet"
/>
```

## Props 레퍼런스

### `HomePoster`

| prop        | 타입         | 기본값                                  | 설명                              |
| ----------- | ------------ | --------------------------------------- | --------------------------------- |
| `posterUrl` | `string`     | Unsplash 듄 이미지                      | 히어로 배경 포스터 URL            |
| `onStart`   | `() => void` | —                                       | "테스트 시작하기" 클릭 시 호출    |
| `onMenu`    | `() => void` | —                                       | 우상단 ⋮ 메뉴 클릭 시 호출 (선택) |

### `AnalyzingShuffle`

| prop          | 타입            | 기본값          | 설명                                                     |
| ------------- | --------------- | --------------- | -------------------------------------------------------- |
| `cards`       | `PosterCard[]`  | 5종 기본 카드   | 셔플될 포스터들 (최대 5장 사용)                          |
| `durationMs`  | `number`        | `4000`          | 0 → 100% 까지 걸리는 시간. `0` 이하면 자동완료 비활성    |
| `onComplete`  | `() => void`    | —               | 진행률이 100%가 되었을 때 호출                           |
| `poolSize`    | `number`        | `12847`         | "약 N편 중" 에 표시되는 전체 검토 풀 크기                |

```ts
interface PosterCard {
  img: string;   // 포스터 이미지 URL
  chip: string;  // 장르 라벨 (예: 'SF')
  title: string; // 콘텐츠 제목
}
```

## 사이즈 / 레이아웃

두 화면 모두 **부모의 `width` × `height`를 100% 채우는** 형태입니다.
모바일에선 부모를 `100vw × 100vh` 로 두면 됩니다. 데스크톱 미리보기에선
`App.tsx` 처럼 `390 × 844` 컨테이너에 넣으세요.

## 이미지

기본 포스터는 Unsplash CDN URL입니다. 프로덕션에선:

1. 라이선스 검토 후 자체 CDN으로 호스팅하거나
2. 실제 콘텐츠 포스터 (TMDB / 자사 카탈로그) 로 교체

## 커스터마이징

- **색상** — `screens.css` 상단 `:root` 의 `--mm-*` 변수 수정
- **CTA 톤** — `.mm-cta--glow` 만 쓰고 있어요. `glass`/`invert` 변형이 필요하면
  v2 탐색본 (`explorations/v2-screens.css`) 의 `.v2-cta.glass` / `.v2-cta.invert`
  스타일을 가져다 쓰시면 됩니다.
- **카드 셔플 속도** — `.analyzing-card` 의 `animation: ... 4s` 값을 조절
- **카드 개수** — 현재 5장 고정. 더 늘리려면 `screens.css` 의
  `.analyzing-card:nth-child(N)` 딜레이 규칙도 추가해주세요.

## 다음 단계

- 분석 완료 후 결과 화면 (콘텐츠 DNA 타입 / 추천작) — 디자인 추가 필요
- 12개 질문 화면 (홈 → 분석 사이) — 디자인 추가 필요
- 화면 전환 트랜지션 — 현재 즉시 교체. 페이드/슬라이드가 필요하면
  `framer-motion` 의 `<AnimatePresence>` 로 감싸는 게 가장 깔끔합니다.
