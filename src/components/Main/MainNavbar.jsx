import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { notificationPopupState } from '../store/notificationPopupState';
import "../../styles/Main/MainNavbar.css";
import { LuLogIn } from "react-icons/lu";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";
import { MdLogout } from "react-icons/md";
import { FaRegCalendarCheck } from "react-icons/fa";
import { FaCalendarTimes } from "react-icons/fa";
import { FaCalendarPlus } from "react-icons/fa";
import { FaCalendarMinus } from "react-icons/fa";
import { FaCalendarAlt } from "react-icons/fa";


export default function MainNavbar({ onSearchChange, onRecruitmentChange }) {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken");
  const { notification, isOpen } = useRecoilValue(notificationPopupState);

  const toggleMenu = menu =>
    setActiveMenu(activeMenu === menu ? null : menu);

  const handleSearchInput = e => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  if (!token) {
    // 비로그인 시: 검색창만 보여주기
    return (
      <nav className="navbar">
        <img
          src="/logo.png"
          alt="logo"
          onClick={() => navigate("/main/home")}
        />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInput}
          placeholder="🔍 동아리명 또는 키워드 검색"
        />
         <button onClick={() => navigate("/auth/login")}><LuLogIn />로그인</button>  
         <button onClick={() => navigate("/auth/signup")}>회원가입</button>  
         
      </nav>
      
      
      
      
    );
  }

  // 로그인 시: 기존 UI
  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      {isOpen && notification && (
        <div className="nav-popup">{notification.content}</div>
      )}
      <img
        src="/logo.png"
        alt="logo"
        onClick={() => navigate("/main/home")}
      />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchInput}
        placeholder="🔍 동아리명 또는 키워드 검색"
      />

<div className="menu-wrapper">
        <button onClick={() => toggleMenu("status")}><FaRegCalendarCheck size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>모집 상태</button>
        {activeMenu === "status" && (
          <div className="status-menu">
            <button onClick={() => onRecruitmentChange("전체")}><FaCalendarAlt size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>전체</button>
            <button onClick={() => onRecruitmentChange("모집중")}><FaCalendarPlus size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>모집중</button>
            <button onClick={() => onRecruitmentChange("모집마감")}><FaCalendarTimes size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>모집마감</button>
            <button onClick={() => onRecruitmentChange("상시모집")}><FaCalendarMinus size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>상시모집</button>
          </div>
        )}
      </div>

      <div className="menu-wrapper">
        <button onClick={() => toggleMenu("account")}><MdOutlineAccountCircle size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>계정</button>
        {activeMenu === "account" && (
          <div className="account-menu">
            <button onClick={() => navigate("/auth/setting")}><MdManageAccounts size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}/>계정조회</button>
            <button onClick={() => {
              localStorage.removeItem("accessToken");
              navigate("/auth/login");
            }}><MdLogout size={18}
            style={{ marginRight: '8px', verticalAlign: 'middle' }} />로그아웃</button>
          </div>
        )}
      </div>
    </nav>
  );
}