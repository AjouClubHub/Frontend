// src/components/Layout.jsx
import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "../Main/MainNavbar";
import SimpleNavbar from "../Main/SimpleNavbar";
import Sidebar from "../Main/Sidebar";

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;


  const [searchTerm, setSearchTerm] = useState("");
  const [recruitStatus, setRecruitStatus] = useState("전체");
  const [selectedCategory, setSelectedCategory] = useState([]);

  // MainNavbar 에 넘길 콜백
  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };
  const handleRecruitmentChange = (status) => {
    setRecruitStatus(status);
  };
  const handleCategoryChange = (categories) => {
    setSelectedCategory(categories);
  };

  const isAuthPage = path.startsWith("/auth");
  const isMainPage = path.startsWith("/main");

  return (
    <>
      {!isAuthPage && (
        <>
          {isMainPage
            ? (
              <MainNavbar
                onSearchChange={handleSearchChange}
                onRecruitmentChange={handleRecruitmentChange}
              />
            )
            : <SimpleNavbar />
          }
        </>
      )}
      <div className={!isAuthPage ? "layout-wrapper" : ""}>
        {isMainPage && (
          <Sidebar onCategoryClick={handleCategoryChange} />
        )}
        <div className="page-content">
       
          <Outlet context={{
            searchTerm,
            recruitStatus,
            selectedCategory
          }} />
        </div>
      </div>
    </>
  );
};

export default Layout;
