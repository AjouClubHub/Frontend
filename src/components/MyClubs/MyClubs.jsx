import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate ,useParams } from "react-router-dom";
import "../../styles/MyClubs/Myclubs.css";

const MyClubs = () => {
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]); // 신청 현황 상태
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [selectedClubId, setSelectedClubId] = useState(null); // 선택된 클럽 ID
  const [leavenReason, setLeavenReason] = useState(""); // 탈퇴 사유
  const [rejectionReason, setRejectionReason] = useState(""); // 거절 사유
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false); // 거절 사유 모달 상태
  const navigate = useNavigate();
  const { clubId } = useParams();

  const token = localStorage.getItem("accessToken");

  // 클럽 목록과 신청 현황 데이터를 로드하는 useEffect
  useEffect(() => {
    const fetchJoinedClubs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/my/clubs`,
          {
            headers: { Authorization: `Bearer Bearer ${token}` },
          }
        );
        setJoinedClubs(res.data?.data || []);
        console.log("가입된 목록", res.data); // 디버그용 로그
      } catch (err) {
        console.error("가입된 클럽 목록 불러오기 실패:", err);
      }
    };

    const fetchApplicationStatus = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/my/applications`,
          {
            headers: { Authorization: `Bearer Bearer ${token}` },
          }
        );
        setApplicationStatus(res.data?.data || []);
        console.log("신청 현황", res.data); // 디버그용 로그
      } catch (err) {
        console.error("클럽 신청 현황 불러오기 실패:", err);
      }
    };

    fetchJoinedClubs();
    fetchApplicationStatus();

    // 데이터 로딩이 완료되면 로딩 상태 변경
    setLoading(false);

  }, [token]); // token이 변경될 때마다 호출

   // 신청 취소 처리 함수
   const handleCancelApplication = async (applicationId) => {
    try {
     await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${applicationId}`,
        {
          headers: { Authorization: `Bearer Bearer ${token}` },
        }
      );
      alert("가입 신청이 취소되었습니다.");
      // 신청 취소 후 클럽 목록 새로고침
      setApplicationStatus((prevStatus) =>
        prevStatus.filter((application) => application.applicationId !== applicationId)
      );
    } catch (err) {
      console.error("가입 신청 취소 실패:", err);
      alert("가입 신청 취소에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 거절 사유를 조회하는 함수
  const getRejectionReason = async (applicationId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/my/applications/${applicationId}/rejection`,
        {
          headers: { Authorization: `Bearer Bearer ${token}` },
        }
      );
      console.log("거절사유 api",res.data)
      setRejectionReason(res.data?.data?.rejectionReason || "사유 없음");
      setIsRejectionModalOpen(true); // 거절 사유 모달 열기
      
    } catch (err) {
      console.error("거절 사유 조회 실패:", err);
      setRejectionReason("거절 사유를 불러오지 못했습니다.");
      setIsRejectionModalOpen(true); // 거절 사유 모달 열기
    }
  };

  const handleWithdraw = async () => {
    if (!leavenReason) {
      alert("탈퇴 사유를 입력해야 합니다.");
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClubId}/withdraw`,
        {
          headers: { Authorization: `Bearer Bearer ${token}` },
          data: { leavenReason },
        }
      );
      alert(response.data.message);
      setJoinedClubs((prevClubs) =>
        prevClubs.filter((club) => club.clubId !== selectedClubId)
      );
      closeModal();
    } catch (err) {
      console.error("클럽 탈퇴 실패:", err);
      alert("탈퇴 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const openModal = (clubId) => {
    setSelectedClubId(clubId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setLeavenReason("");
  };

  // 신청 상태와 거절 사유 표시
  const getApplicationStatusForClub = (clubName, applicationId) => {
    const application = applicationStatus.find(
      (app) => app.clubName.toLowerCase() === clubName.toLowerCase()
    );

    if (application) {
      if (application.status === "PENDING") {
        return (
          <div className="status-banner status-pending">신청 대기 중
             <button
              onClick={() => handleCancelApplication(application.applicationId, application.clubId)}
              className="cancel-application-btn"
            >
              신청 취소
            </button></div>
        );
      } else if (application.status === "APPROVED") {
        return (
          <div className="status-banner status-approved">승인 완료</div>
        );
      } else if (application.status === "REJECTED") {
        return (
          <div className="status-banner status-rejected">
          신청 거절
          {/* 여기에 텍스트와 버튼을 감싸는 div 요소 추가 */}
          <div className="rejection-info">
            <button
              onClick={() => getRejectionReason(applicationId)}
              className="rejection-button"
            >
              사유 조회하기
            </button>
          </div>
        </div>
        
        );
      }
    }
    return "신청 없음";
  };

  // 로딩 중일 때 메시지 출력
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
              key={club.clubId}
              onClick={() => navigate(`/myclubs/${club.clubId}`)}
              style={{ cursor: "pointer" }}
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
              <button
                className="withdraw-button"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(club.clubId);
                }}
              >
                탈퇴하기
              </button>
            </div>
          ))
        )}
      </div>

      <h2>내 클럽 신청 현황</h2>
      <div className="club-list">
        {applicationStatus.length === 0 ? (
          <p>신청한 클럽이 없습니다.</p>
        ) : (
          applicationStatus.map((application) => (
            <div key={application.applicationId} className="club-card">
              <h3>{application.clubName}</h3>
              <div>
                <strong>신청 상태:</strong> {getApplicationStatusForClub(application.clubName, application.applicationId)}
              </div>
              <p>
                <strong>신청일:</strong>{" "}
                {new Date(application.appliedAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      {/* 모달창 */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <h3>탈퇴 사유 입력</h3>
            <textarea
              value={leavenReason}
              onChange={(e) => setLeavenReason(e.target.value)}
              placeholder="탈퇴 사유를 입력하세요..."
              rows="4"
              style={{ width: "100%", padding: "10px" }}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={handleWithdraw} className="withdraw-btn">
                탈퇴하기
              </button>
              <button onClick={closeModal} className="cancel-btn">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 거절 사유 모달 */}
      {isRejectionModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRejectionModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsRejectionModalOpen(false)}>×</button>
            <h3>거절 사유</h3>
            <p>{rejectionReason}</p>
            <button onClick={() => setIsRejectionModalOpen(false)} className="cancel-btn">
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
