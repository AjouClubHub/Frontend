import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Navbar from '../../components/Main/Navbar';
import Sidebar from '../../components/Main/Sidebar';
import Pagination from 'react-js-pagination'; // Pagination import
import axios from 'axios';
import '../../styles/Main/Main.css';




const Main = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [recruitmentStatus, setRecruitmentStatus] = useState('전체');
  const [clubType, setClubType] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage,setCurrentPage] = useState(1);
  const clubsPerPage = 6;
  const navigate = useNavigate();

// 아래처럼 수정해서 안전하게 처리
useEffect(() => {
  const fetchClubs = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs`, {
        headers: { Authorization: `Bearer Bearer ${token}` }
      });

      const clubs = Array.isArray(res.data.data) ? res.data.data : res.data.data.clubs || []; // 배열 형태 보장
      setAllClubs(clubs);
      setFilteredClubs(clubs);
      console.log(res.data)
      
    } catch (err) {
      console.error("클럽 데이터를 불러오는 중 오류:", err);
      setAllClubs([]);
      setFilteredClubs([]); // fallback
    }
  };
  fetchClubs();
}, []);


  useEffect(() => {
    let filtered = allClubs;

    if (searchTerm) {
      filtered = filtered.filter(club =>
        club.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory.length > 0) {
      filtered = filtered.filter(club => selectedCategory.includes(club.category));
    }

    if (recruitmentStatus !== '전체') {
      filtered = filtered.filter(club => club.status === recruitmentStatus);
    }

    if (clubType !== '전체') {
      filtered = filtered.filter(club => club.type === clubType);
    }

    setFilteredClubs(filtered);
  }, [searchTerm, selectedCategory, recruitmentStatus, clubType, allClubs]);

  // useEffect 아래쪽에 위치 — 현재 페이지에 맞는 클럽만 잘라서 보여줌
const indexOfLastClub = currentPage * clubsPerPage;
const indexOfFirstClub = indexOfLastClub - clubsPerPage;
const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  return (
    <div className="main-container">
      {/* 상단 네비게이션 바 */}

      <Navbar
        onRecruitmentChange={setRecruitmentStatus}
        onClubTypeChange={setClubType}
        onSearchChange={setSearchTerm}
        onAccountChange={(accountType) => {
          if (accountType === 'login') navigate('/login');
          else if (accountType === 'signup') navigate('/signup');
          else if (accountType === 'profile') navigate('/account');
        }}
      />
     <div className="content">
  <img src="/school_logo.png" alt="logo" width="150px" style={{ cursor: 'pointer', marginRight: '30px'}} />

  <div className="text-block">
    <h1>아주대학교 - 동아리/소학회</h1>
    <p>
      <strong>'Clubing'</strong>에서 손쉽게 동아리/소학회를 찾고 가입하세요!<br />
      카카오, 엑셀, 교내 시스템 등 번거로웠던 동아리/소학회 인원 관리를 간편하게 하세요!
    </p>
  </div>
</div>

  
      {/* 본문 영역 */}
      <div className="content-wrapper">
        {/* 사이드바 */}
        <Sidebar onCategoryClick={setSelectedCategory} />
  
      {/* 클럽 목록 및 페이지네이션 */}
<div className="club-section">
  <div className="club-list">
    {currentClubs.map(club => (
      <div key={club.id} className="club-item">
        <h2>{club.name}</h2>
        <p><strong>위치:</strong> {club.location}</p>
        <p><strong>소개:</strong> {club.description}</p>
        <p><strong>키워드:</strong> {club.keyword}</p>
      </div>
    ))}
  </div>

  {/* 페이지네이션 */}
  <div className="pagination-wrapper">
    <Pagination
      activePage={currentPage}
      itemsCountPerPage={clubsPerPage}
      totalItemsCount={filteredClubs.length}
      pageRangeDisplayed={5}
      onChange={handlePageChange}
      prevPageText="<"
      nextPageText=">"
      firstPageText="<<"
      lastPageText=">>"
      itemClass="page-item"
      linkClass="page-link"
      innerClass="pagination"
    />
  </div>
</div>

      </div>
    </div>
  );
  
};


export default Main;
