# Cloudflare Pages 배포 가이드

세봉한의원 웹사이트를 Cloudflare Pages에 배포하는 방법입니다.

## 배포 방법 선택

### 방법 1: Cloudflare Dashboard (추천 - 가장 쉬움)

#### 1단계: Cloudflare 계정 준비
- https://dash.cloudflare.com 접속 및 로그인
- 계정이 없다면 무료로 생성

#### 2단계: Pages 프로젝트 생성
1. 좌측 메뉴에서 **Workers & Pages** 클릭
2. **Create application** 버튼 클릭
3. **Pages** 탭 선택
4. **Connect to Git** 클릭

#### 3단계: GitHub 저장소 연결
1. **GitHub** 선택
2. GitHub 계정 연결 및 권한 승인
3. **DataByHan/sebongclinic** 저장소 선택
4. **Begin setup** 클릭

#### 4단계: 빌드 설정
다음과 같이 입력:

```
Project name: sebongclinic
Production branch: master

Build settings:
  Framework preset: Next.js (Static HTML Export)
  Build command: npm run build
  Build output directory: out
  
Environment variables: (없음)
```

#### 5단계: 배포 시작
1. **Save and Deploy** 클릭
2. 빌드 진행 상황 확인 (약 2-3분 소요)
3. 배포 완료 후 제공되는 URL 확인 (예: `https://sebongclinic.pages.dev`)

#### 6단계: 자동 배포 설정 확인
- GitHub의 `master` 브랜치에 새로운 커밋이 푸시되면 자동으로 재배포됩니다
- 배포 히스토리는 Cloudflare Dashboard에서 확인 가능

---

### 방법 2: Wrangler CLI (명령줄 선호시)

#### 1단계: Cloudflare 로그인
```bash
cd /home/han/project/sebongclinic
npx wrangler login
```
브라우저가 열리면 Cloudflare 계정으로 로그인

#### 2단계: 빌드
```bash
npm run build
```

#### 3단계: 배포
```bash
npx wrangler pages deploy out --project-name=sebongclinic
```

#### 4단계: 배포 확인
명령어 완료 후 제공되는 URL로 접속하여 확인

---

## 커스텀 도메인 연결 (선택사항)

자신의 도메인(예: sebongclinic.com)을 연결하려면:

1. Cloudflare Dashboard → **Workers & Pages** → **sebongclinic** 선택
2. **Custom domains** 탭 클릭
3. **Set up a custom domain** 클릭
4. 도메인 입력 및 DNS 설정 안내에 따라 진행

---

## 배포 확인사항

배포 후 다음 사항을 확인하세요:

- ✅ 메인 페이지 (`/`) 정상 로드
- ✅ 진료 안내 페이지 (`/treatment`) 정상 로드
- ✅ 의료진 소개 페이지 (`/doctors`) 정상 로드
- ✅ 오시는 길 페이지 (`/location`) 정상 로드
- ✅ 공지사항 목록 (`/notices`) 정상 로드
- ✅ 공지사항 상세 (`/notices/1`, `/notices/2`, etc.) 정상 로드
- ✅ 모바일 반응형 디자인 확인
- ✅ 전화번호 링크 클릭 가능 (`tel:051-623-7227`)

---

## 문제 해결

### 빌드 실패시
```bash
# 로컬에서 빌드 테스트
npm run build

# node_modules 재설치
rm -rf node_modules package-lock.json
npm install
npm run build
```

### 페이지가 404 에러를 표시할 때
- Build output directory가 `out`으로 설정되었는지 확인
- Framework preset이 "Next.js (Static HTML Export)"로 설정되었는지 확인

### 이미지가 표시되지 않을 때
- `next.config.js`에 `images.unoptimized: true` 설정이 있는지 확인

---

## 배포 상태 모니터링

- **Dashboard**: https://dash.cloudflare.com
- **Deployment 로그**: Workers & Pages → sebongclinic → Deployments
- **Analytics**: Workers & Pages → sebongclinic → Analytics

---

## 추가 정보

- 📖 [Cloudflare Pages 공식 문서](https://developers.cloudflare.com/pages/)
- 📖 [Next.js Static Export 문서](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- 💬 문의사항: Cloudflare Community Forum 또는 GitHub Issues
