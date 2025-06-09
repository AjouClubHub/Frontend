// src/components/Main/GuestMain.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { useNavigate, useOutletContext } from 'react-router-dom';
import '../../styles/Main/Main.css';

export default function GuestMain() {
  const navigate = useNavigate();

  // Layout에서 내려준 검색어·상태·카테고리 가져오기
  const { searchTerm, recruitStatus, selectedCategory } = useOutletContext();

  const [clubs, setClubs] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 6;

  // 1) 전체 클럽 목록 로드
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs`);
        setClubs(res.data.data || []);
      } catch (e) {
        console.error('승인된 클럽 조회 실패', e);
        setClubs([]);
      }
    })();
  }, []);

  // 2) 필터 → 페이징 적용
  useEffect(() => {
    let filtered = clubs;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(c =>
        c.name?.includes(searchTerm) ||
        c.description?.includes(searchTerm)
      );
    }

    // 모집 상태 필터 (status 필드가 있으면 적용)
    if (recruitStatus && recruitStatus !== '전체') {
      filtered = filtered.filter(c => c.status === recruitStatus);
    }

    // 카테고리 필터 (category 필드가 있으면 적용)
    if (selectedCategory) {
      filtered = filtered.filter(c => c.category === selectedCategory);
    }

    // 페이징
    const start = (page - 1) * perPage;
    setDisplayed(filtered.slice(start, start + perPage));
  }, [clubs, searchTerm, recruitStatus, selectedCategory, page]);

  return (
    <div className="main-container flex">
      {/* 상단 로고 & 소개 */}
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
            <strong>'Clubing'</strong>에 회원가입 후 손쉽게 동아리를 찾고 가입하세요!
            <br />
            번거로운 관리, 이젠 간편하게.
          </p>
        </div>
      </div>

      {/* 클럽 카드 리스트 */}
      <div className="club-list-wrapper">
        <div className="club-list">
          {displayed.map(club => (
            <div
              key={club.id}
              className="club-item"
              onClick={() => navigate(`/main/${club.id}`)}
            >
              {club.imgUrl && (
                <img
                  src={club.imgUrl}
                  alt={club.name}
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
            </div>
          ))}
          {clubs.length === 0 && <p>승인된 클럽이 없습니다.</p>}
        </div>

        {/* 페이지네이션 */}
        {clubs.length > perPage && (
          <div className="pagination-wrapper">
            <Pagination
              activePage={page}
              itemsCountPerPage={perPage}
              totalItemsCount={clubs.length}
              pageRangeDisplayed={5}
              onChange={p => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
