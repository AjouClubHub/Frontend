import React, { useState, useEffect, useRef } from 'react';
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

const Navbar = ({
  onRecruitmentChange,
  onClubTypeChange,
  onSearchChange,
  onAccountChange
}) => {
  const [activeMenu, setActiveMenu] = useState(null); // 열린 드롭다운을 추적
  const [searchTerm, setSearchTerm] = useState(""); // 동아리 검색어 상태
  const navbarRef = useRef(null);
  const dropdownRef = useRef(null); // 드롭다운을 추적하기 위한 ref
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
      window.location.reload(); // 현재 페이지 새로고침
    } else {
      navigate(path); // 다른 경로로 이동
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onSearchChange(e.target.value);
  };

  // 각 항목 선택 후 드롭다운 닫기
  const handleRecruitmentChange = (status) => {
    onRecruitmentChange(status);
    setActiveMenu(null); // 메뉴 닫기
  };

  const handleClubTypeChange = (type) => {
    onClubTypeChange(type);
    setActiveMenu(null); // 메뉴 닫기
  };

  const handleAccountTypeChange = (account) => {
    onAccountChange(account);
    setActiveMenu(null); // 메뉴 닫기
  };

  // 드롭다운 클릭 시 toggle
  const handleMenuToggle = (menu) => {
    if (activeMenu === menu) {
      setActiveMenu(null); // 이미 열린 메뉴를 클릭하면 닫기
    } else {
      setActiveMenu(menu); // 새 메뉴 클릭 시 열기
    }
  };

  // 페이지 밖 클릭 시 드롭다운 닫기
  const handleClickOutside = (event) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target) && !dropdownRef.current?.contains(event.target)) {
      setActiveMenu(null); // navbar와 dropdown 외부 클릭 시 드롭다운을 닫음
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar" ref={navbarRef}>
      <div>
        <img
          src="../../src/assets/images/logo.png"
          alt="Clubing"
          onClick={() => handleNavigation('/main/home')}
          style={{ width: '150px', marginRight: '10px' }}
        />
      </div>

      {/* 검색 기능 */}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="🔍 동아리명 검색"
        className="search-input"
      />

      {/* 동아리/소학회 버튼 */}
      <button className="club-type-btn" onClick={() => handleMenuToggle('type')}>
        <LuSchool /> 동아리 / 소학회
      </button>
      {activeMenu === 'type' && (
        <div className="dropdown" ref={dropdownRef}>
          <button onClick={() => handleClubTypeChange('동아리')}>
            <FaPeopleRoof /> 동아리
          </button>
          <button onClick={() => handleClubTypeChange('소학회')}>
            <IoSchoolOutline /> 소학회
          </button>
        </div>
      )}

      {/* 모집 상태 버튼 */}
      <button className="recruitment-btn" onClick={() => handleMenuToggle('recruitment')}>
        <FaCalendarCheck /> 모집 상태
      </button>
      {activeMenu === 'recruitment' && (
        <div className="dropdown" ref={dropdownRef}>
          <button onClick={() => handleRecruitmentChange('모집중')}>
            <FaRegCalendarCheck /> 모집중
          </button>
          <button onClick={() => handleRecruitmentChange('모집마감')}>
            <FaRegCalendarTimes /> 모집마감
          </button>
        </div>
      )}

      {/* 계정 조회 버튼 */}
      <button className="account-btn" onClick={() => handleMenuToggle('account')}>
        <MdAccountCircle /> 계정
      </button>
      {activeMenu === 'account' && (
        <div className="dropdown" ref={dropdownRef}>
          <button onClick={() => handleAccountTypeChange('내 계정 확인')}>
            <MdOutlineAccountCircle /> 내 계정 확인
          </button>
          <button onClick={() => handleAccountTypeChange('로그인')}>
            <CiLogin /> 로그인
          </button>
          <button onClick={() => handleAccountTypeChange('회원가입')}>
            <SiGnuprivacyguard /> 회원가입
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
