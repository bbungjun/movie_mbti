# 코드베이스 평가 리포트

작성일: 2026-04-25  
평가 관점: 시니어 개발자 기준의 모듈화, 유지보수성, 확장성, MVP 이후 리팩터링 우선순위

## 총평

현재 코드베이스는 MVP를 빠르게 검증하기 위한 구조로는 충분히 작동한다. Next.js App Router 기반으로 화면, 데이터, 분석 로직, 타입이 큰 단위로는 분리되어 있고, `TasteTest`, `tasteMbti`, `netflixContents`, `result/[id]` 같은 핵심 파일이 역할을 어느 정도 나누고 있다.

다만 현재는 기존 영화 월드컵 서비스 코드와 새 Netflix 취향 MBTI 서비스 코드가 함께 남아 있어 도메인 경계가 흐려졌다. 단기 MVP 단계에서는 괜찮지만, 사용자가 늘거나 기능이 확장되면 유지보수 비용이 빠르게 증가할 가능성이 높다.

**종합 점수: 6.5 / 10**

- MVP 완성도: 7.5 / 10
- 모듈화: 6 / 10
- 유지보수성: 6 / 10
- 확장성: 6 / 10
- 테스트 가능성: 4 / 10
- 데이터/도메인 설계: 6.5 / 10

---

## 잘 된 점

### 1. MVP 흐름이 명확하다

현재 핵심 사용자 플로우는 단순하고 이해하기 쉽다.

```txt
홈 → 콘텐츠 평가 → 결과 분석 → 결과 페이지 → 추천 콘텐츠
```

이 흐름은 [src/app/page.tsx](./src/app/page.tsx), [src/components/TasteTest.tsx](./src/components/TasteTest.tsx), [src/app/result/[id]/page.tsx](./src/app/result/[id]/page.tsx)로 이어진다. 화면 단위가 크게 분리되어 있어 초기 개발 속도에는 유리하다.

### 2. 분석 로직이 UI에서 분리되어 있다

MBTI풍 결과 계산은 [src/lib/tasteMbti.ts](./src/lib/tasteMbti.ts)에 모여 있다. 이는 좋은 방향이다. `TasteTest` 컴포넌트가 별점 입력을 담당하고, `analyzeTasteMbti`가 분석 결과를 만드는 구조라서 최소한의 관심사 분리는 되어 있다.

### 3. 콘텐츠 데이터가 별도 파일로 분리되어 있다

콘텐츠 후보와 trait 점수가 [src/data/netflixContents.ts](./src/data/netflixContents.ts)에 분리되어 있다. 덕분에 UI 코드를 건드리지 않고 콘텐츠 후보를 추가하거나 수정할 수 있다.

### 4. 타입이 명시되어 있다

[src/types/index.ts](./src/types/index.ts)에 `NetflixContent`, `TasteTraits`, `TasteMbtiResult`, `TasteAxisResult` 등이 정의되어 있어 도메인 데이터 형태를 추적하기 쉽다. TypeScript를 제대로 활용할 수 있는 기반은 이미 있다.

---

## 주요 문제점

### 1. 두 개의 제품 도메인이 섞여 있다

현재 코드베이스에는 기존 영화 월드컵 도메인과 새 Netflix 취향 MBTI 도메인이 함께 존재한다.

월드컵 관련 파일:

- [src/components/WorldCup.tsx](./src/components/WorldCup.tsx)
- [src/hooks/useTournament.ts](./src/hooks/useTournament.ts)
- [src/components/MovieCard.tsx](./src/components/MovieCard.tsx)
- [src/components/GenreSelector.tsx](./src/components/GenreSelector.tsx)
- [src/app/genre/[genre]/page.tsx](./src/app/genre/[genre]/page.tsx)
- [src/data/mockMovies.ts](./src/data/mockMovies.ts)

Netflix MBTI 관련 파일:

