# FluxNote 📝

FluxNote는 React와 Node.js 기반의 현대적인 노트 작성 애플리케이션입니다.

## ✨ 주요 기능

- 🔐 **사용자 인증**: JWT 기반 회원가입, 로그인, 로그아웃
- 📝 **노트 관리**: 노트 생성, 수정, 삭제
- 🔍 **검색 기능**: 제목과 내용으로 노트 검색
- 💾 **데이터 영속성**: PostgreSQL 데이터베이스 사용
- 🎨 **모던 UI**: Bootstrap 기반의 반응형 디자인

## 🏗️ 프로젝트 구조

```
FluxNote/
├── fluxnote-app/          # React 프론트엔드
│   ├── src/
│   │   ├── components/    # React 컴포넌트
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── fluxnote-backend/      # Node.js 백엔드
│   ├── src/
│   │   ├── config/        # 데이터베이스 설정
│   │   ├── middleware/    # 인증 미들웨어
│   │   ├── routes/        # API 라우트
│   │   └── index.js       # 서버 진입점
│   └── package.json
│
└── Report/                # 프로젝트 문서
    ├── PostgreSQL-인증-구현-보고서.md
    └── ...
```

## 🚀 빠른 시작

### 필수 요구사항

- Node.js (v14 이상)
- PostgreSQL (v12 이상)
- npm 또는 yarn

### 1. PostgreSQL 설정

PostgreSQL을 설치하고 데이터베이스를 생성합니다:

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE fluxnote_db;

# 종료
\q
```

### 2. 백엔드 설정

```bash
# 백엔드 폴더로 이동
cd fluxnote-backend

# 패키지 설치
npm install

# .env 파일 생성 (env-setup.txt 참고)
# 다음 내용으로 .env 파일 생성:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=fluxnote_db
# DB_USER=postgres
# DB_PASSWORD=postgresql
# PORT=5000
# JWT_SECRET=fluxnote_jwt_secret_key_change_in_production

# 서버 실행
npm run dev
```

### 3. 프론트엔드 설정

```bash
# 프론트엔드 폴더로 이동
cd fluxnote-app

# 패키지 설치
npm install

# 개발 서버 실행
npm start
```

### 4. 애플리케이션 접속

브라우저에서 `http://localhost:3000`으로 접속합니다.

## 📖 상세 문서

- [PostgreSQL 인증 구현 보고서](Report/PostgreSQL-인증-구현-보고서.md)
- [백엔드 README](fluxnote-backend/README.md)

## 🛠️ 기술 스택

### 프론트엔드
- React
- Bootstrap 5
- Bootstrap Icons

### 백엔드
- Node.js
- Express.js
- PostgreSQL
- JWT (JSON Web Tokens)
- bcryptjs
- express-validator

## 🔒 보안

- 비밀번호는 bcryptjs로 해싱
- JWT 기반 인증 (유효기간 7일)
- SQL Injection 방지 (Parameterized queries)
- CORS 설정

## 📝 API 엔드포인트

### 인증

- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

## 🎯 향후 계획

- [ ] 노트를 데이터베이스에 저장 (현재는 localStorage)
- [ ] 노트 공유 기능
- [ ] 마크다운 에디터
- [ ] 태그 기능
- [ ] 노트 카테고리
- [ ] 이메일 인증
- [ ] 비밀번호 재설정
- [ ] 소셜 로그인 (Google, GitHub)

## 📄 라이선스

이 프로젝트는 학습 목적으로 제작되었습니다.

## 👥 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 통해 제출해주세요.
