# 🔐 Firebase Console 관리자 가이드

## 📋 개요
NBTI 길드 웹사이트의 관리자 기능을 Firebase Console에서 직접 관리하는 방법을 안내합니다.

## 🚀 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **nbti-37b3f** 프로젝트 선택
3. **Firestore Database** 메뉴 클릭

## 🔄 새로운 플로우

### 사용자 플로우
1. **Google 로그인** → 마이페이지로 자동 이동
2. **마이페이지에서 프로필 작성** → 저장 (미승인 상태로 저장됨)
3. **"관리자 확인 중입니다"** 메시지 표시
4. **관리자가 Firebase Console에서 승인** → `status: "approved"`로 변경
5. **승인 후 웹사이트에 표시** → index.html과 members.html에서 확인 가능

### 관리자 플로우
1. **Firebase Console 접속** → Firestore Database
2. **members 컬렉션 확인** → 미승인 멤버(`status: "pending"`) 확인
3. **멤버 정보 검토** → 프로필 내용 확인
4. **승인/거부 결정** → `status` 필드 변경
5. **실시간 반영** → 웹사이트에서 즉시 확인 가능

## 📊 데이터베이스 구조

### 1. `users` 컬렉션 (관리자 권한)
```
users/
  └── bil2umm@gmail.com
      ├── email: "bil2umm@gmail.com"
      ├── role: "admin"
      ├── permissions: ["approve_members", "manage_guild"]
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

### 2. `members` 컬렉션 (길드원 정보)
```
members/
  └── {userId} (Firebase Auth UID)
      ├── name: "사용자명"
      ├── email: "user@example.com"
      ├── role: "길드원"
      ├── status: "pending" | "approved" | "rejected"
      ├── avatar: "아"
      ├── tags: ["길드원", "게임"]
      ├── profile: {
      │   ├── bio: "자기소개"
      │   └── interests: ["게임", "친목"]
      │   }
      ├── cover: "https://..."
      ├── createdAt: timestamp
      ├── updatedAt: timestamp
      ├── approvedAt: timestamp (승인 시)
      └── rejectedAt: timestamp (거부 시)
```

### 3. `photos` 컬렉션 (사진첩)
```
photos/
  └── {photoId}
      ├── url: "https://..."
      ├── title: "사진 제목"
      ├── subtitle: "부제목"
      ├── author: "작성자"
      ├── tags: ["태그1", "태그2"]
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## 🔧 관리자 작업 가이드

### 1. 새 관리자 추가
1. **Firestore Database** → **users** 컬렉션
2. **문서 추가** 클릭
3. **문서 ID**: 관리자 이메일 주소 입력
4. **필드 추가**:
   ```
   email: "newadmin@example.com"
   role: "admin"
   permissions: ["approve_members", "manage_guild"]
   createdAt: (현재 시간)
   updatedAt: (현재 시간)
   ```

### 2. 멤버 승인/거부 (중요!)
1. **Firestore Database** → **members** 컬렉션
2. 승인할 멤버 문서 클릭
3. **편집** 버튼 클릭
4. **status** 필드 수정:
   - 승인: `"approved"` ← **이 상태여야만 웹사이트에 표시됨**
   - 거부: `"rejected"`
   - 대기: `"pending"` (기본값)
5. **approvedAt** 또는 **rejectedAt** 필드 추가 (현재 시간)
6. **저장** 클릭

### 3. 멤버 정보 수정
1. **members** 컬렉션에서 수정할 멤버 선택
2. **편집** 버튼 클릭
3. 수정할 필드 변경:
   - `name`: 닉네임
   - `role`: 직책
   - `tags`: 태그 배열
   - `profile.bio`: 자기소개
   - `profile.interests`: 관심사 배열
   - `cover`: 커버 이미지 URL
4. **저장** 클릭

### 4. 멤버 삭제
1. **members** 컬렉션에서 삭제할 멤버 선택
2. **삭제** 버튼 클릭
3. 확인 대화상자에서 **삭제** 클릭

## 📈 필요한 Firestore 색인

### 1. members 컬렉션 색인
```
컬렉션: members
필드: status (오름차순), createdAt (내림차순)
```

```
컬렉션: members  
필드: status (오름차순), updatedAt (내림차순)
```

### 2. photos 컬렉션 색인
```
컬렉션: photos
필드: createdAt (내림차순)
```

## 🛠️ 색인 생성 방법

### 자동 색인 생성
1. Firebase Console에서 쿼리 실행 시 색인이 필요하면 자동으로 제안됨
2. **색인 생성** 버튼 클릭
3. 색인 생성 완료까지 대기 (보통 1-2분)

### 수동 색인 생성
1. **Firestore Database** → **색인** 탭
2. **복합 색인** → **색인 추가** 클릭
3. 컬렉션 ID와 필드 정보 입력
4. **생성** 클릭

## 🔍 유용한 쿼리

### 1. 미승인 멤버 조회
```
컬렉션: members
필터: status == "pending"
정렬: createdAt (내림차순)
```

### 2. 승인된 멤버 조회
```
컬렉션: members
필터: status == "approved"
정렬: createdAt (내림차순)
```

### 3. 최근 가입한 멤버 조회
```
컬렉션: members
정렬: createdAt (내림차순)
제한: 10
```

## ⚠️ 주의사항

### 1. 보안
- `users` 컬렉션은 Firebase Console에서만 관리
- 웹 애플리케이션에서는 `users` 컬렉션에 접근 불가
- 관리자 권한은 이메일 기반으로 관리

### 2. 데이터 무결성
- `status` 필드는 반드시 `"pending"`, `"approved"`, `"rejected"` 중 하나
- `approvedAt`과 `rejectedAt`은 상호 배타적
- `createdAt`과 `updatedAt`은 항상 유지

### 3. 성능
- 대량의 멤버가 있을 경우 색인 사용 필수
- 복합 쿼리 시 적절한 색인 설정 필요

## 🆘 문제 해결

### 1. 색인 오류
- 쿼리 실행 시 색인 오류 발생 시 자동 제안된 색인 생성
- 복잡한 쿼리는 단순화 고려

### 2. 권한 오류
- Firestore 보안 규칙 확인
- 관리자 이메일이 `users` 컬렉션에 등록되어 있는지 확인

### 3. 데이터 동기화
- 웹 애플리케이션에서 변경사항이 즉시 반영되지 않을 경우
- 브라우저 새로고침 또는 캐시 클리어

## 📞 지원
- Firebase Console: [console.firebase.google.com](https://console.firebase.google.com/)
- Firebase 문서: [firebase.google.com/docs](https://firebase.google.com/docs)
- 프로젝트: **nbti-37b3f**
