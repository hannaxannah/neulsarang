# 늘사랑교회 통합 관리 시스템 개발 계획서
**작성일: 2026-06-12 | 최종수정: 2026-06-12**

---

## 개발 원칙

- 각 단계는 독립적으로 배포 가능한 상태로 마무리
- 단계 완료 시 Vercel 프로덕션 배포 후 다음 단계 진행
- 데이터 모델 변경은 마이그레이션 파일로 관리 (Drizzle migrate)
- 모든 API 라우트는 작성 즉시 권한 검증 포함

---

## 전체 일정 요약

| 단계 | 내용 | 기간 | 누적 |
|------|------|------|------|
| 1단계 | 프로젝트 기반 세팅 | 1주 | 1주 |
| 2단계 | 인증 및 권한 시스템 | 1주 | 2주 |
| 3단계 | 성도 관리 모듈 | 2주 | 4주 |
| 4단계 | 예배·출석 / 목장 모듈 | 2주 | 6주 |
| 5단계 | 헌금 / 목양 모듈 | 2주 | 8주 |
| 6단계 | 통계 대시보드 / 마무리 | 1주 | 9주 |

---

## 1단계: 프로젝트 기반 세팅 (1주)

### 목표
기존 순수 HTML 랜딩페이지를 Next.js로 마이그레이션하고, DB 연결 및 스키마를 완성한다.

### 작업 목록

#### 1-1. Next.js 프로젝트 초기화
- `create-next-app` with TypeScript, Tailwind CSS, App Router
- ESLint + Prettier 설정
- 절대경로 alias 설정 (`@/`)
- 기존 `index.html`, `style.css`, `main.js` → Next.js 컴포넌트로 이식
- 랜딩페이지 UI 동일성 검증

#### 1-2. Neon Postgres 연결
- Vercel Marketplace에서 Neon DB 프로비저닝
- 환경변수 설정 (`DATABASE_URL`)
- Drizzle ORM 설치 및 설정 (`drizzle.config.ts`)
- `drizzle-kit` 마이그레이션 워크플로우 구성

#### 1-3. DB 스키마 정의 (Drizzle)

```
users                  계정 (id, username, password_hash, role, cell_group_id)
members                성도 (id, name, gender, birth_date, phone, email, address,
                             registered_at, baptized, baptized_at, cell_group_id,
                             status, photo_url, notes, deleted_at)
family_members         직접 입력 가족 (id, member_id, name, relation, phone, notes)
member_relations       성도 간 관계 (id, member_id_a, member_id_b, relation_type)
cell_groups            목장 (id, name, leader_id, created_at)
cell_group_history     목장 이동 이력 (id, member_id, cell_group_id, joined_at, left_at)
services               예배 종류 (id, name, day_of_week, time, is_active)
attendance_records     예배 출석 (id, member_id, service_id, date, attended)
cell_meetings          목장모임 (id, cell_group_id, date, notes)
bible_study_groups     성경공부 모임 (id, cell_group_id, name, day_of_week, leader_id)  ← 목장 귀속
bible_study_records    성경공부 참석 (id, member_id, group_id, date, attended)
cell_meeting_records   목장모임 출석 (id, cell_meeting_id, member_id, attended)
offering_types         헌금 종류 (id, name, is_active, sort_order)  ← 기본값: 십일조·주일헌금·감사헌금·선교헌금
offering_records       헌금 내역 (id, member_id, offering_type_id, date, amount, notes)
prayer_requests        기도제목 (id, member_id, title, content, created_at,
                                 is_answered, answered_at, answer_comment)
pastoral_visits        심방 기록 (id, member_id, visited_at, visitor_id, content)
vip_list               VIP 명단 (id, member_id, vip_name, relation, phone,
                                  status, notes, created_at)
```

#### 1-4. Vercel 배포 확인
- 마이그레이션 후 프로덕션 배포
- 랜딩페이지 정상 동작 확인

### 완료 기준
- 랜딩페이지 Next.js 버전이 기존과 동일하게 동작
- Neon DB 연결 및 전체 스키마 마이그레이션 완료
- Vercel 프로덕션 배포 성공

---

## 2단계: 인증 및 권한 시스템 (1주)

### 목표
로그인 기능과 역할 기반 권한 시스템을 구축하고, 대시보드 기본 레이아웃을 완성한다.

