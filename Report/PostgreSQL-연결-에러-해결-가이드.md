# PostgreSQL 연결 에러 해결 가이드

## 📋 개요

FluxNote 백엔드 서버 실행 시 발생할 수 있는 PostgreSQL 연결 에러와 해결 방법을 정리한 문서입니다.

---

## 🐛 발생한 에러

### 에러 메시지

```
[dotenv@17.2.3] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
데이터베이스 초기화 오류: Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
    at c:\DEV\Cursor_pro\FluxNote\fluxnote-backend\node_modules\pg-pool\index.js:45:11
    at process.processTicksAndRejections (node:internal/process/task_queues:105:5)
    at async initDatabase (c:\DEV\Cursor_pro\FluxNote\fluxnote-backend\src\config\initDatabase.js:6:5)
    at async startServer (c:\DEV\Cursor_pro\FluxNote\fluxnote-backend\src\index.js:25:5)
서버 시작 실패: Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

### 실행 명령어

```powershell
cd fluxnote-backend
npm run dev
```

---

## 🔍 원인 분석

### 1. 핵심 단서

에러 로그에서 다음 메시지에 주목:
```
[dotenv@17.2.3] injecting env (0) from .env
```

`(0)`는 **환경 변수가 0개 로드되었다**는 의미입니다.

### 2. 문제의 원인

- `.env` 파일이 존재하지 않음
- 환경 변수가 로드되지 않아 `DB_PASSWORD`가 `undefined`
- PostgreSQL 클라이언트가 문자열 비밀번호를 기대했지만 `undefined`를 받음

### 3. 에러 발생 위치

```javascript
// src/config/database.js
const pool = new Pool({
  host: process.env.DB_HOST,        // undefined
  port: process.env.DB_PORT,        // undefined
  database: process.env.DB_NAME,    // undefined
  user: process.env.DB_USER,        // undefined
  password: process.env.DB_PASSWORD, // undefined ❌
});
```

---

## ✅ 해결 방법

### 해결 방법 1: PowerShell로 .env 파일 생성 (권장)

```powershell
# fluxnote-backend 폴더로 이동
cd fluxnote-backend

# .env 파일 생성
@"
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
"@ | Out-File -FilePath .env -Encoding utf8

# 생성 확인
Get-Content .env
```

### 해결 방법 2: 수동으로 .env 파일 생성

1. `fluxnote-backend` 폴더를 엽니다
2. 새 파일을 생성하고 이름을 `.env`로 저장합니다
3. 다음 내용을 입력합니다:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
```

4. 저장합니다 (UTF-8 인코딩)

### 해결 방법 3: env-setup.txt 파일 활용

프로젝트에 이미 준비된 `env-setup.txt` 파일을 참고하여 `.env` 파일을 생성합니다.

---

## ⚙️ 환경 변수 설정 가이드

### 필수 환경 변수

| 변수명 | 설명 | 기본값 | 변경 필요 여부 |
|--------|------|--------|----------------|
| DB_HOST | 데이터베이스 호스트 | localhost | ❌ |
| DB_PORT | PostgreSQL 포트 | 5432 | ❌ |
| DB_NAME | 데이터베이스 이름 | fluxnote_db | ❌ |
| DB_USER | PostgreSQL 사용자 | postgres | ❌ |
| DB_PASSWORD | PostgreSQL 비밀번호 | postgresql | ✅ 필수! |
| PORT | 백엔드 서버 포트 | 5000 | ❌ |
| JWT_SECRET | JWT 토큰 시크릿 | (기본값) | ⚠️ 운영 환경에서 변경 |

### ⚠️ 중요: DB_PASSWORD 설정

**가장 중요한 설정입니다!**

`.env` 파일의 `DB_PASSWORD`를 PostgreSQL 설치 시 설정한 실제 비밀번호로 변경해야 합니다:

```env
# 예시: 비밀번호가 "mypassword123"인 경우
DB_PASSWORD=mypassword123
```

만약 PostgreSQL 비밀번호를 잊어버렸다면:
- Windows: 재설치 또는 pg_hba.conf 수정
- 기본 비밀번호: `postgres` 또는 설치 시 입력한 값

