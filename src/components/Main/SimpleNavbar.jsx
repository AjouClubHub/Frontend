import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Main/SimpleNavbar.css"

const SimpleNavbar = () => {
    const navigate = useNavigate();
  return (
    <nav className="simple-navbar">
    <img src="/logo.png" alt="logo" onClick={() => navigate('/main/home')} />
    <button onClick={() => navigate('/myclubs/home')}>내 소속(모임)</button>
    <button onClick={() => navigate('/clubsadmin/home')}>관리중인 동아리</button>
    <button onClick={() => navigate('/auth/setting')}>계정</button>
  </nav>
  
  
  );
};

export default SimpleNavbar;
