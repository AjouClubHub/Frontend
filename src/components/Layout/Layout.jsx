// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "../Main/MainNavbar";
import SimpleNavbar from "../Main/SimpleNavbar";
import Sidebar from "../Main/Sidebar";
import "../../styles/Layout/Layout.css";

const Layout = () => {
  const { pathname } = useLocation();
  const token = localStorage.getItem("accessToken");

  // 인증 페이지
  const isAuth = pathname.startsWith("/auth");
  // 메인 영역: 일반 메인과 게스트용 메인
  const isMain = pathname.startsWith("/main") || pathname.startsWith("/guestmain");
  // 로그인 상태에 따른 게스트 구분
  const isGuest = !token;

  // 탭 · 검색 · 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [recruitStatus, setRecruitStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    console.log("📋 Layout recruitStatus 변경:", recruitStatus);
  }, [recruitStatus]);

  return (
    <>
      {/* /auth 경로가 아니면 네비게이션 바 렌더 */}
      {!isAuth && (
        isMain ? (
          <MainNavbar
            currentStatus={recruitStatus}
            onSearchChange={v => setSearchTerm(v)}
            onRecruitmentChange={s => setRecruitStatus(s)}
          />
        ) : (
          <SimpleNavbar />
        )
      )}

      <div className={!isAuth ? "layout-wrapper" : ""}>
        {/* 메인 영역일 때는 사이드바 항상 표시, 로그인 안 된 경우 isGuest로 "나의 카테고리" 숨김 */}
        {isMain && (
          <Sidebar
            selectedCategory={selectedCategory}
            onCategoryClick={setSelectedCategory}
            hideMyCategory={isGuest}
          />
        )}
        <div className="page-content">
          {/* Route 컴포넌트에 context로 전달 */}
          <Outlet
            context={{ searchTerm, recruitStatus, selectedCategory }}
          />
        </div>
      </div>
    </>
  );
};

export default Layout;
