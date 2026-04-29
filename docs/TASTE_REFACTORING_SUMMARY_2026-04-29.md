# Taste 리팩터링 정리

작성일: 2026-04-29

## 목적

이번 리팩터링의 목표는 `taste` 기능의 핵심 도메인을 하나로 통일하고, 유지보수 시 변경 범위를 줄이는 것이었습니다.

리팩터링 전에는 다음 문제가 있었습니다.

- 결과 계산과 추천은 새 3축 도메인을 쓰는데, 테스트 작품 선정은 예전 MBTI 축에 의존하고 있었습니다.
- 작품의 새 축 데이터가 콘텐츠 모델과 분리된 별도 프리셋 파일에 있어 단일 진실 원천이 없었습니다.
- `useTasteTest` 훅이 세션 상태, 저장, 제출, 라우팅, 뷰 파생값을 모두 담당하고 있었습니다.
- `TasteResultView`가 결과 로딩, 공유 SDK 연동, UI 렌더링을 한 파일에서 모두 처리하고 있었습니다.

이번 작업은 위 문제를 단계적으로 줄이는 데 집중했습니다.

---

## 핵심 변화 요약

### 1. 새 3축 도메인을 콘텐츠 모델로 통합

기존에는 새 축 데이터가 `profileAxisPresets.ts`에 따로 있었고, 런타임에서 `getProfileAxes()`로 읽어왔습니다.

지금은 각 콘텐츠가 직접 `profileAxes`를 가지도록 바꿨습니다.

관련 파일:

- `src/features/taste/types.ts`
- `src/features/taste/data/streamingContents.ts`
- 삭제: `src/features/taste/data/profileAxisPresets.ts`

변경 이유:

- 콘텐츠 하나를 수정할 때 한 곳만 보면 되게 만들기 위해
- 새 작품 추가 시 축 데이터 누락을 타입 수준에서 막기 위해
- 분석/추천/선정 로직이 모두 같은 데이터 원천을 보게 하기 위해

효과:

- `StreamingContent`가 실제 도메인 모델 역할을 하게 됨
- 숨겨진 fallback 분기 없이 명시적인 데이터 구조가 됨
- 새 축 체계가 프로젝트 전반의 기본 언어가 됨

---

### 2. 테스트 작품 선정 로직을 새 3축 기준으로 재작성

기존 `selectTestContents.ts`는 다음 방식이었습니다.

- MBTI pole `E/I/N/S/T/F/J/P` 기반 후보 선정
- trait 평균 복제형 balance
- top-3 랜덤 선택

현재는 다음 방식으로 바뀌었습니다.

- `도파민/여운`
- `설정 주도/정서 주도`
- `플롯 주도/관계 주도`

위 3축의 6개 극을 먼저 대표작으로 확보하고, 남은 슬롯은 세트 균형과 장르 다양성 기준으로 채웁니다.

관련 파일:

- `src/features/taste/lib/selectTestContents.ts`

변경 이유:

- 선정 로직도 결과/추천과 같은 도메인 언어를 사용하게 하기 위해
- 결과 모델이 바뀌어도 선정 로직이 따로 놀지 않게 하기 위해
- 세션마다 품질이 흔들리는 랜덤 의존을 줄이기 위해

효과:

- selection / analysis / recommendation이 같은 3축 구조를 공유
- 랜덤 기반 top-3 선택 제거
- 대표 극 커버리지를 명시적으로 확보하는 구조로 변경

---

### 3. `useTasteTest` 훅 책임 분리

기존 `useTasteTest.ts`는 아래 책임을 한 파일에서 모두 담당했습니다.

- 테스트 세트 생성
- 로컬스토리지 복구/저장
- 현재 카드 평가/스킵/이동
- 제출 처리
- 결과 페이지 이동
- 화면용 프리뷰 데이터 계산

현재는 역할별 훅으로 분리했습니다.

관련 파일:

- `src/features/taste/hooks/useTasteTest.ts`
- `src/features/taste/hooks/useTasteTestSession.ts`
- `src/features/taste/hooks/useTasteTestPersistence.ts`
- `src/features/taste/hooks/useTasteTestSubmission.ts`
- `src/features/taste/hooks/useTasteTestViewModel.ts`

구조:

- `useTasteTestSession`
  - 테스트 진행 상태
  - rating / skip / next / previous
- `useTasteTestPersistence`
  - in-progress 저장/복구
- `useTasteTestSubmission`
  - 결과 계산
  - 결과 저장
  - 결과 페이지 이동
- `useTasteTestViewModel`
  - `topRatedPreview`
  - `analysisPreviewContents`
- `useTasteTest`
  - 위 훅들을 조합하는 오케스트레이션 레이어

변경 이유:

- SRP 관점에서 훅 하나가 너무 많은 책임을 갖고 있었기 때문
- 저장 로직 수정이 세션 상태 로직과 충돌하지 않게 하기 위해
- 제출/라우팅 변경이 UI 파생값 계산을 흔들지 않게 하기 위해

효과:

- 책임 경계가 명확해짐
- 이후 테스트 작성 포인트가 분리됨
- 특정 기능 변경 시 영향 범위를 예측하기 쉬워짐

---

### 4. 결과 화면 로직 분리

기존 `TasteResultView.tsx`는 아래를 모두 처리했습니다.

