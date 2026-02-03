# Cloudflare Pages + D1 배포 가이드

## 1. Cloudflare D1 데이터베이스 생성

```bash
# D1 데이터베이스 생성
wrangler d1 create sebongclinic-db

# 출력된 database_id를 복사하여 wrangler.toml의 database_id에 입력
```

## 2. 데이터베이스 스키마 적용

```bash
# 로컬 개발용
wrangler d1 execute sebongclinic-db --local --file=./db/schema.sql

# 프로덕션용
wrangler d1 execute sebongclinic-db --file=./db/schema.sql
```

## 3. 환경 변수 설정 (선택사항)

Cloudflare Pages 대시보드에서 환경 변수 추가:
- `ADMIN_PASSWORD`: Admin 페이지 비밀번호 (기본값: sebong2025)

## 4. Cloudflare Pages 프로젝트 설정

### 빌드 설정
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/`

### D1 바인딩 추가
Settings > Functions > D1 database bindings에서:
- **Variable name**: `DB`
- **D1 database**: `sebongclinic-db` 선택

## 5. 로컬 개발

```bash
# 개발 서버 실행
npm run dev

# Cloudflare Pages 로컬 프리뷰 (D1 바인딩 포함)
npm run pages:build
npm run preview
```

## 6. 배포

### GitHub 연동 (권장)
1. GitHub에 push하면 자동 배포됩니다
2. Cloudflare Pages 대시보드에서 배포 상태 확인

### 수동 배포
```bash
npm run pages:build
npm run deploy
```

## Admin 페이지 접속

- **URL**: `https://yourdomain.com/admin-8f3a9c2d4b1e`
- **비밀번호**: `sebong2025` (또는 설정한 ADMIN_PASSWORD)

⚠️ **보안 주의사항**:
- Admin URL은 외부에 공유하지 마세요
- 비밀번호를 정기적으로 변경하세요
- 프로덕션에서는 반드시 환경 변수로 비밀번호를 설정하세요

## 문제 해결

### D1 바인딩 오류
- Cloudflare Pages 설정에서 D1 바인딩이 올바르게 설정되어 있는지 확인
- Variable name이 정확히 `DB`인지 확인

### 빌드 실패
- Node.js 버전 확인 (20.9.0 이상 필요)
- `npm install` 재실행
- `npm run build` 로컬에서 먼저 테스트

### API 호출 실패
- 브라우저 콘솔에서 에러 메시지 확인
- Cloudflare Pages Functions 로그 확인
