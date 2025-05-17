import React, { useState } from "react";
import axios from "axios";
import "../../styles/Main/MainNavbar.css";
import { useNavigate } from "react-router-dom";

const MainNavbar = ({ onRecruitmentChange = () => {}, onSearchChange = () => {} }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  // 모집 공고를 가져오는 함수
  const fetchRecruitments = async (status) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/recruitments`,
        {
          params: { status },
          headers: { Authorization: `Bearer Bearer ${token}` },
        }
      );
      console.log(response.data.data);
    } catch (err) {
      console.error("모집 공고 가져오기 오류:", err);
    }
  };

  const handleRecruitmentFilter = (status) => {
    fetchRecruitments(status);
    // 부모 콜백이 함수인지 확인 후 호출
    if (typeof onRecruitmentChange === 'function') {
      onRecruitmentChange(status);
    }
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
          const val = e.target.value;
          setSearchTerm(val);
          if (typeof onSearchChange === 'function') {
            onSearchChange(val);
          }
        }}
        placeholder="🔍 동아리명 검색"
      />

      {/* 모집 상태 필터링 버튼 */}
      <button onClick={() => toggleMenu('status')}>모집 상태</button>
      {activeMenu === 'status' && (
        <div className="status-menu">
          <button onClick={() => handleRecruitmentFilter('전체')}>전체</button>
          <button onClick={() => handleRecruitmentFilter('모집중')}>모집중</button>
          <button onClick={() => handleRecruitmentFilter('모집마감')}>모집마감</button>
        </div>
      )}

      {/* 계정 관련 메뉴 */}
      <button onClick={() => toggleMenu('account')}>계정</button>
      {activeMenu === 'account' && (
        <div className="account-menu">
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
