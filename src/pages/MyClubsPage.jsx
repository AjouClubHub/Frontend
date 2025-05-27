import React from 'react';
import { Routes, Route, Navigate,useLocation } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.jsx';
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

  const location = useLocation();  // 현재 경로를 가져오기

  // 경로에 따른 페이지 제목 설정
  const getPageTitle = (path) => {
    if (path.includes('member')) {
      return '멤버 :Clubing';  // 'member'로 시작하는 경로
    } else if (path.includes('notice')) {
      return '공지 :Clubing';  // 'notice'로 시작하는 경로
    } else if (path.includes('recruit')) {
      return '일정 :Clubing';  // 'recruit'로 시작하는 경로
    } else if (path.includes('home')){
      return '내 동아리 :Clubing'
    }
    return 'Clubing';  // 기본 제목
  };

  // 현재 경로에 맞는 제목 설정
  usePageTitle(getPageTitle(location.pathname));
    return (
      <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<MyClubs />} />
      <Route path=":clubId" element={<MyClubsDetail />}>
        <Route index element={<Navigate to="notice" replace />} />
        <Route path="notice" element={<NoticeList />} />
        <Route path="notice/:announcementId" element={<NoticeDetail />} />
       <Route path="recruit" element={<RecuritList />} />
       <Route path="recruit/:scheduleId" element={<RecuritDetail/>} />
       <Route path="member" element={<MemberList/>} />
       <Route path="member/:memberId" element={<MemberDetail/>} />
      </Route> {/* ✅ 반드시 닫아야 함 */}
    </Routes>
    
    );
  };
  
  export default MyClubsPage;