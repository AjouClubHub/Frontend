import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 각 페이지 컴포넌트 import
import LoginForm from '../components/Auth/LoginForm.jsx';
import SignUpForm from '../components/Auth/SignUpForm.jsx';
import Setting from '../components/Auth/Setting.jsx'
import Notification from '../components/Auth/Notification.jsx'


const AuthPage = () => {
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