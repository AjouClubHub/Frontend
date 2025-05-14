import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 각 페이지 컴포넌트 import
import MyClubs from '../components/MyClubs/MyClubs.jsx';
import MyClubsDetail from '../components/MyClubs/MyClubsDetail.jsx';
import NoticeDetail from '../components/Noti/NoticeDetail.jsx';
import NoticeList from '../components/Noti/NoticeList.jsx';
import RecuritDetail from '../components/Recurit/RecuritDetail';
import RecuritList from '../components/Recurit/RecuritList';
import MemberList from '../components/Member/MemberList.jsx';
import MemberDetail from '../components/Member/MemberDetail.jsx';




const MyClubsPage = () => {
    return (
      <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<MyClubs />} />

    
      <Route path=":clubId" element={<MyClubsDetail />}>
        <Route index element={<Navigate to="notice" replace />} />
        <Route path="notice" element={<NoticeList />} />
        <Route path="notice/:noticeId" element={<NoticeDetail />} />
       <Route path="recruit" element={<RecuritList />} />
       <Route path="recruit/:recruitId" element={<RecuritDetail/>} />
       <Route path="member" element={<MemberList/>} />
       <Route path="member/:memberId" element={<MemberDetail/>} />
      </Route> {/* ✅ 반드시 닫아야 함 */}
    </Routes>
    
    );
  };
  
  export default MyClubsPage;