import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from 'react-js-pagination';
import { useNavigate } from 'react-router-dom';
import '../../styles/Main/Main.css';

export default function GuestMain() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 6;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs`);
        setClubs(res.data.data || []);
        console.log("클럽 목록 조회",res.data)
      } catch (e) {
        console.error('승인된 클럽 조회 실패', e);
        setClubs([]);
        
      }
    })();
  }, []);

  // 단순 페이징
  useEffect(() => {
    const start = (page - 1) * perPage;
    setFiltered(clubs.slice(start, start + perPage));
  }, [clubs, page]);

  return (
    <div className="main-container">
      <div className="club-list">
        {filtered.map(club => (
          <div key={club.id} className="club-item" onClick={() => navigate(`/main/${club.id}`)}>
            {club.imaUrl && <img src={club.imaUrl} alt={club.name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />}
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
  );
}
