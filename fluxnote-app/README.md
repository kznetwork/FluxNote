# FluxNote - 반응형 메모 앱

React를 사용하여 만든 직관적이고 반응형인 메모 애플리케이션입니다.

## 🎯 주요 기능

- ✏️ **노트 작성**: 새로운 노트를 쉽게 생성
- 📝 **노트 수정**: 기존 노트를 언제든지 수정
- 💾 **자동 저장**: LocalStorage를 사용한 데이터 영속성
- 🗑️ **노트 삭제**: 불필요한 노트를 삭제
- 🔍 **실시간 검색**: 제목 또는 내용으로 노트 검색
- 📱 **반응형 디자인**: 모든 디바이스에서 최적화된 사용 경험

## 🚀 시작하기

### 설치

\`\`\`bash
npm install
\`\`\`

### 개발 서버 실행

\`\`\`bash
npm start
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 프로덕션 빌드

\`\`\`bash
npm run build
\`\`\`

## 🏗️ 기술 스택

- React 18
- CSS3 (Flexbox, Media Queries)
- LocalStorage API
- Create React App

## 📂 프로젝트 구조

\`\`\`
src/
├── components/
│   ├── NoteList.js          # 노트 목록
│   ├── NoteEditor.js        # 노트 편집기
│   └── SearchBar.js         # 검색바
├── App.js                   # 메인 앱
└── index.js                 # 진입점
\`\`\`

## 📱 반응형 디자인

- **데스크톱**: 사이드바 + 메인 컨텐츠 (좌우 배치)
- **태블릿**: 적응형 레이아웃
- **모바일**: 최적화된 터치 인터페이스

## 📄 라이선스

MIT License

## 📧 문의

프로젝트에 대한 질문이나 제안이 있으시면 이슈를 등록해주세요.
