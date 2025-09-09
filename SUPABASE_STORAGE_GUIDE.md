# 🗄️ Supabase Storage 설정 가이드

## 📋 개요
NBTI 길드 웹사이트의 이미지 저장소를 Firebase Storage에서 Supabase Storage로 마이그레이션했습니다.

## 🚀 Supabase Console 설정

### 1. Supabase 프로젝트 접속
1. [Supabase Console](https://supabase.com/dashboard) 접속
2. **zrbcxremffbsjifjsfsm** 프로젝트 선택
3. **Storage** 메뉴 클릭

### 2. NBTI 버킷 생성
1. **New bucket** 버튼 클릭
2. 버킷 이름: `NBTI`
3. **Public bucket** 체크 (공개 접근 허용)
4. **Create bucket** 클릭

### 3. 폴더 구조 생성
NBTI 버킷 내에 다음 폴더 구조를 생성하세요:

```
NBTI/
├── img/
│   ├── profile/     (프로필 커버 이미지)
│   └── posting/     (포스팅 이미지)
```

**폴더 생성 방법:**
1. NBTI 버킷 선택
2. **New folder** 버튼 클릭
3. 폴더명 입력: `img`
4. img 폴더 내에 `profile`, `posting` 폴더 생성

## 🔐 Storage 정책 설정

### 1. SQL Editor에서 정책 설정
1. Supabase Console → **SQL Editor** 메뉴
2. `supabase-storage-policy.sql` 파일의 내용을 복사하여 실행

### 2. 정책 내용
- **읽기 권한**: 모든 사용자 (공개 접근)
- **쓰기 권한**: 인증된 사용자만
- **폴더별 권한**: `img/profile`, `img/posting` 각각 설정

## 📁 파일 업로드 경로

### 프로필 커버 이미지
- **경로**: `img/profile/`
- **사용 페이지**: mypage.html
- **파일명 형식**: `{timestamp}_{random}.{extension}`

### 포스팅 이미지
- **경로**: `img/posting/`
- **사용 페이지**: picture.html
- **파일명 형식**: `{timestamp}_{random}.webp` (WebP 변환됨)

## 🔧 기술적 구현

### 1. Supabase 클라이언트 설정
```javascript
// supabase-config.js
const supabase = createClient(
  'https://zrbcxremffbsjifjsfsm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
);
```

### 2. 이미지 업로드 함수
```javascript
// 이미지 업로드
const result = await window.supabaseStorage.uploadImage(file, 'img/profile');

// 이미지 삭제
const result = await window.supabaseStorage.deleteImage('img/profile/filename.jpg');
```

### 3. 공개 URL 생성
```javascript
// 공개 URL 가져오기
const publicUrl = window.supabaseStorage.getPublicUrl('img/profile/filename.jpg');
```

## 📊 마이그레이션 체크리스트

### ✅ 완료된 작업
- [x] Supabase Storage 클라이언트 설정
- [x] 이미지 업로드/삭제 함수 구현
- [x] HTML 파일에 Supabase 스크립트 추가
- [x] 업로드 경로를 Supabase 구조로 변경
- [x] Storage 정책 SQL 파일 생성

### 🔄 필요한 작업
- [ ] Supabase Console에서 NBTI 버킷 생성
- [ ] img/profile, img/posting 폴더 생성
- [ ] Storage 정책 적용
- [ ] 기존 Firebase Storage 이미지 마이그레이션 (선택사항)

## 🆘 문제 해결

### 1. 업로드 실패
- Supabase Storage 정책이 올바르게 설정되었는지 확인
- 버킷이 공개(Public)로 설정되었는지 확인
- 파일 크기 제한 확인 (기본 50MB)

### 2. 이미지 표시 안됨
- 공개 URL이 올바르게 생성되었는지 확인
- 브라우저 개발자 도구에서 네트워크 오류 확인
- CORS 설정 확인

### 3. 권한 오류
- Storage 정책이 올바르게 적용되었는지 확인
- 사용자 인증 상태 확인
- RLS(Row Level Security) 설정 확인

## 📞 지원
- Supabase 문서: [supabase.com/docs](https://supabase.com/docs)
- Storage 문서: [supabase.com/docs/guides/storage](https://supabase.com/docs/guides/storage)
- 프로젝트: **zrbcxremffbsjifjsfsm**

## 🔄 롤백 방법
Firebase Storage로 롤백이 필요한 경우:
1. `firebase-data-manager.js`의 `uploadImage`, `deleteImage` 메서드를 원래대로 복원
2. HTML 파일에서 `supabase-config.js` 스크립트 제거
3. Firebase Storage 정책 복원
