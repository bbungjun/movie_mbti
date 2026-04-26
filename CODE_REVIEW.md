# 코드베이스 평가 보고서

## 전체 점수: **B+ (양호)**

모듈화와 유지보수성 관점에서 기본기는 갖추었으나, 개선할 부분이 있습니다.

---

## 잘 된 점

### 1. **명확한 디렉토리 구조**
```
src/
├── app/          # 라우팅 (Next.js App Router)
├── components/   # UI 컴포넌트
├── lib/          # 유틸리티/서비스
└── types/        # 타입 정의
```
관심사가 폴더 단위로 잘 분리되어 있습니다.

### 2. **TypeScript 활용**
- `types/index.ts`에 모든 타입이 중앙 집중화
- 인터페이스가 명확하게 정의됨 (`Movie`, `GameLog`, `GameResult` 등)
- 컴포넌트 Props 타입이 명시적

### 3. **API Fallback 패턴** (`tmdb.ts:104-127`)
```typescript
if (!isApiAvailable()) {
  return mockMovies.slice(0, limit);
}
// API 호출 실패 시에도 mock으로 fallback
catch (error) {
  return mockMovies.slice(0, limit);
}
```
개발/운영 환경 모두에서 안정적으로 동작합니다.

### 4. **순수 유틸리티 함수 분리** (`utils.ts`)
- `shuffleArray`, `formatDate`, `getRoundName` 등 재사용 가능한 함수들
- 단일 책임 원칙 준수

### 5. **Server/Client Component 분리**
- `genre/[genre]/page.tsx`: Server Component (데이터 fetching)
- `WorldCup.tsx`: Client Component (`'use client'`)

---

## 개선이 필요한 점

### 1. **중복 코드 (Critical)**

`utils.ts`와 `supabase.ts`에 `saveGameResult` 함수가 **중복 존재**:

```typescript
// utils.ts:124
export function saveGameResult(result: unknown): string { ... }

// supabase.ts:40
export async function saveGameResult(result: Omit<GameResult, 'id' | 'createdAt'>): Promise<string> { ... }
```

**문제점**: 어떤 함수를 사용할지 혼란, 동작이 미묘하게 다름

**권장 해결책**: `supabase.ts`의 함수만 유지하고, `utils.ts`의 storage 관련 함수들을 제거하거나 통합

---

### 2. **WorldCup.tsx가 너무 많은 책임을 가짐 (God Component)**

현재 `WorldCup.tsx`가 담당하는 역할:
- UI 렌더링
- 토너먼트 로직
- 상태 관리
- API 호출
- 라우팅
- 로깅

**권장 해결책**: 커스텀 훅으로 로직 분리

```typescript
// 예시: hooks/useTournament.ts
function useTournament(movies: Movie[], genre: string) {
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  // ... 토너먼트 로직
  return { matchState, handleSelect, progress };
}
```

---

### 3. **에러 처리 일관성 부족**

```typescript
// tmdb.ts - 에러 시 빈 배열 반환
catch (error) {
  console.error('TMDB API error:', error);
  return [];  // 조용히 실패
}

// route.ts - HTTP 에러 반환
catch (error) {
  return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
}
```

**권장 해결책**: 공통 에러 클래스 또는 Result 패턴 도입

---

### 4. **환경변수 타입 안전성 부족**

```typescript
// 현재 (tmdb.ts:4)
const TMDB_ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN || '';

// 권장: 환경변수 검증 파일
// lib/env.ts
export const env = {
  TMDB_ACCESS_TOKEN: z.string().min(1).parse(process.env.TMDB_ACCESS_TOKEN),
} as const;
```

---

### 5. **상수/설정 분산**

장르 정보가 `tmdb.ts`에 하드코딩:

```typescript
// tmdb.ts:15-22
export const GENRES: Genre[] = [
  { id: 'action', name: '액션', tmdbId: 28, ... },
  // ...
];
```

**권장**: `config/genres.ts` 또는 `constants/` 디렉토리로 분리

---

### 6. **테스트 부재**

- 단위 테스트 없음
- 통합 테스트 없음
- `shuffleArray`, `createBracket` 같은 핵심 로직은 테스트 필수

---

### 7. **미사용 코드**

- `OTTBadge.tsx`: 컴포넌트가 존재하지만 어디서도 사용되지 않음
- `Match`, `GameState` 인터페이스: 정의되었지만 실제 사용 안 됨

---

## 모듈별 평가

| 모듈 | 점수 | 평가 |
|------|------|------|
| `types/index.ts` | A | 타입 정의 명확, 중앙 집중화 |
| `lib/utils.ts` | B | 순수 함수지만 일부 중복 |
| `lib/tmdb.ts` | B+ | Fallback 좋지만, mock 데이터가 너무 큼 |
| `lib/supabase.ts` | B | localStorage 추상화 양호 |
| `components/` | B | 재사용성 양호, 크기별 분류 필요 |
| `app/api/` | B+ | 간결하지만 에러 처리 개선 필요 |
| `WorldCup.tsx` | C+ | 기능은 동작하나 분리 필요 |

---

## 우선순위별 개선 권장사항

### 즉시 수정 (High Priority)
1. `saveGameResult` 중복 제거
2. 미사용 코드 정리 (`OTTBadge`, 미사용 타입)

### 단기 개선 (Medium Priority)
3. `WorldCup.tsx`에서 커스텀 훅 분리 (`useTournament`)
4. 환경변수 검증 추가 (zod 사용)
5. 상수 파일 분리 (`constants/genres.ts`)

### 장기 개선 (Low Priority)
6. 테스트 코드 추가
7. 에러 처리 표준화
8. Mock 데이터를 별도 파일로 분리 (`__mocks__/movies.ts`)

---

## 결론

이 코드베이스는 **MVP 수준에서는 적절한 구조**를 가지고 있습니다. Next.js App Router를 적절히 활용하고, TypeScript 타입 정의도 깔끔합니다.

다만 프로덕션 레벨로 발전시키려면:
- 비즈니스 로직 분리 (커스텀 훅)
- 중복 코드 제거
- 테스트 추가

이 세 가지가 핵심 개선 포인트입니다.
