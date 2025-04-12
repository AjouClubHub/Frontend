import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Main/Navbar';
import Sidebar from '../../components/Main/Sidebar';
import Pagination from 'react-js-pagination';
import axios from 'axios';
import '../../styles/Main/Main.css';

const Main = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [recruitmentStatus, setRecruitmentStatus] = useState('전체');
  const [clubType, setClubType] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 6;
  const navigate = useNavigate();

  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  useEffect(() => {
    const fetchClubs = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs`, {
          headers: { Authorization: `Bearer Bearer ${token}` }
        });

        const clubs = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data?.data?.clubs)
          ? res.data.data.clubs
          : [];

        setAllClubs(clubs);
        setFilteredClubs(clubs);
        console.log('✅ API 응답 전체:', res);
      } catch (err) {
        console.error('클럽 데이터를 불러오는 중 오류:', err);
        setAllClubs([]);
        setFilteredClubs([]);
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

  const indexOfLastClub = currentPage * clubsPerPage;
  const indexOfFirstClub = indexOfLastClub - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexOfFirstClub, indexOfLastClub);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openModal = (club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setShowContactInfo(false); // 초기화
  };

  const closeModal = () => {
    setSelectedClub(null);
    setIsModalOpen(false);
    setShowContactInfo(false);
  };

  const handleContactClick = () => {
    setShowContactInfo(true);
  };

  const handleApplyClick = () => {
    if (selectedClub) {
      navigate(`/main/${selectedClub.id}/application`);
    }
  };

  return (
    <div className="main-container">
      <Navbar
        onRecruitmentChange={setRecruitmentStatus}
        onClubTypeChange={setClubType}
        onSearchChange={setSearchTerm}
        onAccountChange={(accountType) => {
          if (accountType === 'login') navigate('/auth/login');
          else if (accountType === 'signup') navigate('/auth/signup');
          else if (accountType === 'profile') navigate('/auth/account');
        }}
      />

      <div className="content">
        <img
          src="/school_logo.png"
          alt="logo"
          width="150px"
          style={{ cursor: 'pointer', marginRight: '30px' }}
        />

        <div className="text-block">
          <h1>아주대학교 - 동아리/소학회</h1>
          <p>
            <strong>'Clubing'</strong>에서 손쉽게 동아리/소학회를 찾고 가입하세요!<br />
            카카오, 엑셀, 교내 시스템 등 번거로웠던 동아리/소학회 인원 관리를 간편하게 하세요!
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <Sidebar onCategoryClick={setSelectedCategory} />

        <div className="club-section">
          <div className="club-list">
            {currentClubs.map((club) => (
              <div
                key={club.id}
                className="club-item"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(club)}
              >
                <h2>{club.name}</h2>
                <p><strong>위치:</strong> {club.location}</p>
                <p><strong>소개:</strong> {club.description}</p>
                <p><strong>키워드:</strong> {club.keyword}</p>
              </div>
            ))}
          </div>

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

      {/* ✅ 모달 영역 */}
      {isModalOpen && selectedClub && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2>{selectedClub.name}</h2>
            <p><strong>위치:</strong> {selectedClub.location}</p>
            <p><strong>소개:</strong> {selectedClub.description}</p>
            <p><strong>키워드:</strong> {selectedClub.keyword}</p>
            {Array.isArray(selectedClub.joinRequirement) && (
  <p>
    <strong>가입 가능학과:</strong>{' '}
    {selectedClub.joinRequirement.length > 0
      ? selectedClub.joinRequirement.join(', ')
      : '모든 학과'}
  </p>
)}




            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button onClick={handleContactClick} className="modal-btn">문의하기</button>
              <button onClick={handleApplyClick} className="modal-btn apply">가입하기</button>
            </div>

            {showContactInfo && (
              <p style={{ marginTop: '15px' }}>
                📞 <strong>회장 연락처:</strong> {selectedClub.contactInfo}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
