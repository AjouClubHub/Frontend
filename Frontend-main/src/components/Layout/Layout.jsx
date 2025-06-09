// src/components/Layout/Layout.jsx
import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "../Main/MainNavbar";
import SimpleNavbar from "../Main/SimpleNavbar";
import Sidebar from "../Main/Sidebar";
import "../../styles/Layout/Layout.css";

const Layout = () => {
  const { pathname } = useLocation();
  const isAuth = pathname.startsWith("/auth");
  const isMain = pathname.startsWith("/main");
  const token = localStorage.getItem("accessToken");

  const [searchTerm, setSearchTerm] = useState("");
  const [recruitStatus, setRecruitStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState("");

  // → 상태 바뀔 때마다 로그
  useEffect(() => {
    console.log("📋 Layout recruitStatus 변경:", recruitStatus);
  }, [recruitStatus]);

  return (
    <>
      {!isAuth && (
        isMain ? (
          <MainNavbar
            currentStatus={recruitStatus}               // ★ 내려줌
            onSearchChange={v => setSearchTerm(v)}
            onRecruitmentChange={s => setRecruitStatus(s)}
          />
        ) : (
          <SimpleNavbar />
        )
      )}

      <div className={!isAuth ? "layout-wrapper" : ""}>
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