- 결과 로딩
- 추천/평가 콘텐츠 파생
- 클립보드 공유
- 네이티브 공유
- 인스타 공유
- 카카오 SDK 로드 및 공유
- 전체 결과 UI 렌더링

현재는 데이터/공유/UI를 분리했습니다.

관련 파일:

- `src/features/taste/components/TasteResultView.tsx`
- `src/features/taste/hooks/useTasteResult.ts`
- `src/features/taste/hooks/useTasteResultShare.ts`
- `src/features/taste/components/result/TasteResultEmptyState.tsx`
- `src/features/taste/components/result/TasteResultHero.tsx`
- `src/features/taste/components/result/TasteResultAnalysisSection.tsx`
- `src/features/taste/components/result/TasteResultContentSection.tsx`
- `src/features/taste/components/result/tasteResultLabels.ts`

구조:

- `useTasteResult`
  - 결과 로딩
  - `ratedContents`
  - `recommendedContents`
- `useTasteResultShare`
  - 공유 payload
  - 클립보드
  - 네이티브 공유
  - 인스타 공유
  - 카카오 공유
- `TasteResultView`
  - 결과 조립용 컨테이너
- result 컴포넌트들
  - empty state
  - hero
  - analysis section
  - content section

변경 이유:

- 외부 SDK 연동 코드와 UI 코드를 분리하기 위해
- 카피 수정과 공유 로직 변경이 같은 파일에서 충돌하지 않게 하기 위해
- 프레젠테이셔널 컴포넌트 단위로 수정 가능하게 만들기 위해

효과:

- 공유 연동 변경이 쉬워짐
- UI 섹션별 수정이 간단해짐
- 결과 페이지의 책임이 읽기 쉬운 단위로 나뉨

---

## 유지보수 관점에서 개선된 점

### 도메인 일관성

이제 최소한 아래 세 영역은 같은 언어를 씁니다.

- 콘텐츠 데이터
- 테스트 선정
- 결과 분석
- 추천

핵심 도메인 축은 다음 3개입니다.

- `dopamine / afterglow`
- `concept / emotionDriven`
- `plotDriven / relationshipDriven`

이전보다 “같은 기능을 다른 축 체계로 관리하는 문제”가 크게 줄었습니다.

### 책임 분리

다음 두 군데의 큰 결합이 완화됐습니다.

- `useTasteTest`의 상태/영속화/제출 결합
- `TasteResultView`의 데이터/공유/UI 결합

즉 지금 구조는 기능별 수정이 더 작은 단위에서 끝날 가능성이 높습니다.

### 코드 읽기 난도

새로 합류한 개발자가 이해해야 할 흐름이 더 선명해졌습니다.

- 콘텐츠 데이터는 `streamingContents.ts`
- 테스트 선정은 `selectTestContents.ts`
- 결과 계산은 `analyzeTasteMbti.ts`
- 추천은 `recommendContents.ts`
- 테스트 상태는 `useTasteTest*`
- 결과 화면은 `useTasteResult*` + `components/result/*`

---

## 아직 남은 과제

### 1. 자동 테스트 추가

아직 가장 중요한 남은 작업입니다.

우선순위:

- `src/features/taste/lib/selectTestContents.ts`
- `src/features/taste/lib/analyzeTasteMbti.ts`
- `src/features/taste/lib/recommendContents.ts`

권장 범위:

- fixture 기반 단위 테스트
- 대표 입력에 대한 기대 결과 검증
- 중복 제거 / 커버리지 / 추천 제외 규칙 검증

### 2. 결과 분포 튜닝

구조는 정리됐지만, 결과 분포가 얼마나 고르게 나오는지는 여전히 기획/휴리스틱 조정 영역입니다.

향후 점검 대상:

- 작품별 `profileAxes` 수치
- selection 보정 상수
- recommendation 가중치
- scoring 상수

### 3. 네이밍 정리

현재 함수명 `analyzeTasteMbti`와 타입 alias `TasteMbtiResult`는 호환성 유지를 위해 남아 있습니다.

장기적으로는 아래처럼 정리하는 것이 더 자연스럽습니다.

- `analyzeTasteProfile`
- `TasteProfileResult`

### 4. 결과/공유 문구 정제

현재 결과 화면 일부 문구는 기존 텍스트와 새 브랜드 톤이 섞여 있을 수 있습니다.

후속 작업 후보:

- 8유형 카피 정제
- 공유 문구 A/B 테스트
- 여성 타겟 중심 문구 최적화

---

## 검증 결과

리팩터링 각 단계 이후 아래 검증을 반복 수행했습니다.

- `node_modules\\.bin\\tsc --noEmit`
- `node_modules\\.bin\\next build`

최종 상태에서도 둘 다 통과했습니다.

즉 현재 구조 변경은 타입 수준과 프로덕션 빌드 수준에서 모두 정상입니다.

---

## 결론

이번 리팩터링의 가장 큰 의미는 `taste` 기능이 더 이상 임시 구조에 머물지 않고, “새 3축 도메인을 중심으로 모듈이 정렬된 상태”로 넘어왔다는 점입니다.

아직 자동 테스트와 추가 튜닝은 남아 있지만, 지금부터는 기능 추가나 카피 수정, 추천 로직 개선을 훨씬 안전하게 진행할 수 있는 기반이 생겼습니다.

다음 우선순위는 자동 테스트 추가입니다.
