# FluxNote 설치 가이드

이 문서는 FluxNote 프로젝트를 로컬 환경에서 실행하는 방법을 단계별로 안내합니다.

## 📋 사전 준비

다음 프로그램들이 설치되어 있어야 합니다:

- [Node.js](https://nodejs.org/) (v14 이상)
- [PostgreSQL](https://www.postgresql.org/) (v12 이상)
- npm (Node.js와 함께 설치됨)

## 🔧 설치 단계

### 1단계: PostgreSQL 데이터베이스 생성

#### Windows에서:

1. PostgreSQL 서비스가 실행 중인지 확인합니다
   - 서비스 관리자 (services.msc)에서 "postgresql" 서비스 확인

2. 명령 프롬프트 또는 PowerShell에서 다음 명령어 실행:

```powershell
# PostgreSQL에 접속 (비밀번호 입력 필요)
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE fluxnote_db;

# 확인
\l

# 종료
\q
```

### 2단계: 백엔드 설정

1. 백엔드 폴더로 이동:
```powershell
cd fluxnote-backend
```

2. 의존성 패키지 설치:
```powershell
npm install
```

3. 환경 변수 파일 생성:
   - `fluxnote-backend` 폴더에 `.env` 파일을 생성합니다
   - `env-setup.txt` 파일의 내용을 참고하여 다음 내용을 입력:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fluxnote_db
DB_USER=postgres
DB_PASSWORD=postgresql

PORT=5000
JWT_SECRET=fluxnote_jwt_secret_key_change_in_production
```

   > ⚠️ **중요**: `DB_PASSWORD`를 PostgreSQL 설치 시 설정한 실제 비밀번호로 변경하세요!

4. 백엔드 서버 실행:
```powershell
npm run dev
```

다음과 같은 메시지가 출력되면 성공:
```
PostgreSQL 데이터베이스에 연결되었습니다.
데이터베이스 테이블이 성공적으로 생성되었습니다.
서버가 포트 5000에서 실행 중입니다.
```

### 3단계: 프론트엔드 설정

1. **새 터미널 창**을 열고 프론트엔드 폴더로 이동:
```powershell
cd fluxnote-app
```

2. 의존성 패키지 설치:
```powershell
npm install
```

3. 프론트엔드 서버 실행:
```powershell
npm start
```

브라우저가 자동으로 열리고 `http://localhost:3000`에 접속됩니다.

## 🎉 완료!

이제 FluxNote를 사용할 수 있습니다!

1. 회원가입 페이지에서 계정을 만듭니다
2. 로그인하여 노트를 작성해보세요

## ❓ 문제 해결

### PostgreSQL 연결 오류

**오류**: `ECONNREFUSED` 또는 연결 실패

**해결책**:
1. PostgreSQL 서비스가 실행 중인지 확인
2. `.env` 파일의 포트 번호 확인 (기본값: 5432)
3. 방화벽 설정 확인

### 비밀번호 인증 실패

**오류**: `password authentication failed`

**해결책**:
1. `.env` 파일의 `DB_PASSWORD`를 확인
2. PostgreSQL 설치 시 설정한 비밀번호와 일치하는지 확인

### 데이터베이스가 존재하지 않음

**오류**: `database "fluxnote_db" does not exist`

**해결책**:
```powershell
psql -U postgres
CREATE DATABASE fluxnote_db;
\q
```

### 포트가 이미 사용 중

**오류**: `Port 5000 is already in use`

**해결책**:
1. `.env` 파일에서 PORT를 다른 번호로 변경 (예: 5001)
2. 또는 해당 포트를 사용하는 프로세스 종료

### 프론트엔드 연결 오류

**오류**: "서버에 연결할 수 없습니다"

**해결책**:
1. 백엔드 서버가 실행 중인지 확인
2. 백엔드 포트 번호 확인 (기본값: 5000)
3. Auth.js에서 API_URL이 올바른지 확인:
   ```javascript
   const API_URL = 'http://localhost:5000/api/auth';
   ```

## 🔍 서버 상태 확인

### 백엔드 서버 확인

브라우저에서 `http://localhost:5000`에 접속하면:
```json
{
  "message": "FluxNote API 서버가 실행 중입니다."
}
```

### PostgreSQL 연결 확인

```powershell
psql -U postgres -d fluxnote_db
\dt
```

다음 테이블들이 보여야 합니다:
- users
- notes

## 📚 추가 문서

- [PostgreSQL 인증 구현 보고서](Report/PostgreSQL-인증-구현-보고서.md)
- [백엔드 README](fluxnote-backend/README.md)
- [프로젝트 README](README.md)

## 💡 팁

### 개발 시 유용한 명령어

```powershell
# PostgreSQL 데이터베이스 확인
psql -U postgres -d fluxnote_db

# 모든 사용자 조회
SELECT * FROM users;

# 모든 노트 조회
SELECT * FROM notes;

# 테이블 삭제 (재생성 필요 시)
DROP TABLE notes;
DROP TABLE users;
```

### 서버 재시작

백엔드는 nodemon으로 실행되므로 코드 변경 시 자동으로 재시작됩니다.
프론트엔드도 코드 변경 시 자동으로 새로고침됩니다.

## 🛑 서버 중지

- Windows: `Ctrl + C`
- 각 터미널에서 실행 후 `Y` 입력

## 📞 도움이 필요하신가요?

- [GitHub Issues](https://github.com/your-repo/FluxNote/issues)에 문제를 보고하세요
- 상세한 구현 내용은 Report 폴더의 문서를 참고하세요

