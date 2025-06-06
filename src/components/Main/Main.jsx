import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext, useLocation } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import axios from 'axios';
import '../../styles/Main/Main.css';
import InputMask from 'react-input-mask';

export default function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, recruitStatus, selectedCategory } = useOutletContext();

  const [allClubs, setAllClubs] = useState([]);
  const [recruitments, setRecruitments] = useState([]);
  const [recruitMap, setRecruitMap] = useState({});
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);

  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [managerAuthSent, setManagerAuthSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showManagerAuthForm, setShowManagerAuthForm] = useState(false);

  useEffect(() => {
    if (location.state?.resetPage) {
      setCurrentPage(1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // 검색/카테고리 변경 → 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      const authHeader = `Bearer Bearer ${token}`;
      const catParam = selectedCategory || '';

      // 1) 클럽 목록 조회
      let clubsData = [], clubsTotal = 0;
      try {
        if (!searchTerm && !catParam) {
          // 검색어와 카테고리가 없으면 전체 클럽 조회
          const res = await axios.get(
            `${import.meta.env.VITE_APP_URL}/api/clubs`,
            { headers: { Authorization: authHeader } }
          );
          const data = res.data?.data || res.data || [];
          clubsData = Array.isArray(data) ? data : [];
          clubsTotal = clubsData.length;
        } else {
          // 카테고리 파라미터만 적용 (검색어는 클라이언트 필터링에서 처리)
          const res = await axios.get(
            `${import.meta.env.VITE_APP_URL}/api/clubs`,
            {
              headers: { Authorization: authHeader },
              params: catParam ? { category: catParam } : {}
            }
          );
          const raw = res.data?.data;
          if (Array.isArray(raw)) {
            clubsData = raw;
            clubsTotal = raw.length;
          } else {
            clubsData = Array.isArray(raw?.content) ? raw.content : [];
            clubsTotal = typeof raw?.totalElements === 'number'
              ? raw.totalElements
              : clubsData.length;
          }
        }
      } catch {
        // 실패 시 빈 배열로 처리
        clubsData = [];
        clubsTotal = 0;
      }

      setAllClubs(clubsData);
      setTotalCount(clubsTotal);

      // 2) 개별 모집공고 단건 조회 (병렬 처리 + Promise.allSettled)
      const recruitPromises = clubsData.map(club =>
        axios
          .get(
            `${import.meta.env.VITE_APP_URL}/api/clubs/${club.id}/recruitment`,
            { headers: { Authorization: authHeader } }
          )
          .then(res => ({ id: club.id, data: res.data.data }))
          .catch(() => {
            // 404 등 에러 시 null 처리 (콘솔에 찍지 않음)
            return { id: club.id, data: null };
          })
      );

      try {
        const results = await Promise.allSettled(recruitPromises);
        const newRecMap = {};
        results.forEach(item => {
          if (item.status === 'fulfilled') {
            const { id, data } = item.value;
            newRecMap[id] = data;
          } else {
            // allSettled 중 item.status가 rejected인 경우도 빈 데이터로 처리 (로그 X)
          }
        });
        setRecruitMap(newRecMap);
      } catch {
        // 병렬 조회 자체가 실패하면 빈 맵 처리
        setRecruitMap({});
      }

      // 3) 전체 모집공고 리스트 조회 (필터링용)
      let recEndpoint = '/api/recruitments';
      if (recruitStatus === '모집중') recEndpoint = '/api/recruitments/open';
      else if (recruitStatus === '모집마감') recEndpoint = '/api/recruitments/closed';
      try {
        const recRes = await axios.get(
          `${import.meta.env.VITE_APP_URL}${recEndpoint}`,
          { headers: { Authorization: authHeader } }
        );
        const recData = recRes.data?.data || recRes.data || [];
        setRecruitments(recData);
      } catch {
        setRecruitments([]);
      }
    };

    fetchData()
      .finally(() => setIsLoading(false));
  }, [searchTerm, selectedCategory, recruitStatus, currentPage]);
 
  useEffect(() => {
    let tmp = [...allClubs];

  
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      tmp = tmp.filter(c => {
        return (
          (c.name && c.name.toLowerCase().includes(lower)) ||
          (c.keyword && c.keyword.toLowerCase().includes(lower))
        );
      });
    }


    if (selectedCategory) {
      tmp = tmp.filter(c => c.category === selectedCategory);
    }


    if (recruitStatus && recruitStatus !== '전체') {
      const allowedIds = new Set(recruitments.map(r => r.clubId ?? r.id));
      tmp = tmp.filter(c => allowedIds.has(c.id));
    }

    setFilteredClubs(tmp);
    setTotalCount(tmp.length);
  }, [allClubs, recruitments, searchTerm, selectedCategory, recruitStatus]);



  const indexLast = currentPage * clubsPerPage;
  const indexFirst = indexLast - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexFirst, indexLast);
  const handlePageChange = page => setCurrentPage(page);


  const openModal = club => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setShowContactInfo(false);
    setPhoneNumber('');
    setVerificationCode('');
    setManagerAuthSent(false);
    setIsVerified(localStorage.getItem(`club-${club.id}-verified`) === 'true');
    setShowManagerAuthForm(false);
  };
  const closeModal = () => setIsModalOpen(false);

  // 문의하기 / 가입하기
  const handleContactClick = () => setShowContactInfo(true);
  const handleApplyClick = () => {
    closeModal();
    navigate(`/main/${selectedClub.id}/application`);
  };

  // 임원진 인증 요청
  const handleManagerAuthRequest = async () => {
    if (!phoneNumber) return alert('전화번호를 입력해주세요.');
    const authHeader = `Bearer Bearer ${localStorage.getItem('accessToken')}`;
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/request`,
        { phoneNumber },
        { headers: { Authorization: authHeader } }
      );
      setManagerAuthSent(true);
      alert('인증 코드가 발송되었습니다.');
    } catch (err) {
      console.error('인증 요청 실패:', err);
      alert('인증 요청 중 오류가 발생했습니다.');
    }
  };

  // 임원진 인증 확인
  const handleManagerAuthVerify = async () => {
    if (!verificationCode) return alert('인증 코드를 입력하세요.');
    const authHeader = `Bearer Bearer ${localStorage.getItem('accessToken')}`;
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/verify`,
        { phoneNumber, code: verificationCode },
        { headers: { Authorization: authHeader } }
      );
      localStorage.setItem(`club-${selectedClub.id}-verified`, 'true');
      setIsVerified(true);
      alert('임원진 인증 완료!');
    } catch (err) {
      console.error('인증 검증 실패:', err);
      alert('인증 코드 확인 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="main-container">
      {/* 헤더 */}
      <div className="content">
        <img
          src="/logo.png"
          alt="logo"
          width={150}
          style={{ cursor: 'pointer', marginRight: 30 }}
          onClick={() => navigate('/main/home', { state: { resetPage: true } })}
        />
        <div className="text-block">
          <h1>아주대학교 - 동아리</h1>
          <p>
            <strong>'Clubing'</strong>에서 손쉽게 동아리를 찾고 가입하세요!<br/>
            번거로운 관리, 이젠 간편하게.
          </p>
        </div>
      </div>

      {/* 클럽 리스트 */}
      <div className="club-list">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : currentClubs.length === 0 ? (
          <p>조건에 맞는 동아리가 없습니다.</p>
        ) : (
          currentClubs.map(club => {
            const rec = recruitMap[club.id];
            return (
              <div
                key={club.id}
                className="club-item"
                onClick={() => openModal(club)}
              >
                {club.imaUrl && (
                  <img
                    src={club.imaUrl}
                    alt={`${club.name} 로고`}
                    style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                  />
                )}
                <h2>{club.name}</h2>
                <p><strong>위치:</strong> {club.location}</p>
                <p><strong>소개:</strong> {club.description}</p>
                <div style={{ margin: '10px 0' }}>
                  <strong>키워드:</strong>{' '}
                  {club.keyword?.split(' ').map((w, i) => (
                    <span key={i} className="keyword-tag">{w}</span>
                  ))}
                </div>
                <div className="card-recruit">
                  {rec ? (
                    <>
                      <p><strong>모집공고:</strong> {rec.title}</p>
                      <p>{rec.alwaysOpen ? '[상시모집]' : `${rec.startDate} ~ ${rec.endDate}`}</p>
                    </>
                  ) : (
                    <p>모집공고 없음</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 페이지네이션 */}
      {totalCount > clubsPerPage && (
        <div className="pagination-wrapper">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={clubsPerPage}
            totalItemsCount={totalCount}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          />
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && selectedClub && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            {selectedClub.imaUrl && (
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <img
                  src={selectedClub.imaUrl}
                  alt={selectedClub.name}
                  style={{ width: 300, height: 'auto' }}
                />
              </div>
            )}

            <h2>{selectedClub.name}</h2>
            <p><strong>위치:</strong> {selectedClub.location}</p>
            <p><strong>소개:</strong> {selectedClub.description}</p>
            <p><strong>키워드:</strong> {selectedClub.keyword}</p>

            {isVerified ? (
              <button
                className="modal-btn"
                onClick={() => navigate(`/clubsadmin/${selectedClub.id}/recruitcreate`)}
              >
                모집공고 등록하기
              </button>
            ) : (
              <>
                <button
                  className="modal-btn"
                  onClick={() => setShowManagerAuthForm(true)}
                >
                  임원진 인증하기
                </button>
                {showManagerAuthForm && (
                  <div className="auth-form">
                    <InputMask
                      mask="999-9999-9999"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      disabled={managerAuthSent}
                      placeholder="전화번호(-형식)"
                    >
                      {inputProps => (
                        <input
                          {...inputProps}
                          type="text"
                          className="your-input-class"
                        />
                      )}
                    </InputMask>
                    {!managerAuthSent ? (
                      <button onClick={handleManagerAuthRequest}>코드 발송</button>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={e => setVerificationCode(e.target.value)}
                          placeholder="인증 코드"
                        />
                        <button onClick={handleManagerAuthVerify}>코드 확인</button>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

            <button className="modal-btn" onClick={handleContactClick}>문의하기</button>
            {showContactInfo && <p><strong>연락처:</strong> {selectedClub.contactInfo}</p>}
            <button className="modal-btn apply" onClick={handleApplyClick}>가입하기</button>
          </div>
        </div>
      )}
    </div>
  );
}
