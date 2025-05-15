import React from 'react';
import { Routes, Route, Navigate ,useLocation } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.jsx';

// 각 페이지 컴포넌트 import
import LoginForm from '../components/Auth/LoginForm.jsx';
import SignUpForm from '../components/Auth/SignUpForm.jsx';
import Setting from '../components/Auth/Setting.jsx'
import Notification from '../components/Auth/Notification.jsx'


const AuthPage = () => {
  const location = useLocation();  // 현재 URL 정보를 가져오기

  // 페이지별 제목 설정
  const getPageTitle = (path) => {
    switch (path) {
      case '/auth/login':
        return 'Clubing : 로그인';
      case '/auth/signup':
        return 'Clubing : 회원가입';
      case '/auth/setting':
        return 'Clubing : 마이페이지';
      case '/auth/notification':
        return 'Notifications - My Site';
      default:
        return 'Clubing';
    }
  };

  // 현재 URL 경로에 맞는 제목을 설정
  usePageTitle(getPageTitle(location.pathname));
    return (
      <Routes>
        {/* 기본 경로로 접근 시 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    );
  };
  
  export default AuthPage;