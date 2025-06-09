// src/components/Main/Main.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext, useLocation } from "react-router-dom";
import Pagination from "react-js-pagination";
import axios from "axios";
import InputMask from "react-input-mask";
import "../../styles/Main/Main.css";

export default function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const { searchTerm, recruitStatus, selectedCategory } = useOutletContext();

  const [allClubs, setAllClubs] = useState([]);
  const [recruitMap, setRecruitMap] = useState({});
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const clubsPerPage = 6;
  const [isLoading, setIsLoading] = useState(true);

  // Modal & auth
  const [selectedClub, setSelectedClub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [managerAuthSent, setManagerAuthSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showManagerAuthForm, setShowManagerAuthForm] = useState(false);

  // reset page on back-navigation
  useEffect(() => {
    if (location.state?.resetPage) {
      setCurrentPage(1);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // reset page on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, recruitStatus]);

  // 1) fetch all clubs + per-club recruitment map
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const token = localStorage.getItem("accessToken");
      const headers = { Authorization: `Bearer Bearer ${token}` };

      // fetch all clubs
      let clubs = [];
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs`,
          { headers }
        );
        const d = res.data?.data ?? res.data;
        clubs = Array.isArray(d.content) ? d.content : Array.isArray(d) ? d : [];
      } catch (err) {
        console.error("Failed to fetch clubs", err);
      }

      // fetch per-club recruitment for modal/status
      const recMap = {};
      await Promise.all(
        clubs.map(async (club) => {
          try {
            const r = await axios.get(
              `${import.meta.env.VITE_APP_URL}/api/clubs/${club.id}/recruitment`,
              { headers }
            );
            recMap[club.id] = r.data.data;
          } catch {
            recMap[club.id] = null;
          }
        })
      );
      setRecruitMap(recMap);
      setAllClubs(clubs);
      setTotalCount(clubs.length);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // 2) client-side filtering: category + searchTerm + recruitStatus + recMap
  useEffect(() => {
    const lower = (searchTerm || "").toLowerCase();
    const today = new Date();

    const tmp = allClubs.filter((c) => {
      // ① category
      if (selectedCategory && c.category !== selectedCategory) return false;

      // ② search term
      const name = (c.name ?? "").toLowerCase();
      const keyword = (c.keyword ?? "").toLowerCase();
      if (lower && !name.includes(lower) && !keyword.includes(lower)) return false;

      // ③ recruit status
      const rec = recruitMap[c.id];
      if (recruitStatus === "모집중") {
        return (
          rec &&
          !rec.alwaysOpen &&
          new Date(rec.startDate) <= today &&
          today <= new Date(rec.endDate)
        );
      }
      if (recruitStatus === "모집마감") {
        return rec && today > new Date(rec.endDate);
      }
      if (recruitStatus === "상시모집") {
        return rec && rec.alwaysOpen;
      }

      // ④ all
      return true;
    });

    setFilteredClubs(tmp);
    setTotalCount(tmp.length);
    setCurrentPage(1);
  }, [allClubs, searchTerm, selectedCategory, recruitStatus, recruitMap]);

  // pagination
  const indexLast = currentPage * clubsPerPage;
  const indexFirst = indexLast - clubsPerPage;
  const currentClubs = filteredClubs.slice(indexFirst, indexLast);
  const handlePageChange = (page) => setCurrentPage(page);

  // modal handlers
  const openModal = (club) => {
    setSelectedClub(club);
    setIsModalOpen(true);
    setShowContactInfo(false);
    setPhoneNumber("");
    setVerificationCode("");
    setManagerAuthSent(false);
    setIsVerified(localStorage.getItem(`club-${club.id}-verified`) === "true");
    setShowManagerAuthForm(false);
  };
  const closeModal = () => setIsModalOpen(false);

  // contact/apply
  const handleContactClick = () => setShowContactInfo(true);
  const handleApplyClick = () => {
    closeModal();
    navigate(`/main/${selectedClub.id}/application`);
  };

  // manager auth
  const handleManagerAuthRequest = async () => {
    const token = localStorage.getItem("accessToken");
    if (!phoneNumber) return alert("전화번호를 입력해주세요.");
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/request`,
        { phoneNumber },
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      setManagerAuthSent(true);
      alert("인증 코드가 발송되었습니다.");
    } catch {
      alert("인증 요청 중 오류가 발생했습니다.");
    }
  };
  const handleManagerAuthVerify = async () => {
    const token = localStorage.getItem("accessToken");
    if (!verificationCode) return alert("인증 코드를 입력하세요.");
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClub.id}/manager-auth/verify`,
        { phoneNumber, code: verificationCode },
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      localStorage.setItem(`club-${selectedClub.id}-verified`, "true");
      setIsVerified(true);
      alert("임원진 인증 완료!");
    } catch {
      alert("인증 코드 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="content">
        <img
          src="/logo.png"
          alt="logo"
          width={150}
          style={{ cursor: "pointer", marginRight: 30 }}
          onClick={() => navigate("/main/home", { state: { resetPage: true } })}
        />
        <div className="text-block">
          <h1>아주대학교 - 동아리</h1>
          <p>
            <strong>'Clubing'</strong>에서 손쉽게 동아리를 찾고 가입하세요!
            <br />
            번거로운 관리, 이젠 간편하게.
          </p>
        </div>
      </div>

      {/* Club list */}
      <div className="club-list">
        {isLoading ? (
          <p>로딩 중...</p>
        ) : currentClubs.length === 0 ? (
          <p>조건에 맞는 동아리가 없습니다.</p>
        ) : (
          currentClubs.map((club) => {
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
                    style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }}
                  />
                )}
                <h2>{club.name}</h2>
                <p><strong>위치:</strong> {club.location}</p>
                <p><strong>소개:</strong> {club.description}</p>
                <div style={{ margin: "10px 0" }}>
                  <strong>키워드:</strong>{" "}
                  {(club.keyword ?? "").split(" ").map((w, i) => (
                    <span key={i} className="keyword-tag">{w}</span>
                  ))}
                </div>
                <div className="card-recruit">
                  {rec ? (
                    <>
                      <p><strong>모집공고:</strong> {rec.title}</p>
                      <p>{rec.alwaysOpen ? "[상시모집]" : `${rec.startDate} ~ ${rec.endDate}`}</p>
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

      {/* Pagination */}
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

      {/* Modal */}
      {isModalOpen && selectedClub && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            {selectedClub.imaUrl && (
              <div style={{ textAlign: "center", marginBottom: 20 }}>
                <img src={selectedClub.imaUrl} alt={selectedClub.name} style={{ width: 300, height: "auto" }} />
              </div>
            )}
            <h2>{selectedClub.name}</h2>
            <p><strong>위치:</strong> {selectedClub.location}</p>
            <p><strong>소개:</strong> {selectedClub.description}</p>
            <p><strong>키워드:</strong> {selectedClub.keyword}</p>

            {isVerified ? (
              <button className="modal-btn" onClick={() => navigate(`/clubsadmin/${selectedClub.id}/recruitcreate`)}>모집공고 등록하기</button>
            ) : (
              <>
                <button className="modal-btn" onClick={() => setShowManagerAuthForm(true)}>임원진 인증하기</button>
                {showManagerAuthForm && (
                  <div className="auth-form">
                    <InputMask mask="999-9999-9999" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={managerAuthSent} placeholder="전화번호(-형식)">
                      {(props) => <input {...props} type="text" className="your-input-class" />}
                    </InputMask>
                    {!managerAuthSent ? (
                      <button onClick={handleManagerAuthRequest}>코드 발송</button>
                    ) : (
                      <>
                        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="인증 코드" />
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
