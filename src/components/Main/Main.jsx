import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Main/Navbar';
import Sidebar from '../../components/Main/Sidebar';
import Pagination from 'react-js-pagination'; // Pagination import
import axios from 'axios';
import '../../styles/Main/Main.css';
import { useCookies } from 'react-cookie'; // 쿠키 유틸리티 import

const Main = () => {
  const [filteredClubs, setFilteredClubs] = useState([]); // 필터링된 동아리 상태
  const [allClubs, setAllClubs] = useState([]); // 전체 동아리 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  console.log(totalPages)
  const [categories, setCategories] = useState([]); // 카테고리 상태
  const [selectedCategory, setSelectedCategory] = useState(''); // 선택된 카테고리
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [recruitmentStatus, setRecruitmentStatus] = useState('전체'); // 모집 상태
  const [clubType, setClubType] = useState('전체'); // 동아리 / 소학회
  const clubsPerPage = 6; // 한 페이지에 6개의 동아리 표시

  // 쿠키에서 토큰을 읽어오기 위한 useCookies
  const [cookies] = useCookies(["token"]);

  useEffect(() => {
    // 쿠키에 토큰이 있으면 데이터 로드
    if (cookies.token) {
      console.log("로그인된 토큰이 쿠키에 있습니다.");
      fetchData();
    } else {
      console.log("로그인되지 않은 상태입니다.");
    }
  }, [cookies.token]); // cookies.token이 변경될 때마다 실행

  // 필터링된 동아리 목록을 설정하는 함수
  const filterClubs = (clubs, categories, search, status, type, page) => {
    let filteredClubs = clubs.filter(club => club.clubName.toLowerCase().includes(search.toLowerCase()));

    if (categories.length > 0) {
      filteredClubs = filteredClubs.filter(club => categories.some(category => club.category === category)); // 여러 카테고리 필터링
    }

    if (status !== '전체') {
      filteredClubs = filteredClubs.filter(club => club.recruitmentStatus === status); // 모집 상태 필터링
    }

    if (type !== '전체') {
      filteredClubs = filteredClubs.filter(club => club.clubType === type); // 동아리 유형 필터링
    }

    const totalClubs = filteredClubs.length;
    const totalPages = Math.ceil(totalClubs / clubsPerPage); // 페이지 수 계산

    // 현재 페이지에 맞는 동아리 목록만 선택
    const startIndex = (page - 1) * clubsPerPage;
    const selectedClubs = filteredClubs.slice(startIndex, startIndex + clubsPerPage);

    setFilteredClubs(selectedClubs); // 현재 페이지에 맞는 동아리 목록 설정
    setTotalPages(totalPages); // 총 페이지 수 설정
  };

  const handleCategoryClick = (categories) => {
    setSelectedCategory(categories);
    setCurrentPage(1); // 카테고리 변경 시 페이지를 1로 리셋
    filterClubs(allClubs, categories, searchTerm, recruitmentStatus, clubType, 1); // 필터링된 동아리 업데이트
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    filterClubs(allClubs, selectedCategory, searchTerm, recruitmentStatus, clubType, pageNumber); // 페이지 변경 시 필터링된 동아리 업데이트
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
    setCurrentPage(1); // 검색 시 페이지를 1로 리셋
    filterClubs(allClubs, selectedCategory, search, recruitmentStatus, clubType, 1); // 검색 후 필터링된 동아리 업데이트
  };

  const handleRecruitmentChange = (status) => {
    setRecruitmentStatus(status);
    setCurrentPage(1); // 모집 상태 변경 시 페이지를 1로 리셋
    filterClubs(allClubs, selectedCategory, searchTerm, status, clubType, 1); // 필터링된 동아리 업데이트
  };

  const handleClubTypeChange = (type) => {
    setClubType(type);
    setCurrentPage(1); // 동아리 유형 변경 시 페이지를 1로 리셋
    filterClubs(allClubs, selectedCategory, searchTerm, recruitmentStatus, type, 1); // 필터링된 동아리 업데이트
  };

  // 쿠키를 사용하여 인증 후 데이터를 가져오는 함수
  const fetchData = async () => {
    try {
      // axios 요청 시 쿠키에 저장된 토큰을 자동으로 포함시키고, 헤더에 토큰을 추가할 필요 없음
      const response = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs`, {
        withCredentials: true, // 쿠키 포함
      });

      console.log('응답 상태 코드:', response.status); // 응답 상태 코드 확인
      console.log('데이터:', response.data); // 서버 응답 데이터 확인
      setAllClubs(response.data.clubs);
      setCategories(response.data.categories || []);
      setFilteredClubs(response.data.clubs.slice(0, clubsPerPage)); // 처음 6개 동아리
      setTotalPages(Math.ceil(response.data.clubs.length / clubsPerPage)); // 전체 페이지 수
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Navbar
          onSearchChange={handleSearchChange}
          onClubTypeChange={handleClubTypeChange}
          onRecruitmentChange={handleRecruitmentChange}
        />
        <div className="plain" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <img
            src="../../src/assets/images/school_logo.png"
            alt="Clubing"
            style={{ width: '100px', marginRight: '10px' }}
          />
          <div>
            <h1 className="제목" style={{ margin: 10 }}>아주대학교-동아리/소학회</h1>
            <p className="설명" style={{ margin: 10 }}><strong>'Clubing'</strong>에서 손쉽게 동아리, 소학회를 찾고 가입하세요!</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Sidebar onCategoryClick={handleCategoryClick} />
          <div style={{ flex: 1 }}>
            <div className="category-filter">
              {categories.length > 0 && categories.map((category) => (
                <button key={category} onClick={() => handleCategoryClick(category)}>
                  {category}
                </button>
              ))}
            </div>

            <div className="club-list">
              {filteredClubs.map(club => (
                <div key={club.id} className="club-item">
                  <img src={club.image} alt={club.clubName} className="club-image" />
                  <h3>{club.clubName}</h3>
                  <p><strong>카테고리:</strong> {club.category}</p>
                  <p><strong>모집 상태:</strong> {club.recruitmentStatus}</p>
                  <p><strong>소개:</strong> {club.intro.slice(0, 100)}...</p>
                </div>
              ))}
            </div>

            {/* react-js-pagination 적용 */}
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={clubsPerPage}
              totalItemsCount={allClubs.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              prevPageText="<"
              nextPageText=">"
              firstPageText="<<"
              lastPageText=">>"
              itemClass="page-item"
              linkClass="page-link"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
