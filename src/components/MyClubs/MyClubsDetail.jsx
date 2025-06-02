import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/ClubsAdmin/ClubsAdminDetail.css"; // 동일한 스타일 사용

const MyClubsDetail = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClubDetail = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/my/clubs/${clubId}`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setClub(res.data.data);
        console.log("클럽 단건 조회",res.data.data)
      } catch (err) {
        console.error("가입한 클럽 상세정보 불러오기 실패:", err);
        setClub(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClubDetail();
  }, [clubId]);

  const isActive = (tab) => location.pathname.includes(tab);

  if (loading) return <div>📡 로딩 중...</div>;
  if (!club) return <div>❌ 존재하지 않는 클럽입니다.</div>;

  return (
    <div className="clubs-admin-detail-wrapper">
      {/* 상단 탭 */}
      <div className="clubs-sub-navbar">
        <button
          className={isActive("notice") ? "active" : ""}
          onClick={() => navigate(`/myclubs/${clubId}/notice`)}
        >
          공지사항
        </button>
        <button
          className={isActive("recruit") ? "active" : ""}
          onClick={() => navigate(`/myclubs/${clubId}/recruit`)}
        >
          일정
        </button>
        <button
          className={isActive("member") ? "active" : ""}
          onClick={() => navigate(`/myclubs/${clubId}/member`)}
        >
          멤버
        </button>
      </div>

      <div className="clubs-admin-detail-container">
        <aside className="club-sidebar">
          <h3>{club.ClubName || club.name}</h3>
          <p><strong>설명:</strong> {club.description}</p>
          <p><strong>동방 위치:</strong> {club.location}</p>
          <p><strong>연락처:</strong> {club.contactInfo}</p>
          <p><strong>가입일:</strong> {new Date(club.joinedAt).toLocaleDateString()}</p>
        </aside>

        <main className="club-main">
          <div className="detail-content">
            <Outlet context={{ isManager: false }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyClubsDetail;
