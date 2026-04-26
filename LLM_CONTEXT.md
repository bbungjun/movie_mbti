# LLM Context: OTT FOR MBTI

이 문서는 CLI 환경에서 LLM이 이 프로젝트의 목적과 코드베이스 구조를 빠르게 이해하도록 만든 요약 문서입니다.

## 프로젝트 목적

이 프로젝트는 기존 `MovieCup` 영화 월드컵 아이디어에서 출발했지만, 현재 MVP의 핵심은 **한국 Netflix 오리지널/독점 공개 인기작 20개를 평가하고, 사용자의 콘텐츠 취향을 MBTI풍 결과로 보여주는 서비스**입니다.

사용자 플로우:

```txt
홈 진입
→ 한국 Netflix 오리지널 20개를 한 작품씩 평가
→ 본 작품은 1~5점 별점 입력
→ 안 본 작품은 Skip
→ 최소 12개 이상 평가
→ MBTI풍 취향 결과 생성
→ 추천 콘텐츠 표시
```

주의: 실제 MBTI 심리검사가 아니라, 콘텐츠 별점과 작품별 취향 태그를 기반으로 한 엔터테인먼트용 취향 분석입니다.

## 실행 방법

```bash
npm install
npm run dev
```

현재 `dev` 스크립트는 포트 충돌을 피하기 위해 `127.0.0.1:3001`에서 실행되도록 설정되어 있습니다.

```txt
http://127.0.0.1:3001
```

검증 명령:

```bash
npm run lint
npm run build
```

## 기술 스택

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- 결과 저장: 현재는 브라우저 `localStorage`
- 포스터 이미지: TMDB 이미지 CDN path 사용

## 핵심 디렉터리 구조

현재 메인 기능은 `src/features/taste` 아래에 모듈화되어 있습니다.

```txt
src/
  app/
    page.tsx
    result/[id]/page.tsx
  features/
    taste/
      components/
        RatingControls.tsx
        TasteContentCard.tsx
        TasteProgress.tsx
        TasteResultView.tsx
        TasteTestFlow.tsx
        TasteTestFooter.tsx
      data/
        resultCopy.ts
        streamingContents.ts
      hooks/
        useTasteTest.ts
      lib/
        analyzeTasteMbti.ts
        recommendContents.ts
        validateContents.ts
      storage/
        localTasteResultStorage.ts
      types.ts
```

## 주요 파일 설명

### `src/app/page.tsx`

홈 화면입니다. 서비스 소개와 평가 방법을 보여주고, `TasteTestFlow`를 렌더링합니다.

현재 사용자 안내:

- 본 작품에 1~5점 별점을 남김
- 5점에 가까울수록 좋아한 작품
- 아직 안 본 작품은 `Skip`

### `src/app/result/[id]/page.tsx`

결과 라우트입니다. 실제 결과 UI는 feature 내부의 `TasteResultView`가 담당합니다.

### `src/features/taste/components/TasteTestFlow.tsx`

평가 플로우의 조립 컴포넌트입니다. 상태 로직은 직접 갖지 않고 `useTasteTest` hook을 사용합니다.

### `src/features/taste/hooks/useTasteTest.ts`

평가 상태를 관리합니다.

담당:

- 현재 콘텐츠 index
- 별점 상태
- Skip 상태
- 최소 평가 수 검증
- 결과 생성
- localStorage 저장
- 결과 페이지 라우팅

현재 기준:

```ts
TEST_CONTENTS = STREAMING_CONTENTS.slice(0, 20)
MIN_REQUIRED_RATINGS = 12
```

### `src/features/taste/data/streamingContents.ts`

평가 대상 콘텐츠 20개를 담고 있습니다.

현재 기준은 **한국 Netflix 오리지널/독점 공개 인기작 중심 큐레이션**입니다.

현재 포함 콘텐츠:

- 오징어 게임
- 지금 우리 학교는
- 더 글로리
- 폭싹 속았수다
- 중증외상센터
- 킹덤
- 스위트홈
- 지옥
- D.P.
- 마스크걸
- 마이 네임
- 셀러브리티
- 경성크리처
- 살인자ㅇ난감
- 기생수: 더 그레이
- 광장
- 수리남
- 택배기사
- The 8 Show
- 고요의 바다

각 콘텐츠는 다음 정보를 가집니다.

```ts
{
  id: string;
  title: string;
  type: 'movie' | 'series';
  genres: string[];
  posterPath: string | null;
  year: string;
  providers: string[];
  summary: string;
  traits: TasteTraits;
}
```

### `src/features/taste/lib/analyzeTasteMbti.ts`

별점 기반 MBTI풍 결과를 계산합니다.

알고리즘 요약:

```txt
사용자 취향 점수 = 콘텐츠 trait 점수 × 사용자의 별점
```

8개 trait:

- `stimulation`: 자극/속도감
- `emotion`: 감정선
- `imagination`: 세계관/상상력
- `realism`: 현실감
- `structure`: 구조/완성도
- `relationship`: 관계/캐릭터
- `closure`: 완결감
- `novelty`: 새로움/실험성

4개 축:

```txt
E / I = stimulation vs emotion
N / S = imagination vs realism
T / F = structure vs relationship
J / P = closure vs novelty
```

점수가 높은 쪽의 알파벳을 선택해 4글자 코드를 만듭니다.

예:

```txt
E + S + T + J = ESTJ
```

### `src/features/taste/data/resultCopy.ts`

16개 MBTI풍 결과의 제목, 설명, 강점, 시청 스타일 문구를 담습니다.

예:

- `ESTJ`: 완성도 감별사
- `ENFP`: 도파민 탐험가
- `INFJ`: 감정선 수집가
- `INTP`: 세계관 해커

### `src/features/taste/lib/recommendContents.ts`

사용자가 높게 평가한 콘텐츠와 가까운 미시청 콘텐츠를 추천합니다.

특징:

- 이미 평가한 콘텐츠는 추천에서 제외
- 5점을 준 콘텐츠가 있으면 해당 콘텐츠들의 장르 유사도와 trait 유사도를 우선 반영
- 5점 콘텐츠가 없으면 4점 이상, 그마저 없으면 평가한 전체 콘텐츠를 기준으로 fallback
- `Skip`한 콘텐츠는 아직 평가하지 않은 후보로 남기며, 장르/성향이 맞으면 추천될 수 있음
- 결과 코드의 선호 축에 해당하는 trait 점수는 보조 점수로 반영

### `src/features/taste/storage/localTasteResultStorage.ts`

결과를 localStorage에 저장하고 불러옵니다.

현재 공유 URL은 같은 브라우저에서만 결과를 볼 수 있습니다. 다른 기기/브라우저에서 공유 결과를 보려면 Supabase 같은 서버 저장소가 필요합니다.

## 남아 있는 legacy 코드

초기 아이디어였던 영화 월드컵 관련 코드가 아직 일부 남아 있습니다.

예:

- `src/components/WorldCup.tsx`
- `src/hooks/useTournament.ts`
- `src/components/MovieCard.tsx`
- `src/components/GenreSelector.tsx`
- `src/app/genre/[genre]/page.tsx`
- `src/data/mockMovies.ts`
- `src/lib/tmdb.ts`
- `src/app/api/movies/route.ts`

현재 MVP의 핵심은 `features/taste`입니다. 새 작업을 할 때는 먼저 `src/features/taste`를 기준으로 판단하세요.

## 현재 알려진 주의점

### 1. 포트

기존 `3000` 포트가 Windows에서 종료되지 않는 프로세스에 점유된 적이 있어 `dev`는 `3001`로 변경되어 있습니다.

### 2. 결과 저장

결과는 localStorage 기반입니다. 서버에 저장되지 않습니다.

영향:

- 같은 브라우저에서는 결과 페이지 접근 가능
- 다른 브라우저/기기에서는 결과 ID를 알아도 결과를 볼 수 없음

### 3. TOP20 표현

현재 콘텐츠는 Netflix 공식 "대한민국 TOP20 순위표"가 아니라, 한국 Netflix 오리지널/독점 공개 인기작 중심 큐레이션입니다.

UI에서는 "한국 Netflix 오리지널 인기작"으로 표현하는 것이 정확합니다.

### 4. 포스터

Netflix 공식 포스터 API가 아니라 TMDB 이미지 CDN path를 사용합니다.

## 다음 개발 우선순위

1. legacy MovieCup 코드 제거 또는 `legacy` 폴더로 격리
2. localStorage 결과 저장을 Supabase로 이전
3. 콘텐츠 데이터 검증을 `validateContents`로 자동화
4. `analyzeTasteMbti`와 `recommendContents`에 테스트 추가
5. 결과 공유 이미지 생성
6. Skip 비율이 높을 때 결과 신뢰도 안내 추가
7. 콘텐츠 후보를 관리자 화면 또는 DB에서 관리

## 작업 시 추천 원칙

- 새 기능은 `src/features/taste` 내부에 추가하세요.
- 라우트 파일은 최대한 얇게 유지하세요.
- UI 상태는 hook으로 분리하세요.
- 데이터 copy와 알고리즘은 분리하세요.
- Netflix 공식 서비스처럼 보이는 표현은 피하세요.
- “진짜 MBTI 진단”처럼 표현하지 말고 “MBTI풍 취향 테스트”로 유지하세요.