---

## 🧪 해결 확인

### 1. .env 파일 확인

```powershell
# 파일 존재 확인
Test-Path .env
# 출력: True (존재함)

# 파일 내용 확인
Get-Content .env
```

### 2. 서버 재시작

```powershell
npm run dev
```

### 3. 성공 메시지 확인

정상적으로 작동하면 다음과 같은 메시지가 출력됩니다:

```
[dotenv@17.2.3] injecting env (8) from .env
PostgreSQL 데이터베이스에 연결되었습니다.
데이터베이스 테이블이 성공적으로 생성되었습니다.
서버가 포트 5000에서 실행 중입니다.
```

주목할 점:
- `injecting env (8)` - 8개의 환경 변수가 로드됨 ✅
- 데이터베이스 연결 성공 메시지 ✅
- 테이블 생성 성공 메시지 ✅

---

## 🔄 관련 에러 및 해결 방법

### 에러 1: ECONNREFUSED

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**원인**: PostgreSQL 서비스가 실행되지 않음

**해결책**:
1. Windows 서비스 관리자 열기: `services.msc`
2. "postgresql" 서비스 찾기
3. 서비스 시작
4. 시작 유형을 "자동"으로 설정 (선택 사항)

### 에러 2: password authentication failed

```
Error: password authentication failed for user "postgres"
```

**원인**: 잘못된 비밀번호

**해결책**:
1. `.env` 파일의 `DB_PASSWORD` 확인
2. PostgreSQL 설치 시 설정한 비밀번호와 일치하는지 확인
3. psql 명령어로 비밀번호 테스트:
   ```powershell
   psql -U postgres
   # 비밀번호 입력
   ```

### 에러 3: database does not exist

```
Error: database "fluxnote_db" does not exist
```

**원인**: 데이터베이스가 생성되지 않음

**해결책**:
```powershell
psql -U postgres
```
```sql
CREATE DATABASE fluxnote_db;
\l  -- 데이터베이스 목록 확인
\q
```

### 에러 4: Port 5000 already in use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**원인**: 포트 5000이 이미 사용 중

**해결책 1** - 다른 포트 사용:
```env
# .env 파일
PORT=5001
```

**해결책 2** - 프로세스 종료:
```powershell
# 포트 사용 중인 프로세스 찾기
netstat -ano | findstr :5000

# 프로세스 종료 (PID 확인 후)
taskkill /PID [프로세스ID] /F
```

### 에러 5: Cannot find module 'dotenv'

```
Error: Cannot find module 'dotenv'
```

**원인**: 패키지가 설치되지 않음

**해결책**:
```powershell
npm install
```

---

## 🛠️ 디버깅 팁

### 1. 환경 변수 확인하기

코드에 임시로 추가하여 확인:

```javascript
// src/index.js 상단에 추가
console.log('환경 변수 확인:');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***설정됨***' : 'undefined');
console.log('PORT:', process.env.PORT);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '***설정됨***' : 'undefined');
```

### 2. PostgreSQL 연결 테스트

psql 명령어로 직접 연결 테스트:

```powershell
# 연결 테스트
psql -h localhost -p 5432 -U postgres -d fluxnote_db

# 성공하면 psql 프롬프트가 나타남
fluxnote_db=#
```

### 3. 테이블 확인

```sql
-- PostgreSQL에 접속 후
\dt  -- 테이블 목록
\d users  -- users 테이블 구조
\d notes  -- notes 테이블 구조

-- 데이터 확인
SELECT * FROM users;
SELECT * FROM notes;
```

### 4. 로그 레벨 설정

더 자세한 로그를 보려면:

```javascript
// src/config/database.js
const pool = new Pool({
  // ... 기존 설정
  log: (msg) => console.log('[PostgreSQL]', msg),
});
```

---

## 📚 참고 자료

### .gitignore 설정

`.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다:

```gitignore
# .gitignore
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

**이유**: `.env` 파일에는 데이터베이스 비밀번호, JWT 시크릿 등 민감한 정보가 포함되어 있습니다.