- [src/components/TasteTest.tsx](./src/components/TasteTest.tsx)
- [src/lib/tasteMbti.ts](./src/lib/tasteMbti.ts)
- [src/data/netflixContents.ts](./src/data/netflixContents.ts)
- [src/app/result/[id]/page.tsx](./src/app/result/[id]/page.tsx)

문제는 `/result/[id]`가 원래 월드컵 결과 페이지였는데 지금은 MBTI 결과 페이지로 바뀌었다는 점이다. 반면 월드컵 코드 일부는 여전히 `saveGameResult`, `getGameResult`, `GameResult` 같은 타입과 함께 남아 있다. 이 상태는 시간이 지나면 "이 result가 어떤 result인가?"라는 혼란을 만든다.

**권장 방향:** 새 서비스가 Netflix MBTI로 확정됐다면 월드컵 관련 라우트와 컴포넌트는 제거하거나 `legacy` 영역으로 이동해야 한다.

---

### 2. `TasteTest` 컴포넌트가 너무 많은 책임을 가진다

[src/components/TasteTest.tsx](./src/components/TasteTest.tsx)는 현재 다음 책임을 모두 가진다.

- 현재 평가 카드 인덱스 관리
- 별점 상태 관리
- Skip 상태 관리
- 평가 조건 검증
- 결과 생성 호출
- 결과 저장 호출
- 라우팅
- 카드 UI 렌더링
- 하단 액션 UI 렌더링

MVP에서는 괜찮지만, 다음 기능이 추가되면 컴포넌트가 금방 커질 가능성이 높다.

- 콘텐츠 검색
- 평가 재개
- 랜덤 콘텐츠 섞기
- 장르 필터
- 사용자별 평가 저장
- 서버 저장
- A/B 테스트

**권장 방향:** 다음처럼 분리하는 것이 좋다.

```txt
src/features/taste-test/
  components/
    TasteTestFlow.tsx
    TasteContentCard.tsx
    RatingControls.tsx
    TasteProgress.tsx
    TasteTestFooter.tsx
  hooks/
    useTasteTest.ts
  constants.ts
```

이렇게 분리하면 UI 변경과 상태 로직 변경을 독립적으로 다룰 수 있다.

---

### 3. 분석 결과 copy와 알고리즘이 한 파일에 섞여 있다

[src/lib/tasteMbti.ts](./src/lib/tasteMbti.ts)는 현재 아래 두 성격을 동시에 가진다.

- 분석 알고리즘
- 16개 결과 타입의 문구 데이터

문구는 제품/콘텐츠 성격이 강하고, 알고리즘은 도메인 로직이다. 둘이 같은 파일에 있으면 결과 문구를 수정할 때 분석 로직까지 같이 건드리게 된다.

**권장 방향:**

```txt
src/features/taste-result/
  resultCopy.ts
  analyzeTasteMbti.ts
  recommendContents.ts
```

특히 `RESULT_COPY`는 별도 파일로 분리하는 것이 좋다. 이후 관리자 화면이나 CMS로 옮기기도 쉬워진다.

---

### 4. 저장 계층 이름이 실제 역할과 맞지 않는다

[src/lib/supabase.ts](./src/lib/supabase.ts)는 현재 실제 Supabase 클라이언트가 아니라 localStorage wrapper에 가깝다. 파일명은 Supabase인데 동작은 localStorage이기 때문에 유지보수자가 오해하기 쉽다.

현재 역할:

- 월드컵 로그 localStorage 저장
- 월드컵 결과 localStorage 저장
- MBTI 결과 localStorage 저장
- Supabase 연동 placeholder

**권장 방향:**

```txt
src/lib/storage/localTasteResultStorage.ts
src/lib/storage/localGameStorage.ts
src/lib/supabase/client.ts
```

MVP에서는 localStorage를 유지하더라도 이름을 정확히 바꾸는 것이 좋다.

---

### 5. 타입 파일이 비대해질 조짐이 있다

