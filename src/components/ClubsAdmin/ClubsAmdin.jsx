import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "react-js-pagination";
import axios from "axios"; // ✨ axios import 추가
import "../../styles/ClubsAdmin/ClubsAdmin.css";

//todo: UI 개선 -> 좀 허전?
const ClubsAdmin = () => {
  const navigate = useNavigate();
  const [myCreatedClubs, setMyCreatedClubs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  useEffect(() => {
    const fetchMyClubs = async () => {
      const token = localStorage.getItem("accessToken"); // ✨ 토큰 꺼내오기
      try {
        const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/my/manage-clubs`, {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        });

        console.log("✅ 내가 관리하는 클럽 데이터:", res.data.data);
        setMyCreatedClubs(res.data.data);
      } catch (err) {
        console.error("❌ 클럽 목록 불러오기 실패:", err.response?.data || err.message);
      }
    };

    fetchMyClubs();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentClubs = myCreatedClubs.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="myclubs-container">
      <h2>내가 관리 중인 동아리</h2>

      <div className="club-list">
  {currentClubs.map((club) => (
    <div
      key={club.id}
      className="club-card"
      onClick={() => navigate(`/clubsadmin/${club.id}`)}
      style={{ cursor: 'pointer', border: '1px solid #ccc', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}
    >
      {/* ✅ 이미지 추가 */}
      {club.imaUrl && (
        <img
          src={club.imaUrl}
          alt={`${club.name} 로고`}
          style={{
            width: '100%',
            height: '180px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '12px'
          }}
        />
      )}

      <h3>{club.name}</h3>
      <p><strong>소개:</strong> {club.description}</p>
      <p><strong>동방 위치:</strong> {club.location}</p>
      <p><strong>키워드:</strong> {club.keyword}</p>
      <p><strong>총 인원:</strong> {club.memberCount}명</p>
      <p><strong>승인 대기:</strong> {club.pendingApplications}명</p>
      <p><strong>공지사항 수:</strong> {club.announcementCount}개</p>
    </div>
  ))}
</div>


      {myCreatedClubs.length > itemsPerPage && (
        <div className="pagination-wrapper">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={itemsPerPage}
            totalItemsCount={myCreatedClubs.length}
            pageRangeDisplayed={5}
            onChange={setCurrentPage}
            prevPageText={"‹"}
            nextPageText={"›"}
            firstPageText={"«"}
            lastPageText={"»"}
          />
        </div>
      )}
    </div>
  );
};

export default ClubsAdmin;
