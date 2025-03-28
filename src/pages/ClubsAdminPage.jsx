import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 각 페이지 컴포넌트 import
import ClubsAdminCreate from '../components/ClubsAdmin/ClubsAdminCreate';
import ClubsAdmin from '../components/ClubsAdmin/ClubsAmdin';



const ClubsAdminPage = () => {
    return (
      <Routes>
        {/* 기본 경로로 접근 시  페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/clubsadmin/home" replace />} />
        <Route path="/home" element={< ClubsAdmin/>} />
        <Route path="/clubsadmincreate" element={< ClubsAdminCreate/>} />
       
      </Routes>
    );
  };
  
  export default ClubsAdminPage;