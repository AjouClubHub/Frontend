import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "../Main/MainNavbar";
import SimpleNavbar from "../Main/SimpleNavbar";
import Sidebar from "../Main/Sidebar";
import '../../styles/Layout/Layout.css';

const Layout = () => {
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith("/auth");
  const isMain = pathname.startsWith("/main");
  const token = localStorage.getItem("accessToken");

  console.log("Layout", { pathname, isMain, token });

  const [searchTerm, setSearchTerm] = useState("");
  const [recruitStatus, setRecruitStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <>
      {!isAuth && (
        isMain
          ? <MainNavbar
              onSearchChange={(v) => {
                console.log("Layout에서 받은 검색어:", v);
                setSearchTerm(v);
              }}
              onRecruitmentChange={(s) => {
                console.log("Layout에서 받은 모집상태:", s);
                setRecruitStatus(s);
              }}
            />
          : <SimpleNavbar />
      )}

      <div className={!isAuth ? "layout-wrapper" : ""}>
        {/* 로그인한 사용자일 때만 사이드바 표시 */}
        {isMain && token && (
          <Sidebar 
            selectedCategory={selectedCategory}
            onCategoryClick={setSelectedCategory}
          />
        )}
        <div className="page-content">
          <Outlet
            context={{ searchTerm, recruitStatus, selectedCategory }}
          />
        </div>
      </div>
    </>
  );
};

export default Layout;
