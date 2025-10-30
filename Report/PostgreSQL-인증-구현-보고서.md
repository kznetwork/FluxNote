# FluxNote PostgreSQL 인증 구현 보고서

## 📋 개요

본 문서는 FluxNote 프로젝트에 PostgreSQL 데이터베이스를 추가하고 회원가입, 로그인, 로그아웃 기능을 구현한 내용을 정리한 보고서입니다.

---

## 🗄️ 데이터베이스 설정

### 환경 변수 설정

백엔드 프로젝트에 `.env` 파일을 생성하여 다음 내용을 추가해야 합니다:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
```

> ⚠️ **중요**: `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다. 실제 운영 환경에서는 보안을 위해 `JWT_SECRET`을 반드시 변경해야 합니다.

### 데이터베이스 생성

PostgreSQL에서 다음 명령어로 데이터베이스를 생성합니다:

```sql
CREATE DATABASE fluxnote_db;
```

또는 psql 명령어:

```bash
psql -U postgres
CREATE DATABASE fluxnote_db;
\q
```

---

## 🏗️ 프로젝트 구조

```
fluxnote-backend/
├── src/
│   ├── config/
│   │   ├── database.js         # PostgreSQL 연결 설정
│   │   └── initDatabase.js     # 데이터베이스 초기화 및 테이블 생성
│   ├── middleware/
│   │   └── auth.js             # JWT 인증 미들웨어
│   ├── routes/
│   │   └── auth.js             # 인증 관련 API 라우트
│   └── index.js                # 서버 진입점
├── .env                        # 환경 변수 (생성 필요)
└── package.json
```

---

## 📦 설치된 패키지

프로젝트에는 다음 패키지들이 이미 설치되어 있습니다:

- `pg` (^8.11.3): PostgreSQL 클라이언트
- `bcryptjs` (^3.0.2): 비밀번호 해싱
- `jsonwebtoken` (^9.0.2): JWT 토큰 생성 및 검증
- `express-validator` (^7.3.0): 입력 유효성 검사
- `dotenv` (^17.2.3): 환경 변수 관리
- `express` (^5.1.0): 웹 프레임워크
- `cors` (^2.8.5): CORS 처리

---

## 🗃️ 데이터베이스 스키마

### users 테이블

사용자 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

#### 컬럼 설명

| 컬럼명 | 타입 | 설명 |
|--------|------|------|
| id | SERIAL | 사용자 고유 ID (자동 증가) |
| email | VARCHAR(255) | 사용자 이메일 (유니크) |
| username | VARCHAR(100) | 사용자 이름 |
| password | VARCHAR(255) | 해싱된 비밀번호 |
| created_at | TIMESTAMP | 계정 생성 시간 |
| updated_at | TIMESTAMP | 계정 수정 시간 |

### notes 테이블

노트 정보를 저장하는 테이블입니다 (향후 사용 예정).

```sql
CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notes_user_id ON notes(user_id);
```

---

## 🔐 구현된 기능

### 1. 회원가입 (Sign Up)

#### 엔드포인트
```
POST /api/auth/signup
```

#### 요청 본문
```json
{
  "email": "user@example.com",
  "username": "사용자명",
  "password": "비밀번호"
}
```

#### 응답 (성공)
```json
{
  "message": "회원가입이 완료되었습니다.",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "사용자명"
  }
}
```

#### 유효성 검사
- 이메일: 유효한 이메일 형식
- 사용자명: 최소 3자 이상
- 비밀번호: 최소 6자 이상
- 이메일 중복 확인

#### 보안 기능
- bcryptjs를 사용한 비밀번호 해싱 (salt rounds: 10)
- JWT 토큰 생성 (유효기간: 7일)

---

### 2. 로그인 (Login)

#### 엔드포인트
```
POST /api/auth/login
```

#### 요청 본문
```json
{
  "email": "user@example.com",
  "password": "비밀번호"
}
```

#### 응답 (성공)
```json
{
  "message": "로그인 성공",
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "사용자명"
  }
}
```

#### 유효성 검사
- 이메일: 유효한 이메일 형식
- 비밀번호: 필수 입력

#### 인증 과정
1. 이메일로 사용자 조회
2. bcrypt로 비밀번호 검증
3. JWT 토큰 생성 및 반환

---

### 3. 로그아웃 (Logout)

#### 엔드포인트
```
POST /api/auth/logout
```

