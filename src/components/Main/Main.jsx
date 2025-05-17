// src/pages/Main.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useOutletContext, useNavigate } from 'react-router-dom';
import '../../styles/Main/Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [allClubs, setAllClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layout에서 전달된 필터 상태
  const { searchTerm, recruitStatus, selectedCategory } = useOutletContext();

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllClubs(res.data.data);
      } catch (err) {
        console.error('클럽 목록 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchClubs();
  }, []);

  if (loading) return <p className="loading">로딩 중...</p>;

  // 필터링 로직
  const filtered = allClubs
    .filter(club =>
      club.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(club =>
      recruitStatus === '전체' || club.status === recruitStatus
    )
    .filter(club =>
      selectedCategory.length === 0 || selectedCategory.includes(club.category)
    );

  return (
    <div className="club-list">
      {filtered.length === 0 ? (
        <p className="no-results">검색 결과가 없습니다.</p>
      ) : (
        filtered.map(club => (
          <div
            key={club.id}
            className="club-card"
            onClick={() => navigate(`/clubs/${club.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <h3>{club.name}</h3>
            <p>카테고리: {club.category}</p>
            <p>키워드: {club.keyword}</p>
            <p>상태: {club.status}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Main;
