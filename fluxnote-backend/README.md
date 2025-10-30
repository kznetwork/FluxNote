# FluxNote Backend

FluxNote 애플리케이션의 백엔드 서버입니다.

## 🚀 시작하기

### 1. 필수 요구사항

- Node.js (v14 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

### 2. PostgreSQL 데이터베이스 생성

PostgreSQL에서 데이터베이스를 생성합니다:

```bash
psql -U postgres
CREATE DATABASE fluxnote_db;
\q
```

### 3. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가합니다:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
```

> 💡 `env-setup.txt` 파일을 참고하세요.

### 4. 패키지 설치

```bash
npm install
```

### 5. 서버 실행

개발 모드 (nodemon):
```bash
npm run dev
```

프로덕션 모드:
```bash
npm start
```

서버가 성공적으로 시작되면:
```
PostgreSQL 데이터베이스에 연결되었습니다.
데이터베이스 테이블이 성공적으로 생성되었습니다.
서버가 포트 5000에서 실행 중입니다.
```

## 📚 API 엔드포인트

### 인증 (Authentication)

#### 회원가입
```
POST /api/auth/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "사용자명",
  "password": "비밀번호"
}
```

#### 로그인
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "비밀번호"
}
```

#### 로그아웃
```
POST /api/auth/logout
Authorization: Bearer {token}
```

#### 현재 사용자 정보
```
GET /api/auth/me
Authorization: Bearer {token}
```

## 🗄️ 데이터베이스 스키마

### users 테이블
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- username (VARCHAR)
- password (VARCHAR, hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### notes 테이블
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER, FK to users)
- title (VARCHAR)
- content (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

## 🛠️ 기술 스택

- Express.js - 웹 프레임워크
- PostgreSQL - 데이터베이스
- JWT - 인증
- bcryptjs - 비밀번호 해싱
- express-validator - 입력 유효성 검사

## 📝 스크립트

- `npm start` - 서버 시작
- `npm run dev` - 개발 모드 (nodemon)
- `npm test` - 테스트 실행 (미구현)

## 🔒 보안

- 비밀번호는 bcryptjs로 해싱되어 저장
- JWT 토큰 유효기간: 7일
- CORS 활성화
- 환경 변수로 민감한 정보 관리

## 📖 문서

자세한 구현 내용은 `Report/PostgreSQL-인증-구현-보고서.md`를 참고하세요.