#### 헤더
```
Authorization: Bearer JWT_TOKEN
```

#### 응답 (성공)
```json
{
  "message": "로그아웃되었습니다."
}
```

#### 동작 방식
- JWT 인증 미들웨어를 통한 토큰 검증
- 클라이언트에서 토큰 삭제 처리
- 서버는 로그아웃 요청 확인만 수행

---

### 4. 사용자 정보 조회 (Get Current User)

#### 엔드포인트
```
GET /api/auth/me
```

#### 헤더
```
Authorization: Bearer JWT_TOKEN
```

#### 응답 (성공)
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "사용자명",
    "created_at": "2025-10-30T12:00:00.000Z"
  }
}
```

---

## 🔒 인증 미들웨어

JWT 기반 인증 미들웨어가 구현되어 있습니다.

### 기능
- Authorization 헤더에서 Bearer 토큰 추출
- JWT 토큰 검증
- 토큰에서 사용자 ID 및 이메일 추출
- 요청 객체에 `userId`, `userEmail` 추가

### 에러 처리
- 토큰 없음: 401 Unauthorized
- 토큰 만료: 401 Unauthorized (TokenExpiredError)
- 유효하지 않은 토큰: 401 Unauthorized

### 사용 예시
```javascript
router.post('/protected-route', authMiddleware, (req, res) => {
  // req.userId, req.userEmail 사용 가능
});
```

---

## 🖥️ 프론트엔드 통합

### Auth 컴포넌트

기존에 구현된 `Auth.js` 컴포넌트가 백엔드 API와 완벽하게 통합됩니다.

#### 주요 기능
- 로그인/회원가입 토글
- 폼 유효성 검사 (클라이언트 사이드)
- API 호출 및 에러 처리
- 토큰 및 사용자 정보 localStorage 저장
- 로딩 상태 표시

#### API 연동
```javascript
const API_URL = 'http://localhost:5000/api/auth';

// 회원가입
await fetch(`${API_URL}/signup`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, username, password })
});

// 로그인
await fetch(`${API_URL}/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### App.js 통합

로그인 상태 관리 및 로그아웃 기능이 구현되어 있습니다.

#### 로그인 상태 확인
```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  
  if (token && savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);
```

#### 로그아웃
```javascript
const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/auth/logout', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }
};
```

---

## 🚀 실행 방법

### 1. 데이터베이스 준비

PostgreSQL이 설치되어 있고 실행 중이어야 합니다.

```bash
# PostgreSQL 서비스 시작 (Windows)
# 서비스 관리자에서 PostgreSQL 서비스 시작

# 데이터베이스 생성
psql -U postgres
CREATE DATABASE fluxnote_db;
\q
```

### 2. 환경 변수 설정

`fluxnote-backend` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
```

### 3. 백엔드 서버 실행

```bash
cd fluxnote-backend
npm install  # 이미 설치되어 있다면 생략 가능
npm run dev  # 또는 npm start
```

서버가 성공적으로 시작되면 다음 메시지가 표시됩니다:
```
PostgreSQL 데이터베이스에 연결되었습니다.
데이터베이스 테이블이 성공적으로 생성되었습니다.
서버가 포트 5000에서 실행 중입니다.
```

### 4. 프론트엔드 실행

```bash
cd fluxnote-app
npm start
```

브라우저에서 `http://localhost:3000`으로 접속하면 로그인/회원가입 화면이 표시됩니다.

---

## 🧪 테스트 방법

### 1. Postman 또는 cURL로 테스트

#### 회원가입
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "테스트사용자",
    "password": "password123"
  }'
