import React, { useState } from 'react';
import './Auth.css';

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const API_URL = 'http://localhost:5000/api/auth';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력하세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '유효한 이메일을 입력하세요.';
    }

    // 회원가입 시 추가 검증
    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = '사용자명을 입력하세요.';
      } else if (formData.username.length < 3) {
        newErrors.username = '사용자명은 최소 3자 이상이어야 합니다.';
      }

      if (!formData.password) {
        newErrors.password = '비밀번호를 입력하세요.';
      } else if (formData.password.length < 6) {
        newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호를 다시 입력하세요.';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      }
    } else {
      // 로그인 시 비밀번호 검증
      if (!formData.password) {
        newErrors.password = '비밀번호를 입력하세요.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, username: formData.username, password: formData.password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        // 토큰 저장
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage(data.message);
        
        // 로그인 성공 콜백
        setTimeout(() => {
          onAuthSuccess(data.user);
        }, 1000);
      } else {
        setMessage(data.message || '오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('인증 오류:', error);
      setMessage('서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인하세요.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>
            <i className="bi bi-journal-text me-2"></i>
            FluxNote
          </h2>
          <p className="mb-0 mt-2">{isLogin ? '로그인' : '회원가입'}</p>
        </div>
        
        <div className="auth-body">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                disabled={loading}
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username">사용자명</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="사용자명"
                  disabled={loading}
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="비밀번호"
                disabled={loading}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호 확인"
                  disabled={loading}
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
            )}

            {message && (
              <div className={message.includes('성공') || message.includes('완료') ? 'success-message' : 'error-message'}>
                {message}
              </div>
            )}

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? '처리 중...' : (isLogin ? '로그인' : '회원가입')}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            <button type="button" onClick={toggleAuthMode}>
              {isLogin ? '회원가입' : '로그인'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;

