require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDatabase = require('./config/initDatabase');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 라우트
app.use('/api/auth', authRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.json({ message: 'FluxNote API 서버가 실행 중입니다.' });
});

// 데이터베이스 초기화 후 서버 시작
const startServer = async () => {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error('서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();