### 작업 목록

#### 2-1. NextAuth.js v5 설정
- Credentials Provider (아이디(username) + 비밀번호)
- 비밀번호 해싱 (`bcryptjs`)
- Session에 `role`, `cellGroupId` 포함
- 미들웨어로 `/dashboard/**` 라우트 보호

#### 2-2. 로그인 UI
- `/login` 페이지 (아이디, 비밀번호 입력폼)
- 폼 유효성 검증
- 로그인 실패 에러 메시지
- 로그인 성공 시 역할별 리다이렉트
  - 관리자·목회자 → `/dashboard`
  - 목자 → `/dashboard/my-group`

#### 2-3. 랜딩페이지 정책
- 랜딩페이지는 세션 여부와 무관하게 항상 로그아웃 상태 UI 표시
- Login 버튼은 항상 `/login`으로 이동

#### 2-4. 대시보드 레이아웃
- 사이드바 네비게이션 (역할에 따라 메뉴 항목 조건부 표시)
- 상단 헤더 (현재 사용자명, 역할, 로그아웃 버튼)
- 반응형 레이아웃 (사이드바 접기/펼치기)

```
사이드바 메뉴 구성
├── 홈 (통계 요약)
├── 성도 관리           [관리자·목회자]
├── 예배·출석           [관리자·목회자]
├── 목장 관리           [전체 — 목자는 내 목장만]
├── 헌금 관리           [관리자·목회자]
├── 목양                [전체 — 목자는 내 목장만]
└── 계정 관리           [관리자]
```

#### 2-5. 계정 관리 페이지 (관리자 전용)
- 계정 목록 테이블
- 계정 생성 (이름, 아이디(username), 비밀번호, 역할, 목장 배정)
- 역할 변경 / 비활성화
- 목자 계정에 담당 목장 배정 (cell_group_id) — 데이터 조회 범위 결정

### 완료 기준
- 아이디(username)·비밀번호 로그인 동작
- 역할에 따른 라우트 접근 제어 동작
- shepherd 역할은 담당 목장 데이터만 조회 가능
- 대시보드 레이아웃 완성 (빈 컨텐츠 영역)

---

## 3단계: 성도 관리 모듈 (2주)

### 목표
성도 CRUD, 상세 탭 구조, 가족 정보, 성도 간 관계 연결, 엑셀 업로드를 완성한다.

### 작업 목록

#### 3-1. 성도 목록 페이지 (`/dashboard/members`)
- 테이블: 이름, 성별, 생년월일, 목장, 연락처, 등록일, 상태
- 검색 (이름, 연락처)
- 필터 (목장, 성별, 연령대, 등록연도, 상태)
- 정렬 (이름, 등록일, 목장)
- 페이지네이션 (50명씩)
- '성도 등록' 버튼

#### 3-2. 성도 등록·수정 폼
- 기본정보 (이름, 성별, 생년월일, 사진 업로드, 연락처, 이메일, 주소)
- 등록일, 세례 여부, 세례일
- 소속 목장 선택
- 활동 상태 선택
- 비고

#### 3-3. 성도 상세 페이지 (`/dashboard/members/[id]`)
탭 구조로 구성:

**기본정보 탭**
- 등록된 정보 표시 + 편집 버튼
- 소프트 딜리트 (이적/삭제 처리)

**가족정보 탭**
- 직접 입력 가족 목록 (CRUD)
- 성도 간 관계 연결 (성도 검색 → 관계 유형 선택 → 저장)
- 연결된 성도 카드 클릭 시 해당 성도 상세로 이동

**출석 탭**
- 예배별 출석 기록 테이블 (날짜, 예배명, 출석여부)
- 성경공부 참석 기록
- 최근 3개월 참석률 배지

**헌금 탭** (관리자·목회자만)
- 헌금 내역 테이블 (날짜, 종류, 금액)
- 종류별 참여 현황 요약

**목양 탭**
- 기도제목 목록 + 등록
- 심방 기록 목록 + 등록
- VIP 명단 목록 + 등록

#### 3-4. 엑셀 업로드 공통 컴포넌트
- `ExcelUploadModal` 컴포넌트 (재사용 가능)
- 템플릿 다운로드 (SheetJS로 양식 생성)
- 파일 파싱 → 미리보기 테이블
- 오류 행 하이라이트
- 일괄 저장 API 연동
- 결과 리포트 모달

