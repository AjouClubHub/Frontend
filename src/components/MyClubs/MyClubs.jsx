import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/MyClubs/Myclubs.css";

const MyClubs = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchJoinedClubs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/my/clubs`,
          {
            headers: { Authorization: `Bearer Bearer ${token}` },
          }
        );

        setJoinedClubs(res.data?.data || []);
      } catch (err) {
        console.error("가입된 클럽 목록 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedClubs();
  }, []);

  if (loading) return <div>📡 로딩 중...</div>;

  return (
    <div className="myclubs-container">
      <h2>내 클럽</h2>

      <hr className="divider" />

      <div className="club-list">
        {joinedClubs.length === 0 ? (
          <p>가입된 클럽이 없습니다.</p>
        ) : (
          joinedClubs.map((club) => (
            <div
              className="club-card"
              key={club.membershipId}
              onClick={() => navigate(`/myclubs/${club.clubId}`)}
              style={{ cursor: "pointer" }} // 클릭 가능하게 표시
            >
              <img
                src="/default-club.png"
                alt={club.ClubName}
                className="club-image"
              />
              <h3>{club.ClubName}</h3>
              <p>
                <strong>설명:</strong> {club.description}
              </p>
              <p>
                <strong>동방위치:</strong> {club.location}
              </p>
              <p>
                <strong>가입일:</strong>{" "}
                {new Date(club.joinedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyClubs;