```

#### 로그인
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 사용자 정보 조회
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 로그아웃
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2. 프론트엔드에서 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. "회원가입" 버튼 클릭
3. 이메일, 사용자명, 비밀번호 입력 후 회원가입
4. 자동으로 로그인되어 메인 화면으로 이동
5. 우측 상단에 사용자명과 로그아웃 버튼 확인
6. 로그아웃 후 다시 로그인 테스트

---

## 🛡️ 보안 고려사항

### 1. 비밀번호 보안
- bcryptjs를 사용한 단방향 해싱
- Salt rounds: 10
- 원본 비밀번호는 데이터베이스에 저장되지 않음

### 2. JWT 토큰
- 유효기간: 7일
- 토큰에 민감한 정보 포함 안 함 (userId, email만 포함)
- HTTPS 사용 권장 (프로덕션 환경)

### 3. 입력 유효성 검사
- 클라이언트 사이드 검증 (React)
- 서버 사이드 검증 (express-validator)
- SQL Injection 방지 (Parameterized queries)

### 4. CORS 설정
- 현재는 모든 origin 허용
- 프로덕션 환경에서는 특정 도메인만 허용 권장

### 5. 환경 변수
- 민감한 정보는 .env 파일에 저장
- .env 파일은 .gitignore에 포함되어 Git에 커밋 안 됨
- JWT_SECRET은 강력한 랜덤 문자열 사용 권장

---

## 📊 데이터베이스 연결 풀링

`pg` 패키지의 Pool을 사용하여 효율적인 데이터베이스 연결 관리:

- 연결 재사용으로 성능 향상
- 자동 연결 관리
- 에러 핸들링

---

## 🔄 향후 개선 사항

### 1. 토큰 갱신 (Refresh Token)
- Access Token과 Refresh Token 분리
- Access Token: 짧은 유효기간 (15분)
- Refresh Token: 긴 유효기간 (30일)

### 2. 이메일 인증
- 회원가입 시 이메일 인증 링크 발송
- 이메일 인증 후 계정 활성화

### 3. 비밀번호 재설정
- 이메일로 비밀번호 재설정 링크 발송
- 안전한 비밀번호 재설정 프로세스

### 4. 계정 잠금
- 로그인 실패 횟수 제한
- 일정 시간 후 자동 잠금 해제

### 5. 로그아웃 토큰 블랙리스트
- Redis를 사용한 토큰 블랙리스트 관리
- 로그아웃된 토큰은 더 이상 사용 불가

### 6. 소셜 로그인
- Google, GitHub 등 OAuth 연동
- 간편한 로그인 경험 제공

### 7. 2단계 인증 (2FA)
- TOTP 기반 2단계 인증
- 추가 보안 계층

---

## 🐛 문제 해결

### PostgreSQL 연결 오류

#### 오류: "ECONNREFUSED"
```
해결: PostgreSQL 서비스가 실행 중인지 확인
- Windows: 서비스 관리자에서 PostgreSQL 서비스 확인
- 포트 5432가 열려 있는지 확인
```

#### 오류: "password authentication failed"
```
해결: .env 파일의 DB_USER와 DB_PASSWORD 확인
- PostgreSQL 사용자 이름과 비밀번호가 올바른지 확인
```

#### 오류: "database does not exist"
```
해결: fluxnote_db 데이터베이스 생성
psql -U postgres
CREATE DATABASE fluxnote_db;
```

### CORS 오류

#### 오류: "Access-Control-Allow-Origin"
```
해결: 백엔드에서 CORS 미들웨어 설정 확인
- cors() 미들웨어가 올바르게 설정되어 있는지 확인
- 현재 코드에서는 이미 설정되어 있음
```

### 토큰 오류

#### 오류: "invalid token"
```
해결: 
1. localStorage에서 토큰 삭제 후 다시 로그인
2. JWT_SECRET이 백엔드와 일치하는지 확인
```

---

## 📝 참고 자료

### 사용된 기술 스택
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Frontend**: React

### 주요 패키지 문서
- [pg (node-postgres)](https://node-postgres.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [express-validator](https://express-validator.github.io/docs/)

---

## ✅ 구현 완료 사항

- ✅ PostgreSQL 데이터베이스 연결 설정
- ✅ users 테이블 자동 생성
- ✅ notes 테이블 자동 생성 (향후 사용)
- ✅ 회원가입 API 구현
- ✅ 로그인 API 구현
- ✅ 로그아웃 API 구현
- ✅ 사용자 정보 조회 API 구현
- ✅ JWT 기반 인증 미들웨어
- ✅ 비밀번호 해싱 (bcryptjs)
- ✅ 입력 유효성 검사 (서버/클라이언트)
- ✅ 프론트엔드 Auth 컴포넌트 통합
- ✅ 로그인 상태 관리
- ✅ 에러 처리 및 사용자 피드백

---

## 📧 문의

프로젝트 관련 문의사항이나 버그 리포트는 GitHub Issues를 통해 제출해주세요.

---

**작성일**: 2025년 10월 30일  
**작성자**: FluxNote 개발팀  
**버전**: 1.0.0