[src/types/index.ts](./src/types/index.ts)에 월드컵, TMDB, OTT, Netflix MBTI 타입이 모두 들어 있다. 현재 규모에서는 문제가 크지 않지만, 확장될수록 전역 타입 모음 파일은 점점 비대해진다.

**권장 방향:**

```txt
src/types/movie.ts
src/types/tmdb.ts
src/types/taste.ts
src/types/ott.ts
```

또는 feature 단위로 타입을 배치하는 방식이 더 좋다.

```txt
src/features/taste-test/types.ts
src/features/movie-cup/types.ts
```

---

### 6. 데이터 품질 검증 장치가 없다

[src/data/netflixContents.ts](./src/data/netflixContents.ts)는 서비스 결과 품질에 직접 영향을 주는 핵심 데이터다. 하지만 현재는 다음을 자동으로 검증하지 않는다.

- 콘텐츠 ID 중복 여부
- `posterPath` 유효성
- trait 점수가 0~100 범위인지
- 필수 필드 누락 여부
- 추천 결과가 평가한 콘텐츠를 제외하는지

**권장 방향:** 최소한의 데이터 검증 함수를 만들고 테스트를 추가하는 것이 좋다.

예시:

```txt
validateNetflixContents(contents)
```

검증 항목:

- 모든 `id`는 unique
- 모든 trait 값은 0 이상 100 이하
- `title`, `summary`, `posterPath`는 비어 있지 않아야 함
- 콘텐츠 수가 최소 평가 기준보다 많아야 함

---

## 확장성 평가

### 콘텐츠 수 확장

현재 20개 정도는 정적 파일로 관리해도 괜찮다. 하지만 50개 이상으로 늘어나면 수동 관리가 부담스러워질 수 있다.

추천 방향:

1. MVP: `netflixContents.ts` 유지
2. V2: JSON 또는 DB로 분리
3. V3: 관리자 화면에서 콘텐츠와 trait 점수 편집

### OTT 확장

현재 서비스는 Netflix 중심으로 설계되어 있다. 다른 OTT로 확장하려면 `NetflixContent`라는 이름부터 일반화하는 것이 좋다.

현재:

```ts
NetflixContent
NETFLIX_CONTENTS
```

권장:

```ts
StreamingContent
STREAMING_CONTENTS
providers: ['netflix', 'tving', 'watcha']
```

이름을 일반화하면 티빙, 웨이브, 왓챠, 디즈니+ 확장이 쉬워진다.

### 결과 공유 확장

현재 결과는 localStorage에 저장된다. 이 구조는 같은 브라우저에서는 작동하지만, 공유 링크를 다른 사람에게 보내면 결과를 볼 수 없다.

공유 서비스를 만들려면 결과 저장은 서버/DB로 옮겨야 한다.

우선순위:

1. Supabase `taste_results` 테이블 생성
2. 결과 저장 API 추가
3. `/result/[id]`에서 서버 데이터 조회
4. localStorage는 임시 캐시로만 사용

---

## 테스트 관점 평가

현재 테스트 코드가 없다. 이 서비스에서 가장 먼저 테스트해야 하는 곳은 UI보다 분석 로직이다.

우선순위 높은 테스트:

1. `analyzeTasteMbti`가 항상 4글자 코드를 반환하는지
2. rating이 없는 콘텐츠를 무시하는지
3. 추천 콘텐츠가 이미 평가한 콘텐츠를 제외하는지
4. 모든 결과 코드에 copy가 존재하는지
5. trait 점수 차이에 따라 confidence가 올바르게 계산되는지

추천 테스트 파일:

```txt
src/lib/tasteMbti.test.ts
src/data/netflixContents.test.ts
```

현재 `package.json`에는 test script가 없다. Vitest를 도입하면 Next.js 프로젝트에서 가볍게 시작할 수 있다.

---

## UX/프론트엔드 구조 평가

한 카드씩 평가하는 방식으로 바꾼 것은 모바일 UX 측면에서 좋은 결정이다. 20개 전체 그리드보다 피로도가 낮고, 사용자의 현재 행동도 명확하다.

