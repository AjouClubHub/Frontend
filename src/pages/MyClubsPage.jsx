import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 각 페이지 컴포넌트 import
import MyClubs from '../components/MyClubs/MyClubs.jsx';
import MyClubsDetail from '../components/MyClubs/MyClubsDetail.jsx';



const MyClubsPage = () => {
    return (
      <Routes>
        {/* 기본 경로로 접근 시 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/myclubs/home" replace />} />
        <Route path="/home" element={<MyClubs/>} />
        <Route path=":myclubsid" element={<MyClubsDetail/>} />
     
      </Routes>
    );
  };
  
  export default MyClubsPage;