import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import axios from 'axios';
import '../../styles/Main/Main.css';

//todo:화면에 다담기게
//todo:검색에 태그검색 추가
const Main = ({ selectedCategory }) => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [recruitmentStatus, setRecruitmentStatus] = useState('전체');
  const [clubType, setClubType] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 6;
  const navigate = useNavigate();

  console.log( setClubType, setSearchTerm, setRecruitmentStatus);

  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // ✅ 전화번호 인증 관련 추가
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [managerAuthSent, setManagerAuthSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showManagerAuthForm, setShowManagerAuthForm] = useState(false); // ✨추가

  console.log(isVerified)

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
    setShowContactInfo(false);

    // 모달 열 때 초기화
    setPhoneNumber('');
    setVerificationCode('');
    setIsVerified(false);
    setManagerAuthSent(false);
    setShowManagerAuthForm(false); // 추가
  };

  const closeModal = () => {
    setSelectedClub(null);
    setIsModalOpen(false);
    setShowContactInfo(false);
  };


  const handleApplyClick = () => {
    if (selectedClub) {
      navigate(`/main/${selectedClub.id}/application`);
    } else {
      alert('가입할 수 없습니다.');
    }
  };

  const handleContactClick = () => {
    setShowContactInfo(true); 
  };
  

  const handleManagerAuthRequest = async () => {
    if (!phoneNumber) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const cleanedPhone = phoneNumber.trim();

      await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/request`,
        { phoneNumber: cleanedPhone },
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      alert("인증 코드가 발송되었습니다.");
      setManagerAuthSent(true);
    } catch (err) {
      console.error("임원진 인증 요청 실패:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403 && message?.includes("already verified")) {
        alert("이미 임원진 인증이 완료된 사용자입니다.");
      } else {
        alert("전화번호가 일치하지 않거나 인증 요청에 실패했습니다.");
      }
    }
  };
  
  const handleManagerAuthVerify = async () => {
    if (!phoneNumber || !verificationCode) {
      alert("전화번호와 인증코드를 모두 입력해주세요.");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const cleanedPhone = phoneNumber.trim();

      await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/verify`,
        { phoneNumber: cleanedPhone, code: verificationCode },
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      alert("✅ 임원진 인증이 완료되었습니다.");
      setIsVerified(true);
    } catch (err) {
      console.error("임원진 인증 실패:", err);
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 403 && message?.includes("already verified")) {
        alert("이미 인증이 완료된 사용자입니다.");
      } else if (status === 403 && message?.includes("expired")) {
        alert("인증 코드가 만료되었습니다. 다시 요청해주세요.");
      } else if (status === 401 && message?.includes("invalid")) {
        alert("인증 코드가 올바르지 않습니다.");
      } else {
        alert("인증에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };
  

  return (
    <div className="main-container">
      <div className="content">
        <img
          src="/logo.png"
          alt="logo"
          width="150px"
          style={{ cursor: 'pointer', marginRight: '30px' }}
        />
        <div className="text-block">
          <h1>아주대학교 - 동아리</h1>
          <p>
            <strong>'Clubing'</strong>에서 손쉽게 동아리를 찾고 가입하세요!<br />
            카카오, 엑셀, 교내 시스템 등 번거로웠던 동아리 인원 관리를 간편하게 하세요!
          </p>
        </div>
      </div>

      <div className="content-wrapper">
        <div className="club-section">
          <div className="club-list">
            {currentClubs.map((club) => (
              <div
                key={club.id}
                className="club-item"
                style={{ cursor: 'pointer' }}
                onClick={() => openModal(club)}
              >
                {/* 이미지 추가 */}
      {club.imaUrl && (
        <img
          src={club.imaUrl}
          alt={`${club.name} 로고`}
          style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }}
        />
      )}
                <h2>{club.name}</h2>
                <p><strong>위치:</strong> {club.location}</p>
                <p><strong>소개:</strong> {club.description}</p>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
  <strong>키워드: </strong>
  {club.keyword && club.keyword.split(' ').map((word, idx) => (
    <span key={idx} className="keyword-tag">{word}</span>
  ))}
</div>

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

      {isModalOpen && selectedClub && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="modal-close" onClick={closeModal}>×</button>

      {/* ✨ 이미지 출력 */}
      {selectedClub.imaUrl && (
        <img
          src={selectedClub.imaUrl}
          alt={`${selectedClub.name} 로고`}
          style={{
            width: '80%',
            maxWidth: '300px',
            height: 'auto',
            marginTop: '20px',
            marginBottom: '20px',
            borderRadius: '10px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        />
      )}

      <h2>{selectedClub.name}</h2>
      <p><strong>위치:</strong> {selectedClub.location}</p>
      <p><strong>소개:</strong> {selectedClub.description}</p>

      {/* ✨ 키워드 */}
      <div style={{ marginTop: '10px', marginBottom: '10px' }}>
        <strong>키워드: </strong>
        {selectedClub.keyword && selectedClub.keyword.split(' ').map((word, idx) => (
          <span key={idx} className="keyword-tag">{word}</span>
        ))}
      </div>

      {/* ✨ SNS 링크 */}
      {selectedClub.snsUrl && (
        <p style={{ marginTop: '15px' }}>
          🔗 <strong>SNS:</strong> <a href={selectedClub.snsUrl} target="_blank" rel="noopener noreferrer">{selectedClub.snsUrl}</a>
        </p>
      )}

      {/* 버튼 영역 */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button onClick={handleContactClick} className="modal-btn">문의하기</button>
        <button onClick={handleApplyClick} className="modal-btn apply">
          가입하기
        </button>
        <button onClick={() => setShowManagerAuthForm(true)} className="modal-btn">
          임원진 인증하기
        </button>
      </div>

      {/* ✨ 임원진 인증 영역 (필요한 사람만 별도로) */}
      {showManagerAuthForm && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="전화번호 입력"
            style={{ padding: '8px' }}
            disabled={managerAuthSent}
          />
          {!managerAuthSent ? (
            <button onClick={handleManagerAuthRequest} className="modal-btn">
              인증코드 발송
            </button>
          ) : (
            <>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="인증코드 입력"
                style={{ padding: '8px' }}
              />
              <button onClick={handleManagerAuthVerify} className="modal-btn">
                인증코드 확인
              </button>
            </>
          )}
        </div>
      )}

      {/* 문의 연락처 */}
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
