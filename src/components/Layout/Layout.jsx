import React , {useState} from "react";
import { Outlet, useLocation } from "react-router-dom";
import MainNavbar from "../Main/MainNavbar"; // 메인 페이지용 Navbar
import SimpleNavbar from "../Main/SimpleNavbar"; // 일반 페이지용 Navbar
import Sidebar from "../Main/Sidebar";
import Main from "../Main/Main"

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const [selectedCategory, setSelectedCategory] = useState([]);

  const handleCategoryChange = (categories) => {
    setSelectedCategory(categories);
  };

  const isAuthPage = path.startsWith("/auth");
  const isMainPage = path.startsWith("/main");
  

  return (
    <>
      {!isAuthPage && (
        <>
          {isMainPage ? <MainNavbar /> : <SimpleNavbar />}
        </>
      )}
      <div className={!isAuthPage ? "layout-wrapper" : ""}>
        {isMainPage && <Sidebar onCategoryClick={handleCategoryChange} />
      }
        <div className="page-content">
        {isMainPage ? <Main selectedCategory={selectedCategory} /> : <Outlet />}
        </div>
      </div>
    </>
  );
};

export default Layout;
