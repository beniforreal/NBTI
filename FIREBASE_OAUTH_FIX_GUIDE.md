# Firebase OAuth 403 오류 해결 가이드

## 🚨 현재 발생한 오류
- **오류 코드**: `403 오류: disallowed_useragent`
- **원인**: Google의 "보안 브라우저 사용" 정책 위반
- **프로젝트 ID**: `nbti-37b3f`

## 🔧 해결 방법

### 1. Firebase Console에서 OAuth 설정 확인

**Firebase Console 접속:**
1. https://console.firebase.google.com/ 접속
2. `nbti-37b3f` 프로젝트 선택
3. **Authentication** → **Sign-in method** 이동

### 2. Google 로그인 설정 수정

**Google 로그인 활성화:**
1. **Google** 로그인 방법 클릭
2. **Enable** 토글 활성화
3. **Project support email** 설정 (필수)

**OAuth 리디렉션 URI 설정:**
```
https://nbti-37b3f.firebaseapp.com/__/auth/handler
https://nbti-37b3f.web.app/__/auth/handler
```

### 3. Google Cloud Console에서 도메인 승인

**Google Cloud Console 접속:**
1. https://console.cloud.google.com/ 접속
2. `nbti-37b3f` 프로젝트 선택
3. **APIs & Services** → **Credentials** 이동

**OAuth 2.0 클라이언트 ID 설정:**
1. **Web client** 클릭
2. **Authorized JavaScript origins**에 다음 추가:
   ```
   https://nbti-37b3f.web.app
   https://nbti-37b3f.firebaseapp.com
   ```
3. **Authorized redirect URIs**에 다음 추가:
   ```
   https://nbti-37b3f.firebaseapp.com/__/auth/handler
   https://nbti-37b3f.web.app/__/auth/handler
   ```

### 4. OAuth 동의 화면 설정

**OAuth 동의 화면:**
1. **APIs & Services** → **OAuth consent screen** 이동
2. **User Type**: External 선택
3. **App information**:
   - App name: `NBTI 길드`
   - User support email: 본인 이메일
   - App logo: 선택사항
4. **Authorized domains**에 추가:
   ```
   nbti-37b3f.web.app
   nbti-37b3f.firebaseapp.com
   ```

### 5. 테스트 사용자 추가 (개발 단계)

**테스트 사용자:**
1. **OAuth consent screen** → **Test users** 탭
2. **Add users** 클릭
3. 테스트할 이메일 주소 추가

## 🔍 추가 확인사항

### Firebase Hosting 도메인 확인
현재 배포된 도메인: `https://nbti-37b3f.web.app`

### 브라우저 호환성
- Chrome, Firefox, Safari 최신 버전 사용 권장
- 모바일 브라우저에서도 테스트 필요

### 보안 정책 준수
- HTTPS 연결 필수
- 유효한 SSL 인증서 필요
- 도메인 승인 완료 필요

## 🚀 설정 완료 후 테스트

1. **브라우저 캐시 클리어**
2. **시크릿/프라이빗 모드에서 테스트**
3. **다른 브라우저에서 테스트**
4. **모바일 브라우저에서 테스트**

## 📞 문제 지속 시

만약 위 설정을 모두 완료했음에도 문제가 지속된다면:

1. **Google Cloud Console**에서 **APIs & Services** → **Library**
2. **Google+ API** 활성화 확인
3. **Firebase Authentication API** 활성화 확인
4. **프로젝트 결제 계정** 설정 확인 (무료 할당량 초과 시)

## ⚠️ 중요 참고사항

- OAuth 설정 변경 후 **최대 24시간** 소요될 수 있음
- **프로덕션 환경**에서는 OAuth 동의 화면 검토 필요
- **도메인 변경** 시 모든 설정 재검토 필요
