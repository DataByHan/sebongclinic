#!/bin/bash

# Cloudflare Pages 배포 스크립트
# 사용법: ./deploy.sh

set -e

echo "🚀 세봉한의원 웹사이트 배포 시작..."
echo ""

# 1. 빌드
echo "📦 Step 1/3: 프로젝트 빌드 중..."
npm run build
echo "✅ 빌드 완료!"
echo ""

# 2. Wrangler 인증 확인
echo "🔐 Step 2/3: Cloudflare 인증 확인 중..."
if ! npx wrangler whoami &>/dev/null; then
    echo "⚠️  Cloudflare에 로그인이 필요합니다."
    echo "브라우저가 열리면 Cloudflare 계정으로 로그인해주세요."
    echo ""
    npx wrangler login
else
    echo "✅ 이미 로그인되어 있습니다."
fi
echo ""

# 3. 배포
echo "🌐 Step 3/3: Cloudflare Pages에 배포 중..."
npx wrangler pages deploy out --project-name=sebongclinic

echo ""
echo "✨ 배포 완료!"
echo ""
echo "📝 다음 단계:"
echo "1. 위에 표시된 URL로 접속하여 웹사이트 확인"
echo "2. Cloudflare Dashboard에서 커스텀 도메인 연결 (선택사항)"
echo "   https://dash.cloudflare.com"
echo ""
