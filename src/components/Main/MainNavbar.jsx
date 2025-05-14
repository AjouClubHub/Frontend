import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Main/MainNavbar.css";
import { useNavigate } from "react-router-dom";

const MainNavbar = ({ onRecruitmentChange, onSearchChange }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  // 알림을 가져오는 함수
  const fetchNotifications = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/notifications`,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      setNotifications(response.data.data); // 알림 목록을 상태에 저장
    } catch (err) {
      console.error("알림 가져오기 오류:", err);
    }
  };

  // 모집 공고를 가져오는 함수
  const fetchRecruitments = async (status) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/recruitments`,
        {
          params: { status }, // 상태별 필터링
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      // 상태에 맞는 모집 공고를 업데이트
      console.log(response.data.data);
    } catch (err) {
      console.error("모집 공고 가져오기 오류:", err);
    }
  };

  // 알림 읽음 처리 함수
  const markAsRead = async (notificationId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      // 읽음 처리된 알림을 목록에서 제거
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (err) {
      console.error("알림 읽음 처리 오류:", err);
    }
  };

  // 알림 표시 토글 함수
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // 컴포넌트가 마운트될 때 알림 목록을 가져옵니다.
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 모집 상태 변경 시 해당 상태에 맞는 모집 공고를 가져옵니다.
  const handleRecruitmentFilter = (status) => {
    fetchRecruitments(status);
    onRecruitmentChange(status); // 부모 컴포넌트에 상태 변경 전달
  };

  return (
    <nav className="navbar">
      <img
        src="/logo.png"
        alt="logo"
        onClick={() => navigate('/main/home')}
        style={{ cursor: 'pointer' }}
      />

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearchChange(e.target.value);
        }}
        placeholder="🔍 동아리명 검색"
      />

      {/* 알림 버튼 */}
      <button onClick={toggleNotifications}>
        알림 {notifications.length}
      </button>
      {showNotifications && (
        <div className="notification-dropdown">
          <ul>
            {notifications.length === 0 ? (
              <p>알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <li
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)} // 알림 클릭 시 읽음 처리
                >
                  <p>{notification.content}</p>
                  <span>{new Date(notification.createdAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* 모집 상태 필터링 버튼 */}
      <button onClick={() => toggleMenu('status')}>모집 상태</button>
      {activeMenu === 'status' && (
        <div>
          <button onClick={() => handleRecruitmentFilter('전체')}>전체</button>
          <button onClick={() => handleRecruitmentFilter('모집중')}>모집중</button>
          <button onClick={() => handleRecruitmentFilter('모집마감')}>모집마감</button>
        </div>
      )}

      {/* 계정 관련 메뉴 */}
      <button onClick={() => toggleMenu('account')}>계정</button>
      {activeMenu === 'account' && (
        <div>
          <button onClick={() => navigate(`/auth/login`)}>로그인</button>
          <button onClick={() => navigate(`/auth/signup`)}>회원가입</button>
          <button onClick={() => navigate(`/auth/setting`)}>계정조회</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