### 환경별 .env 파일 관리

```
.env                    # 개발 환경 (로컬)
.env.example            # 예제 파일 (Git 커밋)
.env.production         # 운영 환경
.env.test               # 테스트 환경
```

### dotenv 패키지 사용법

```javascript
// 기본 사용법
require('dotenv').config();

// 다른 경로의 .env 파일 로드
require('dotenv').config({ path: '.env.production' });

// 디버그 모드
require('dotenv').config({ debug: true });
```

---

## ✅ 체크리스트

서버 실행 전 확인사항:

- [ ] PostgreSQL이 설치되어 있음
- [ ] PostgreSQL 서비스가 실행 중
- [ ] `fluxnote_db` 데이터베이스가 생성됨
- [ ] `fluxnote-backend` 폴더에 `.env` 파일이 존재
- [ ] `.env` 파일에 모든 필수 환경 변수가 설정됨
- [ ] `DB_PASSWORD`가 올바른 비밀번호로 설정됨
- [ ] `npm install`로 패키지 설치 완료
- [ ] 포트 5000이 사용 가능한 상태

---

## 🚀 정상 작동 확인

### 1. 백엔드 서버 확인

브라우저에서 접속:
```
http://localhost:5000
```

예상 응답:
```json
{
  "message": "FluxNote API 서버가 실행 중입니다."
}
```

### 2. API 테스트

#### 회원가입 테스트 (PowerShell)

```powershell
$body = @{
    email = "test@example.com"
    username = "테스트사용자"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/signup" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

#### 로그인 테스트

```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```

### 3. 데이터베이스 확인

```powershell
psql -U postgres -d fluxnote_db
```

```sql
-- 생성된 사용자 확인
SELECT id, email, username, created_at FROM users;

-- 테이블 구조 확인
\d users
\d notes
```

---

## 🎓 학습 포인트

### 1. 환경 변수의 중요성

- 민감한 정보는 코드에 직접 넣지 않고 환경 변수로 관리
- `.env` 파일은 Git에 커밋하지 않음
- `.env.example` 파일로 필요한 변수 목록 공유

### 2. 에러 메시지 읽기

```
[dotenv@17.2.3] injecting env (0) from .env
```
- 패키지 이름: dotenv
- 버전: 17.2.3
- **핵심**: (0) - 로드된 환경 변수 개수

### 3. PostgreSQL 연결 파라미터

```javascript
const pool = new Pool({
  host: 'localhost',    // 서버 주소
  port: 5432,           // 포트 번호
  database: 'db_name',  // 데이터베이스명
  user: 'username',     // 사용자명
  password: 'password', // 비밀번호 (필수!)
});
```

---

## 📞 추가 지원

### 관련 문서

- [PostgreSQL 인증 구현 보고서](./PostgreSQL-인증-구현-보고서.md)
- [프로젝트 설치 가이드](../INSTALLATION.md)
- [백엔드 README](../fluxnote-backend/README.md)

### 커뮤니티 리소스

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [pg (node-postgres) 문서](https://node-postgres.com/)
- [dotenv 문서](https://github.com/motdotla/dotenv)

### 문의

문제가 계속되면:
1. GitHub Issues에 문제 보고
2. 에러 로그 전체 복사
3. `.env` 파일 내용 (비밀번호는 제외)
4. PostgreSQL 버전 및 설정

---

## 📝 요약

### 문제
- `.env` 파일이 없어서 환경 변수가 로드되지 않음
- `DB_PASSWORD`가 `undefined`로 전달되어 에러 발생

### 해결
- `fluxnote-backend` 폴더에 `.env` 파일 생성
- 필요한 환경 변수 설정
- 특히 `DB_PASSWORD`를 올바른 값으로 설정

### 예방
- 프로젝트 시작 시 `.env.example` 확인
- 환경 변수 로드 여부 확인 (로그의 숫자 체크)
- 설치 가이드 문서 참고

---

**작성일**: 2025년 10월 30일  
**작성자**: FluxNote 개발팀  
**버전**: 1.0.0  
**최종 수정일**: 2025년 10월 30일

