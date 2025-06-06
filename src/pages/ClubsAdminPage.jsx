// ClubsAdminPage.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import usePageTitle from '../hooks/usePageTitle.jsx';

// 각 페이지 컴포넌트 import
import ClubsAdmin from '../components/ClubsAdmin/ClubsAmdin';
import ClubsAdminDetail from '../components/ClubsAdmin/ClubsAdminDetail';
import MemberList from '../components/Member/MemberList';
import MemberList_new from '../components/Member/MemberList_new';
import MemberDetail from '../components/Member/MemberDetail';
import MemberListDetail_new from '../components/Member/MemberListDetail_new';
import NoticeList from '../components/Noti/NoticeList';
import NoticeCreate from '../components/Noti/NoticeCreate';
import NoticeDetail from '../components/Noti/NoticeDetail';
import RecuritCreate from '../components/Recurit/RecuritCreate';
import RecuritDetail from '../components/Recurit/RecuritDetail';
import RecuritList from '../components/Recurit/RecuritList';

const ClubsAdminPage = () => {
  const getPageTitle = (path) => {
    if (path.includes('member')) {
      return '멤버 :Clubing';
    } else if (path.includes('notice')) {
      return '공지 :Clubing';
    } else if (path.includes('recruit')) {
      return '일정 :Clubing';
    } else if (path.includes('home')) {
      return '동아리 관리 :Clubing';
    }
    return 'Clubing';
  };

  usePageTitle(getPageTitle(window.location.pathname));

  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" replace />} />
      <Route path="home" element={<ClubsAdmin />} />

      <Route path=":clubId" element={<ClubsAdminDetail />}>
        {/* 기본 랜딩: 공지 목록 */}
        <Route index element={<NoticeList />} />

        {/* 멤버 관련 */}
        <Route path="memberlist" element={<MemberList />} />
        <Route path="memberlistnew" element={<MemberList_new />} />
        <Route path="member" element={<MemberList />} />
        <Route path="member/:memberId" element={<MemberDetail />} />
        <Route path="membernew" element={<MemberList_new />} />
        <Route path="membernew/:applicationId" element={<MemberListDetail_new />} />

        {/* 공지 관련 */}
        <Route path="notice" element={<NoticeList />} />
        <Route path="notice/:announcementId" element={<NoticeDetail />} />
        <Route path="noticecreate" element={<NoticeCreate />} />

        {/* 모집 공고(생성/편집) */}
        <Route path="recruitcreate" element={<RecuritCreate />} />
        <Route path="recruitedit/:scheduleId" element={<RecuritCreate />} />

        {/* 모집공고 상세 / 일정 상세 */}
        <Route path="recruit/모집공고" element={<RecuritDetail />} />
        <Route path="recruit/:scheduleId" element={<RecuritDetail />} />

        {/* 모집 목록 */}
        <Route path="recruit" element={<RecuritList />} />
      </Route>
    </Routes>
  );
};

export default ClubsAdminPage;
