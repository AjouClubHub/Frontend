// src/components/Main/MainNavbar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Main/MainNavbar.css";

const MainNavbar = ({
  onSearchChange = () => {},
  onRecruitmentChange = () => {},
}) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (menu) =>
    setActiveMenu(activeMenu === menu ? null : menu);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login");
  };

  // 검색어 입력 시 Layout에 전달
  const handleSearchInput = (e) => {
    const term = e.target.value;
    console.log("Navbar 입력:",term);
    setSearchTerm(term);
    onSearchChange(term);
  };

  return (
    <nav className="navbar">
      {/* 로고 클릭 시 메인으로 */}
      <img
        src="/logo.png"
        alt="logo"
        onClick={() => navigate("/main/home")}
        style={{ cursor: "pointer" }}
      />

      {/* 검색창 */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchInput}
        placeholder="🔍 동아리명 검색"
      />

      {/* 모집 상태 필터 */}
      <button onClick={() => toggleMenu("status")}>모집 상태</button>
      {activeMenu === "status" && (
        <div className="status-menu">
          <button onClick={() => onRecruitmentChange("전체")}>전체</button>
          <button onClick={() =>{
            console.log('Navbar 모집중 클릭')
             onRecruitmentChange("모집중")}
          } 
           >모집중</button>
          <button onClick={() => onRecruitmentChange("모집마감")}>모집마감</button>
+         <button onClick={() => onRecruitmentChange("상시모집")}>상시모집</button>
        </div>
      )}

      {/* 계정 메뉴 */}
      <button onClick={() => toggleMenu("account")}>계정</button>
      {activeMenu === "account" && (
        <div className="account-menu">
          <button onClick={() => navigate("/auth/login")}>로그인</button>
          <button onClick={() => navigate("/auth/setting")}>계정조회</button>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </nav>
  );
};

export default MainNavbar;
