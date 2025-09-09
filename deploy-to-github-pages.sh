#!/bin/bash

# GitHub Pages용 배포 스크립트
echo "🚀 GitHub Pages 배포 시작..."

# public 폴더 내용을 루트로 복사
echo "📁 public 폴더 내용을 루트로 복사 중..."
cp -r public/* ./

# .gitignore 파일 수정 (public 폴더 제외)
echo "📝 .gitignore 수정 중..."
cat > .gitignore << 'EOF'
# Firebase
.firebase/
firebase-debug.log
firebase-debug.*.log

# Node modules
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# next.js build output
.next

# Nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# macOS
.DS_Store

# Windows
Thumbs.db
ehthumbs.db
Desktop.ini

# Linux
*~

# Temporary files
*.tmp
*.temp

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build outputs
dist/
build/
EOF

# Git 설정
echo "🔧 Git 설정 중..."
git add .
git commit -m "Deploy: GitHub Pages 배포용 파일 정리"
git push origin main

echo "✅ GitHub Pages 배포 완료!"
echo "🌐 접속 URL: https://beniforreal.github.io/NBTI/"
