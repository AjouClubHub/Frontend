import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation ,useOutletContext} from "react-router-dom";
import axios from "axios";
import "../../styles/Member/MemberList.css";

const MemberList = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {isManager} = useOutletContext();

  useEffect(() => {
    const fetchMembers = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/members`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setMembers(res.data.data || []);
      } catch (err) {
        console.error("멤버 목록 조회 실패:", err);
        setError("멤버 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [clubId]);

  const goToMember = () => {
    navigate(`/clubsadmin/${clubId}/member`);
  };

  const goToMemberNew = () => {
    navigate(`/clubsadmin/${clubId}/membernew`);
  };

  if (loading) return <div>📡 로딩 중...</div>;
  if (error) return <div>❌ {error}</div>;

  return (
    <div className="member-list">
      <div className="member-header">
        <h2>👥 클럽 멤버 목록</h2>
        <div className="member-filter-buttons">
          <button
            className={location.pathname.includes("membernew") ? "" : "active"}
            onClick={goToMember}
          >
            기존 멤버
          </button>
          {isManager && (
  <button
    className={location.pathname.includes("membernew") ? "active" : ""}
    onClick={goToMemberNew}
  >
    신청 관리
  </button>
)}

        </div>
      </div>

      {members.length === 0 ? (
        <p>현재 가입된 멤버가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>학번</th>
              <th>전공</th>
              <th>가입일</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
              key={member.memberId}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/clubsadmin/${clubId}/member/${member.memberId}`)}
            >
                <td>{member.name}</td>
                <td>{member.studentId}</td>
                <td>{member.major}</td>
                <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MemberList;
