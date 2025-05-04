import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// 각 페이지 컴포넌트 import
import ClubsAdmin from '../components/ClubsAdmin/ClubsAmdin';
import ClubsAdminDetail from '../components/ClubsAdmin/ClubsAdminDetail'
import MemberList from '../components/Member/MemberList';
import MemberList_new from '../components/Member/MemberList_new';
import NoticeList from '../components/Noti/NoticeList';
import NoticeCreate from '../components/Noti/NoticeCreate';
import NoticeDetail from '../components/Noti/NoticeDetail';
import RecuritCreate from '../components/Recurit/RecuritCreate';
import RecuritDetail from '../components/Recurit/RecuritDetail';
import RecuritList from '../components/Recurit/RecuritList';



const ClubsAdminPage = () => {
    return (
      <Routes>
        {/* 기본 경로로 접근 시  페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="home" replace />} />
        <Route path="home" element={< ClubsAdmin/>} />
        
        {/* <Route path=":clubId" element={<ClubsAdminDetail />}>
        <Route path=":clubId/memberlist" element={<MemberList/>} />
        <Route path=":clubId/memberlistnew" element={<MemberList_new/>} />
        <Route path=":/notice" element={<NoticeList/>} />
        <Route path=":noticeId" element={<NoticeDetail/>} />
        <Route path=":noticecreate" element={<NoticeCreate/>} /> */}

             {/* 중첩 라우팅 구성 */}
      <Route path=":clubId" element={<ClubsAdminDetail />}>
      <Route index element={<NoticeList />} />
       <Route path="memberlist" element={<MemberList/>} />
       <Route path="memberlistnew" element={<MemberList_new/>} />
       <Route path="notice" element={<NoticeList />} />
       <Route path="notice/:announcementId" element={<NoticeDetail />} />
       <Route path="noticecreate" element={<NoticeCreate/>} />
       <Route path="recruitcreate" element={<RecuritCreate/>} />
       <Route path="recruit" element={<RecuritList isManager={true}/>} />
       <Route path="recruit/:recruitId" element={<RecuritDetail/>} />
      </Route>

    
      
        

       
      </Routes>
    );
  };
  
  export default ClubsAdminPage;