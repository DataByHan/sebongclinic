# Cloudflare Workers(OpenNext) + D1 배포 가이드

## 1. Cloudflare D1 데이터베이스 생성

```bash
# D1 데이터베이스 생성
wrangler d1 create sebongclinic-db

# 출력된 database_id를 복사하여 `wrangler.jsonc`의 `d1_databases[].database_id`에 입력
```

## 2. 데이터베이스 스키마 적용

```bash
# 로컬 개발용
wrangler d1 execute sebongclinic-db --local --file=./db/schema.sql

# 프로덕션용
wrangler d1 execute sebongclinic-db --file=./db/schema.sql
```

## 3. Cloudflare R2 버킷 생성 (이미지 업로드용)

### R2 버킷 생성
1. Cloudflare Dashboard > **R2** 메뉴 클릭
2. **Create bucket** 버튼 클릭
3. Bucket name: `sebongclinic-images` 입력
4. Location: **Automatic** 선택
5. **Create bucket** 클릭

### Public Access 설정
1. 생성한 `sebongclinic-images` 버킷 클릭
2. **Settings** 탭
3. **Public access** 섹션에서 **Allow Access** 클릭
4. **R2.dev subdomain** 활성화 또는 Custom domain 연결

### wrangler.jsonc 확인
`wrangler.jsonc` 파일에 R2 바인딩이 있는지 확인:
```jsonc
{
  "r2_buckets": [
    {
      "binding": "IMAGES",
      "bucket_name": "sebongclinic-images"
    }
  ]
}
```

## 4. 비밀값(Secrets) 설정

Wrangler로 Workers Secret을 설정합니다:
```bash
wrangler secret put ADMIN_PASSWORD
```

이미지는 `/api/images/*` 경로로 서빙되므로, 별도의 R2 공개 도메인 설정은 필수는 아닙니다.

## 5. Cloudflare Workers 배포 설정

### Wrangler 설정
- `wrangler.jsonc`의 `main`은 `.open-next/worker.js` 입니다.
- 이 파일은 **배포 시점에 생성되는 산출물**이라 Git에 커밋하지 않습니다 (`.gitignore`에 `.open-next` 포함).
- 배포 전에 반드시 OpenNext 빌드를 수행해야 합니다:
  - `npm run deploy` (권장) = `opennextjs-cloudflare build` + `wrangler deploy`

### 바인딩
`wrangler.jsonc`에서 확인/수정:
- D1: `DB`
- R2: `IMAGES`

## 6. 로컬 개발

```bash
# 개발 서버 실행
npm run dev

# Cloudflare Workers 로컬 프리뷰 (D1 + R2 바인딩 포함)
npm run preview
```

## 7. 배포

### 수동 배포 (권장)
```bash
# Cloudflare API Token 필요 (wrangler)
# export CLOUDFLARE_API_TOKEN="..."

npm run deploy
```

## Admin 페이지 접속

- **URL**: `https://yourdomain.com/admin-8f3a9c2d4b1e`
- **비밀번호**: Cloudflare Workers Secret `ADMIN_PASSWORD`로 설정한 값

⚠️ **보안 주의사항**:
- Admin URL은 외부에 공유하지 마세요
- 비밀번호를 정기적으로 변경하세요
- 프로덕션에서는 반드시 **Secret**으로 비밀번호를 설정하세요:
  - `wrangler secret put ADMIN_PASSWORD`

## 문제 해결

### D1 바인딩 오류
- `wrangler.jsonc`에서 D1 바인딩이 올바르게 설정되어 있는지 확인
- Variable name이 정확히 `DB`인지 확인

### 빌드 실패
- Node.js 버전 확인 (20.9.0 이상 필요)
- `npm install` 재실행
- `npm run build` 로컬에서 먼저 테스트

### API 호출 실패
- 브라우저 콘솔에서 에러 메시지 확인
- Cloudflare Workers 로그 확인 (`wrangler tail`)

### R2 바인딩 오류
- `wrangler.jsonc`에서 R2 바인딩이 올바르게 설정되어 있는지 확인
- Variable name이 정확히 `IMAGES`인지 확인
- R2 버킷 이름이 `sebongclinic-images`인지 확인

### 이미지 업로드 실패
- R2 버킷의 Public Access가 활성화되어 있는지 확인
- 파일 크기 제한: 5MB 이하
- 지원 형식: JPEG, PNG, GIF, WebP
- Admin 비밀번호가 올바른지 확인

## 이미지 업로드 기능

Admin 페이지(`/admin-8f3a9c2d4b1e`)에서 공지 작성 시:
1. **📷 이미지 추가** 버튼 클릭
2. 이미지 파일 선택 (최대 5MB, JPEG/PNG/GIF/WebP)
3. 자동으로 R2에 업로드되고 에디터에 삽입됨
4. 업로드된 이미지는 공지 페이지에서 자동으로 표시됨
