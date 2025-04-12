import React, { useState } from 'react';
import { CiSearch } from "react-icons/ci";
import "../../styles/Main/Navbar.css";
import { useNavigate } from "react-router-dom";

import { MdAccountCircle } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";
import { LuSchool } from "react-icons/lu";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaRegCalendarTimes } from "react-icons/fa";
import { IoSchoolOutline } from "react-icons/io5";
import { FaPeopleRoof } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import { CiLogin } from "react-icons/ci";
import { SiGnuprivacyguard } from "react-icons/si";
import { RiComputerLine } from "react-icons/ri";

//todo:navbar세로로

const Navbar = ({ onClubTypeChange, onRecruitmentChange, onSearchChange }) => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (menu) => setActiveMenu(activeMenu === menu ? null : menu);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/auth/login")
  }

  return (
    <nav className="navbar">
      <img src="/logo.png" alt="logo" onClick={() => navigate('/main/home')} style={{ cursor: 'pointer' }} />
      
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearchChange(e.target.value);
        }}
        placeholder="🔍 동아리명 검색"
      />

      <button onClick={() => toggleMenu('type')}>동아리 / 소학회</button>
      {activeMenu === 'type' && (
        <div>
          <button onClick={() => onClubTypeChange('전체')}>전체</button>
          <button onClick={() => onClubTypeChange('동아리')}>동아리</button>
          <button onClick={() => onClubTypeChange('소학회')}>소학회</button>
        </div>
      )}

      <button onClick={() => toggleMenu('status')}>모집 상태</button>
      {activeMenu === 'status' && (
        <div>
          <button onClick={() => onRecruitmentChange('전체')}>전체</button>
          <button onClick={() => onRecruitmentChange('모집중')}>모집중</button>
          <button onClick={() => onRecruitmentChange('모집마감')}>모집마감</button>
        </div>
      )}

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

export default Navbar;
