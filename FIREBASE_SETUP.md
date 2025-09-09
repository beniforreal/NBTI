# Firebase 설정 가이드

## 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **프로젝트 추가** 클릭
3. 프로젝트 이름: `NBTI-길드` (또는 원하는 이름)
4. Google Analytics 활성화 (선택사항)
5. **프로젝트 만들기** 클릭

## 2. Firebase 서비스 활성화

### 2.1 Authentication 설정
1. 왼쪽 메뉴에서 **Authentication** 클릭
2. **시작하기** 클릭
3. **Sign-in method** 탭 클릭
4. **이메일/비밀번호** 활성화
5. **저장** 클릭

### 2.2 Firestore Database 설정
1. 왼쪽 메뉴에서 **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **테스트 모드에서 시작** 선택 (나중에 보안 규칙 설정)
4. 위치: `asia-northeast3` (서울) 선택
5. **완료** 클릭

### 2.3 Storage 설정
1. 왼쪽 메뉴에서 **Storage** 클릭
2. **시작하기** 클릭
3. **테스트 모드에서 시작** 선택
4. 위치: `asia-northeast3` (서울) 선택
5. **완료** 클릭

## 3. 웹 앱 등록

1. 프로젝트 개요에서 **웹** 아이콘 클릭
2. 앱 닉네임: `NBTI-길드-웹`
3. **Firebase Hosting도 설정** 체크
4. **앱 등록** 클릭
5. **설정** 객체 복사

## 4. 설정 파일 업데이트

`js/firebase-config.js` 파일이 이미 실제 Firebase 설정으로 업데이트되었습니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBrMBRBEuYv1ws1Kvwoc__XhAciksdDnys",
  authDomain: "nbti-37b3f.firebaseapp.com",
  projectId: "nbti-37b3f",
  storageBucket: "nbti-37b3f.firebasestorage.app",
  messagingSenderId: "91397959616",
  appId: "1:91397959616:web:a1e33b9d2cfbb6a758a225",
  measurementId: "G-B07ZSG3910"
};
```

✅ **설정 완료!** 이제 Firebase 서비스들을 활성화하면 됩니다.

## 5. Firebase 서비스 활성화

### 5.1 Authentication 활성화
1. [Firebase Console](https://console.firebase.google.com/project/nbti-37b3f) 접속
2. 왼쪽 메뉴에서 **Authentication** 클릭
3. **시작하기** 클릭
4. **Sign-in method** 탭 클릭
5. **이메일/비밀번호** 클릭
6. **사용 설정** 토글 활성화
7. **저장** 클릭

### 5.2 Firestore Database 활성화
1. 왼쪽 메뉴에서 **Firestore Database** 클릭
2. **데이터베이스 만들기** 클릭
3. **테스트 모드에서 시작** 선택
4. 위치: `asia-northeast3` (서울) 선택
5. **완료** 클릭

### 5.3 Storage 활성화
1. 왼쪽 메뉴에서 **Storage** 클릭
2. **시작하기** 클릭
3. **테스트 모드에서 시작** 선택
4. 위치: `asia-northeast3` (서울) 선택
5. **완료** 클릭

## 6. Firestore 보안 규칙 설정

Firestore Database > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 멤버 컬렉션
    match /members/{memberId} {
      allow read: if true; // 모든 사용자가 읽기 가능
      allow write: if request.auth != null && 
        (request.auth.uid == memberId || 
         get(/databases/$(database)/documents/members/$(request.auth.uid)).data.role in ['길드마스터', '관리자']);
    }
    
    // 사진 컬렉션
    match /photos/{photoId} {
      allow read: if true; // 모든 사용자가 읽기 가능
      allow write: if request.auth != null; // 로그인한 사용자만 쓰기 가능
    }
  }
}
```

## 6. Storage 보안 규칙 설정

Storage > 규칙 탭에서 다음 규칙 설정:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true; // 모든 사용자가 읽기 가능
      allow write: if request.auth != null; // 로그인한 사용자만 쓰기 가능
    }
  }
}
```

## 7. Firebase Hosting 배포

### 7.1 Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 7.2 로그인 및 초기화
```bash
firebase login
firebase init hosting
```

### 7.3 배포
```bash
firebase deploy
```

## 8. 초기 데이터 설정

### 8.1 관리자 계정 생성
1. 웹사이트에서 **mypage.html** 접속
2. **회원가입** 버튼 클릭 (아직 구현되지 않음 - 임시로 Firebase Console에서 생성)
3. 또는 Firebase Console > Authentication > 사용자 > 사용자 추가

### 8.2 초기 멤버 데이터 추가
Firestore에 초기 멤버 데이터 추가:

1. Firestore Database > 데이터 탭
2. **컬렉션 시작** 클릭
3. 컬렉션 ID: `members`
4. 첫 번째 문서 ID: `member-001`
5. 필드 추가:
   - `name`: 작은음표
   - `role`: 길드마스터
   - `email`: admin@nbti.com
   - `avatar`: 작
   - `tags`: ["길드마스터", "리더", "던전"]
   - `createdAt`: 현재 시간
   - `updatedAt`: 현재 시간

### 8.3 테스트 계정 생성
Firebase Console > Authentication에서 다음 테스트 계정들 생성:
- `smallnote@nbti.com` / `guildmaster123`
- `ashy@nbti.com` / `ashy123`
- `dol@nbti.com` / `dol123`
- `doro@nbti.com` / `doro123`
- `sihu@nbti.com` / `sihu123`

## 9. 테스트

1. 웹사이트 접속
2. 관리자 계정으로 로그인
3. 마이페이지에서 프로필 수정
4. Firestore에서 데이터 변경 확인

## 주의사항

- **보안 규칙**: 프로덕션 환경에서는 더 엄격한 보안 규칙 설정 필요
- **비용**: Firebase는 사용량에 따라 과금되므로 모니터링 필요
- **백업**: 중요한 데이터는 정기적으로 백업 권장

## 문제 해결

### 인증 오류
- Firebase 설정이 올바른지 확인
- 도메인이 Firebase 프로젝트에 등록되어 있는지 확인

### 데이터 로드 실패
- Firestore 보안 규칙 확인
- 네트워크 연결 상태 확인

### 이미지 업로드 실패
- Storage 보안 규칙 확인
- 파일 크기 제한 확인 (기본 32MB)