다만 다음 개선이 필요하다.

- 별점을 누르면 자동으로 다음 카드로 넘어갈지 여부를 제품적으로 결정해야 한다.
- 이미 평가한 카드로 돌아갔을 때 상태가 잘 보이는 것은 좋다.
- Skip한 카드도 완료 처리된다는 점은 명확하지만, 결과 산출에는 제외된다는 안내가 더 있으면 좋다.
- 마지막까지 가지 않아도 결과를 볼 수 있는 현재 구조는 이탈 방지에 좋다.

---

## 리팩터링 우선순위

### P0. 도메인 정리

Netflix MBTI 서비스가 메인이라면 기존 월드컵 도메인을 제거하거나 `legacy`로 격리한다.

추천 작업:

- `/genre/[genre]` 라우트 유지 여부 결정
- `WorldCup`, `useTournament`, `GenreSelector`, `mockMovies` 제거 또는 legacy 이동
- `GameResult`, `GameLog` 타입 정리
- `/api/movies`, `/api/log`의 현재 필요성 재검토

### P1. Taste feature 모듈화

현재 핵심 기능을 feature 폴더로 모은다.

추천 구조:

```txt
src/features/taste/
  components/
  data/
  hooks/
  lib/
  types.ts
```

이렇게 하면 새 기능이 추가되어도 관련 파일을 찾기 쉽다.

### P1. 분석 로직과 결과 copy 분리

`tasteMbti.ts`에서 결과 문구 데이터를 분리한다.

추천:

```txt
src/features/taste/data/resultCopy.ts
src/features/taste/lib/analyzeTasteMbti.ts
src/features/taste/lib/recommendContents.ts
```

### P2. localStorage 저장소 명확화

`supabase.ts`라는 이름은 현재 역할과 맞지 않는다.

추천:

```txt
src/lib/storage/tasteResults.ts
```

Supabase 연동은 실제로 붙일 때 별도 파일로 둔다.

### P2. 데이터 검증 추가

콘텐츠 데이터가 곧 서비스 품질이다. 간단한 검증만 있어도 사고를 줄일 수 있다.

### P3. 테스트 도입

분석 로직부터 테스트한다. UI 테스트보다 ROI가 높다.

---

## 제안하는 목표 구조

```txt
src/
  app/
    page.tsx
    result/[id]/page.tsx
  features/
    taste/
      components/
        TasteTestFlow.tsx
        TasteContentCard.tsx
        RatingControls.tsx
        TasteProgress.tsx
        TasteResultView.tsx
      data/
        streamingContents.ts
        resultCopy.ts
      hooks/
        useTasteTest.ts
      lib/
        analyzeTasteMbti.ts
        recommendContents.ts
        validateContents.ts
      storage/
        localTasteResultStorage.ts
      types.ts
  lib/
    tmdb.ts
    utils.ts
```

이 구조는 기능 단위 응집도가 높고, 앞으로 OTT 확장, DB 저장, 관리자 페이지 추가에도 대응하기 쉽다.

---

## 결론

현재 코드베이스는 MVP 실험으로는 충분히 좋은 출발점이다. 핵심 플로우가 동작하고, 분석 로직과 데이터도 최소한 분리되어 있다.

하지만 지금 상태 그대로 기능을 계속 얹으면 유지보수성이 빠르게 떨어질 가능성이 높다. 가장 먼저 해야 할 일은 기존 영화 월드컵 코드와 Netflix MBTI 코드를 도메인 단위로 분리하는 것이다. 그 다음 `TasteTest`와 `tasteMbti`를 작은 단위로 나누면 확장성이 크게 좋아진다.

**추천 다음 액션:**

1. 기존 월드컵 코드 유지 여부 결정
2. `src/features/taste` 기반으로 핵심 기능 재배치
3. `TasteTest`를 hook과 하위 컴포넌트로 분리
4. 결과 copy와 분석 알고리즘 분리
5. localStorage 저장소 이름 정리
6. 분석 로직 테스트 추가

