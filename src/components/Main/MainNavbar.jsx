import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from 'recoil';
import { notificationPopupState } from '../store/notificationPopupState';
import "../../styles/Main/MainNavbar.css";
import { LuLogIn } from "react-icons/lu";
import { MdOutlineAccountCircle, MdManageAccounts, MdLogout } from "react-icons/md";
import { FaRegCalendarCheck, FaCalendarAlt, FaCalendarPlus, FaCalendarTimes, FaCalendarMinus } from "react-icons/fa";
import { BiSolidUserAccount } from "react-icons/bi";

export default function MainNavbar({ onSearchChange, onRecruitmentChange }) {
  const navigate = useNavigate();
  const { notification, isOpen } = useRecoilValue(notificationPopupState);
  const [activeMenu, setActiveMenu] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("accessToken");

  const toggleMenu = menu =>
    setActiveMenu(activeMenu === menu ? null : menu);

  const handleSearchInput = e => {
    const v = e.target.value;
    setSearchTerm(v);
    onSearchChange(v);
  };

  if (!token) {
    return (
      <nav className="navbar">
        <img src="/logo.png" alt="logo" onClick={() => navigate("/main/home")} />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchInput}
          placeholder="🔍 동아리명 또는 키워드 검색"
        />
          
        <button type="button" onClick={() => navigate("/auth/login")}><LuLogIn size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>
        로그인</button>
        <button type="button" onClick={() => navigate("/auth/signup")}><BiSolidUserAccount size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>회원가입</button>
      </nav>
    );
  }

  return (
    <nav className="navbar" style={{ position: 'relative' }}>
      {isOpen && notification && <div className="nav-popup">{notification.content}</div>}
      <img src="/logo.png" alt="logo" onClick={() => navigate("/main/home")} />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchInput}
        placeholder="🔍 동아리명 또는 키워드 검색"
      />

      {/* 모집 상태 메뉴 */}
      <div className="menu-wrapper">
        <button onClick={() => toggleMenu("status")}>
          <FaRegCalendarCheck size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          모집 상태
        </button>
        {activeMenu === "status" && (
          <div className="status-menu">
            <button type="button"onClick={() => { onRecruitmentChange("전체"); setActiveMenu(null); }}>
              <FaCalendarAlt size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>전체
            </button>
            <button   type="button"onClick={() => { onRecruitmentChange("모집중"); setActiveMenu(null); }}>
              <FaCalendarPlus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>모집중
            </button>
            <button   type="button" onClick={() => { onRecruitmentChange("모집마감"); setActiveMenu(null); }}>
              <FaCalendarTimes size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>모집마감
            </button>
            <button type="button" onClick={() => { onRecruitmentChange("상시모집"); setActiveMenu(null); }}>
              <FaCalendarMinus size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>상시모집
            </button>
          </div>
        )}
      </div>

      {/* 계정 메뉴 */}
      <div className="menu-wrapper">
        <button onClick={() => toggleMenu("account")}>
          <MdOutlineAccountCircle size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
          계정
        </button>
        {activeMenu === "account" && (
          <div className="account-menu">
            <button  type="button"onClick={() => navigate("/auth/setting")}>
              <MdManageAccounts size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>계정조회
            </button>
            <button  type="button"onClick={() => { localStorage.removeItem("accessToken"); navigate("/auth/login"); }}>
              <MdLogout size={18} style={{ marginRight: 8, verticalAlign: 'middle' }}/>로그아웃
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
