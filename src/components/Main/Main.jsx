import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import axios from 'axios';
import '../../styles/Main/Main.css';

const Main = () => {
  const [allClubs, setAllClubs] = useState([]);
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [recruitmentStatus, setRecruitmentStatus] = useState('전체');
  const [filterRecruits,setFilteredRecruits] = useState([]);
  const [clubType, setClubType] = useState('전체');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [managerAuthSent, setManagerAuthSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showManagerAuthForm, setShowManagerAuthForm] = useState(false);

  console.log(setRecruitmentStatus,setClubType,filterRecruits)

  const navigate = useNavigate();

  const {searchTerm, recruitStatus, selectedCategory} = useOutletContext();
  const clubsPerPage = 6;

  useEffect(() => {
    const fetchClubs = async () => {
      const token = localStorage.getItem('accessToken');
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
    };
    fetchClubs();
  }, []);


useEffect(() => {
  (async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/recruitments`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      const data = res.data.data || [];
      
      // 오늘 날짜 (시간 제거)
      const today = new Date().toISOString().split('T')[0];

      // 상태별 필터링
      const filtered = data.filter(r => {
        const { alwaysOpen, startDate, endDate } = r;
        switch (recruitStatus) {
          case '전체':
            return true;
          case '상시모집':
            return alwaysOpen === true;
          case '모집중':
            // 상시모집이거나, 기간 내
            return alwaysOpen === true ||
                   (startDate <= today && today <= endDate);
          case '모집마감':
            // 상시모집이 아니고, 기간 지난 경우
            return alwaysOpen === false &&
                   today > endDate;
          default:
            return true;
        }
      });

      setRecruitments(data);
      setFilteredRecruits(filtered);
    } catch (err) {
      console.error('모집공고 조회 실패:', err);
    }
  })();
}, [recruitStatus]);


  useEffect(() => {
    let filtered = allClubs;
    if (searchTerm) filtered = filtered.filter(club => club.name.toLowerCase().includes(searchTerm.toLowerCase()));
    if (selectedCategory.length > 0) filtered = filtered.filter(club => selectedCategory.includes(club.category));
    if (recruitmentStatus !== '전체') filtered = filtered.filter(club => club.status === recruitmentStatus);
    if (clubType !== '전체') filtered = filtered.filter(club => club.type === clubType);
    setFilteredClubs(filtered);
  }, [searchTerm, selectedCategory, recruitmentStatus, clubType, allClubs]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const currentClubs = filteredClubs.slice((currentPage - 1) * clubsPerPage, currentPage * clubsPerPage);

  const openModal = (club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setShowContactInfo(false);
    setPhoneNumber('');
    setVerificationCode('');
    setIsVerified(false);
    setManagerAuthSent(false);
    setShowManagerAuthForm(false);
  };

  const closeModal = () => {
    setSelectedClub(null);
    setIsModalOpen(false);
    setShowContactInfo(false);
  };

  const handleApplyClick = () => {
    if (selectedClub) {
      closeModal();
      navigate(`/main/${selectedClub.id}/application`);
    }
  };

  const handleContactClick = () => setShowContactInfo(true);

  const handleManagerAuthRequest = async () => {
    if (!phoneNumber) return alert("전화번호를 입력해주세요.");
    const token = localStorage.getItem("accessToken");
    const cleanedPhone = phoneNumber.trim();
    try {
      await axios.post(`${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/request`, { phoneNumber: cleanedPhone }, { headers: { Authorization: `Bearer ${token}` } });
      alert("인증 코드가 발송되었습니다.");
      setManagerAuthSent(true);
    } catch (err) {
      alert("전화번호가 일치하지 않거나 인증 요청에 실패했습니다.", err);
    }
  };

  const handleManagerAuthVerify = async () => {
    if (!phoneNumber || !verificationCode) return alert("전화번호와 인증코드를 모두 입력해주세요.");
    const token = localStorage.getItem("accessToken");
    const cleanedPhone = phoneNumber.trim();
    try {
      await axios.patch(`${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/verify`, { phoneNumber: cleanedPhone, code: verificationCode }, { headers: { Authorization: `Bearer ${token}` } });
      alert("✅ 임원진 인증이 완료되었습니다.");
      setIsVerified(true);
    } catch {
      alert("인증 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="main-container">
       {/* 🔽 소개 영역 추가 */}
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
            {currentClubs.map((club) => {
              const clubRecruitments = recruitments.filter(r => r.clubName === club.name);
              return (
                <div key={club.id} className="club-item" onClick={() => openModal(club)}>
                  {club.imaUrl && <img src={club.imaUrl} alt={`${club.name} 로고`} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />}
                  <h2>{club.name}</h2>
                  <p><strong>위치:</strong> {club.location}</p>
                  <p><strong>소개:</strong> {club.description}</p>
                  <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <strong>키워드: </strong>
                    {club.keyword && club.keyword.split(' ').map((word, idx) => (
                      <span key={idx} className="keyword-tag">{word}</span>
                    ))}
                  </div>
                  {clubRecruitments.length > 0 && (
                    <div className="recruitment-section">
                      <strong>📢 모집 공고</strong>
                      <ul>
                        {clubRecruitments.map((r) => (
                          <li key={r.id}>{r.title} <br />({r.startDate} ~ {r.endDate})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
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
            {selectedClub.imaUrl && (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <img src={selectedClub.imaUrl} alt={selectedClub.name} style={{ width: '300px', height: 'auto' }} />
  </div>
)}

            <h2>{selectedClub.name}</h2>
            <p><strong>위치:</strong> {selectedClub.location}</p>
            <p><strong>소개:</strong> {selectedClub.description}</p>
            <p><strong>키워드:</strong> {selectedClub.keyword}</p>
            {selectedClub.snsUrl && (
              <div>
                <strong>SNS 주소:</strong>
                <a href={selectedClub.snsUrl} target="_blank" rel="noopener noreferrer">
                  {selectedClub.snsUrl}
                </a>
              </div>
            )}

            {isVerified && (
              <button className="modal-btn" onClick={() => navigate(`/clubsadmin/${selectedClub.id}/recruitcreate`)}>모집공고 등록하기</button>
            )}
            <button className="modal-btn" onClick={handleContactClick}>문의하기</button>
            <button className="modal-btn apply" onClick={handleApplyClick}>가입하기</button>
            <button className="modal-btn" onClick={() => setShowManagerAuthForm(true)}>임원진 인증하기</button>
            {showContactInfo && <p><strong>회장 연락처:</strong> {selectedClub.contactInfo}</p>}
            {showManagerAuthForm && (
              <div>
                <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="전화번호 입력" disabled={managerAuthSent} />
                {!managerAuthSent ? (
                  <button onClick={handleManagerAuthRequest}>인증코드 발송</button>
                ) : (
                  <>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증코드 입력" />
                    <button onClick={handleManagerAuthVerify}>인증코드 확인</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