#### 3-5. 성도 엑셀 업로드
- 템플릿 컬럼: 이름, 성별, 생년월일, 연락처, 등록일, 목장명, 세례여부
- 중복 감지 (이름 + 생년월일 기준)

### 완료 기준
- 성도 CRUD 전체 동작
- 가족관계 양방향 연결 동작
- 엑셀 업로드 → 미리보기 → 저장 플로우 동작

---

## 4단계: 예배·출석 / 목장 모듈 (2주)

### 목표
예배 출석 체크인, 목장 구성 관리, 각 통계 뷰를 완성한다.

### 1주차: 예배·출석 모듈

#### 4-1. 예배 종류 관리 (`/dashboard/services`)
- 예배 목록 CRUD (이름, 요일, 시간)

#### 4-2. 출석 입력 (`/dashboard/attendance`)
- 날짜 + 예배 선택
- 해당 예배 전체 성도 목록 체크인 UI
- 저장 (출석/결석 일괄 업데이트)
- 개별 수정 가능

#### 4-3. 출석 현황 뷰
- 예배별 출석률 테이블 (날짜 × 예배)
- 성도별 참석률 테이블 (기간 필터)
- 참석 예배 종류 분포 (성도별)

#### 4-4. 출석 엑셀 업로드
- 템플릿: 날짜, 예배종류, 성도명, 출석여부

### 2주차: 목장 모듈

#### 4-5. 목장 관리 (`/dashboard/cell-groups`)
- 목장 목록: 목장명, 목자, 인원수, 최근 출석률
- 목장 CRUD
- 목장 상세: 소속 성도 목록, 성도 추가·이동·제거
- 목장 이동 시 이력 자동 기록

#### 4-6. 성경공부 모임 관리 (`/dashboard/cell-groups/[id]/bible-study`)
- 목장별 성경공부 모임 CRUD (모임명, 소속 목장, 요일, 담당자)
- 성경공부 모임 출석 체크인 (날짜별)
- CRUD

#### 4-7. 목장모임 출석 (`/dashboard/cell-groups/[id]/meetings`)
- 모임 날짜별 출석 체크인
- CRUD

#### 4-8. 목장 현황 뷰
- 목장별 성도 출석률
- 성도별 목장모임 참석률
- 성도별 성경공부 참석률 (목장 소속 모임 기준)

#### 4-9. 목장 엑셀 업로드
- 목장 명단 템플릿: 목장명, 목자명, 성도명
- 성경공부 출석 템플릿: 날짜, 모임명, 성도명, 출석여부

### 완료 기준
- 예배 출석 체크인 플로우 동작
- 목장 구성 변경 및 이동 이력 동작
- 출석률 통계 뷰 동작

---

## 5단계: 헌금 / 목양 모듈 (2주)

### 1주차: 헌금 모듈

#### 5-1. 헌금 종류 관리 (`/dashboard/offerings/types`)
- 헌금 종류 CRUD
- 기본 4종: 십일조, 주일헌금, 감사헌금, 선교헌금
- 순서 정렬 가능

#### 5-2. 헌금 내역 (`/dashboard/offerings`)
- 헌금 내역 목록 (날짜, 성도명, 종류, 금액)
- 등록 폼 (날짜, 성도 검색, 종류, 금액)
- 수정 / 삭제
- 필터: 기간, 종류, 성도

#### 5-3. 헌금 현황 뷰
- 헌금 종류별 참여 인원 및 비율 (도넛 차트)
- 성도별 헌금 참여도 (몇 종류 참여하는지)
- 월별·연별 종류별 참여 인원 추이 (라인 차트)

#### 5-4. 헌금 엑셀 업로드
- 템플릿: 날짜, 성도명, 헌금종류, 금액

### 2주차: 목양 모듈

#### 5-5. 기도제목 (`/dashboard/pastoral/prayers`)
- 목록: 성도명, 제목, 등록일, 응답여부 (미응답 우선)
- 등록 폼 (성도 검색, 제목, 내용)
- 응답여부 토글
- 응답됨으로 변경 시 코멘트 입력 모달
- 수정 / 삭제

#### 5-6. 심방 기록 (`/dashboard/pastoral/visits`)
- 목록: 날짜, 성도명, 담당자, 내용 요약
- 등록·수정·삭제
- 필터: 성도, 담당자, 기간

#### 5-7. VIP 전도대상 명단 (`/dashboard/pastoral/vip`)
- 목록: 담당성도, VIP이름, 관계, 진행상태
- 등록·수정·삭제
- 진행상태 변경 (기도중 → 접촉 → 전도중 → 등록)
- '등록' 상태 변경 시 성도 등록 연결 옵션 팝업

#### 5-8. 목양 엑셀 업로드
- 기도제목, VIP 명단 각각 템플릿 제공

### 완료 기준
- 헌금 CRUD 및 통계 차트 동작
- 기도제목 응답 처리 (토글 + 코멘트) 동작
- VIP 진행상태 플로우 동작

---

## 6단계: 통계 대시보드 / 마무리 (1주)

### 6-1. 통계 홈 완성 (`/dashboard`)
- 위젯 레이아웃 완성
- 전체 교인 수, 이번 달 신규 등록
- 연령대 분포 차트 (Recharts)
- 최근 8주 예배별 출석 추이 (라인 차트)
- 헌금 종류별 이번 달 참여 현황
- 목장별 인원·출석률 요약 테이블
- 목자용: 내 목장 요약 위젯

### 6-2. 엑셀 다운로드 (내보내기)
- 성도 목록 엑셀 다운로드
- 출석 현황 엑셀 다운로드
- 헌금 내역 엑셀 다운로드

### 6-3. 마무리 작업
- 전체 권한 검증 재점검
- 로딩·에러 상태 UI 정비
- 반응형 레이아웃 점검 (태블릿)
- 빈 상태(Empty State) UI 처리
- 프로덕션 배포 및 최종 검수

### 완료 기준
- 대시보드 홈 차트 전체 동작
- 전체 모듈 권한 검증 통과

---

## 기술 상세

### 디렉토리 구조

```
neulsarang/
├── app/
│   ├── (public)/               # 랜딩페이지 (로그인 불필요)
│   │   └── page.tsx
│   ├── (auth)/
│   │   └── login/page.tsx
│   └── dashboard/
│       ├── layout.tsx          # 사이드바 레이아웃
│       ├── page.tsx            # 통계 홈
│       ├── members/
│       ├── attendance/
│       ├── cell-groups/
│       ├── offerings/
│       ├── pastoral/
│       └── settings/
├── components/
│   ├── ui/                     # 공통 UI (Button, Table, Modal 등)
│   ├── dashboard/              # 대시보드 전용 컴포넌트
│   └── landing/                # 랜딩페이지 컴포넌트
├── lib/
│   ├── db/
│   │   ├── schema.ts           # Drizzle 스키마
│   │   └── index.ts            # DB 연결
│   ├── auth.ts                 # NextAuth 설정
│   └── permissions.ts          # 권한 헬퍼 함수
├── actions/                    # Server Actions
└── drizzle/                    # 마이그레이션 파일
```

### 주요 패키지

```json
{
  "next": "^15",
  "react": "^19",
  "typescript": "^5",
  "tailwindcss": "^4",
  "drizzle-orm": "latest",
  "drizzle-kit": "latest",
  "@neondatabase/serverless": "latest",
  "next-auth": "^5",
  "bcryptjs": "latest",
  "xlsx": "latest",
  "recharts": "latest",
  "react-hook-form": "latest",
  "zod": "latest",
  "@vercel/blob": "latest"
}
```

---

## 미결정 사항

| 상태 | 항목 | 결정 내용 | 영향 단계 |
|:----:|------|----------|----------|
| ✅ | 헌금 4가지 종류 정확한 명칭 | 십일조, 주일헌금, 감사헌금, 선교헌금 | 1단계 스키마 |
| ✅ | 성경공부 모임 귀속 모듈 | 목장 모듈에 귀속, `bible_study_groups.cell_group_id` 추가 | 4단계 |
| 🔲 | 목자가 헌금 참여 여부만 볼 수 있는지 (금액 제외) | 미결정 — 개발 전 확인 필요 | 2단계 권한 |
| 🔲 | 목자 모바일 출석 체크인 UI 우선순위 | 미결정 | 4단계 |
| 🔲 | 사진 업로드 필수 여부 | 미결정 | 3단계 |
| 🔲 | 엑셀 다운로드(내보내기) 우선순위 | 미결정 | 6단계 |
