import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/MyClubs/MyClubs.css";

const MyClubs = () => {
  const [activeTab, setActiveTab] = useState("joined");
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Withdraw modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [withdrawReason, setWithdrawReason] = useState("");

  // Rejection modal state
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchMyClubs = async () => {
      try {
        const [clubsRes, appsRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_APP_URL}/api/my/clubs`,
            { headers: { Authorization: `Bearer Bearer ${token}` } }
          ),
          axios.get(
            `${import.meta.env.VITE_APP_URL}/api/my/applications`,
            { headers: { Authorization: `Bearer Bearer ${token}` } }
          ),
        ]);
        setJoinedClubs(clubsRes.data.data || []);
        setApplicationStatus(appsRes.data.data || []);
      } catch (err) {
        console.error("Error loading MyClubs data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyClubs();
  }, [token]);

  if (loading) return <div>📡 로딩 중...</div>;

  // 신청 취소: app 객체에서 clubId와 applicationId 추출
  const handleCancelApplication = async (app) => {
  const { clubId, applicationId } = app;
  try {
    await axios.delete(
      `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications`,
      {
        headers: { Authorization: `Bearer Bearer ${token}` },
        data: { applicationId }
      }
    );
    setApplicationStatus(prev =>
      prev.filter(x => x.applicationId !== applicationId)
    );
    alert("가입 신청이 취소되었습니다.");
  } catch (err) {
    console.error("가입 신청 취소 실패:", err);
    alert(err.response?.data?.message || "취소에 실패했습니다.");
  }
};


  // 클럽 탈퇴
  const handleWithdraw = async () => {
    if (!withdrawReason) {
      alert("탈퇴 사유를 입력해주세요.");
      return;
    }
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClubId}/withdraw`,
        { headers: { Authorization: `Bearer Bearer ${token}` }, data: { leavenReason: withdrawReason } }
      );
      setJoinedClubs(prev => prev.filter(c => c.clubId !== selectedClubId));
      alert("탈퇴 완료");
    } catch (err) {
      console.error("Error withdrawing club:", err);
      alert("탈퇴 실패");
    } finally {
      setShowWithdrawModal(false);
      setWithdrawReason("");
      setSelectedClubId(null);
    }
  };

  // 거절 사유 조회
  const handleGetRejectionReason = async (applicationId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/my/applications/${applicationId}/rejection`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      setRejectionReason(res.data.data.rejectionReason || "사유 없음");
    } catch {
      setRejectionReason("거절 사유를 불러오지 못했습니다.");
    } finally {
      setShowRejectionModal(true);
    }
  };

  // 상태 배너 렌더링
  const renderStatus = (app) => {
    switch (app.status) {
      case "PENDING":
        return (
          <div className="status-banner status-pending">
            신청 대기 중
            <button
              onClick={() => handleCancelApplication(app)}
              className="cancel-application-btn"
            >
              신청 취소
            </button>
          </div>
        );
      case "APPROVED":
        return <div className="status-banner status-approved">승인 완료</div>;
      case "REJECTED":
        return (
          <div className="status-banner status-rejected">
            신청 거절
            <button
              onClick={() => handleGetRejectionReason(app.applicationId)}
              className="rejection-button"
            >
              사유 조회하기
            </button>
          </div>
        );
      case "WITHDRAWN":
        return <div className="status-banner status-withdrawn">탈퇴 완료</div>;
      default:
        return null;
    }
  };

  return (
    <div className="myclubs-container">
      <div className="tabs">
        <button className={activeTab === "joined" ? "tab active" : "tab"} onClick={() => setActiveTab("joined")}>내 클럽</button>
        <button className={activeTab === "applications" ? "tab active" : "tab"} onClick={() => setActiveTab("applications")}>신청 현황</button>
      </div>

      {activeTab === "joined" && (
        <div className="myclubs-club-list">
          {joinedClubs.length === 0 ? <p>가입된 클럽이 없습니다.</p> : joinedClubs.map(club => (
            <div key={club.clubId} className="myclubs-club-card" onClick={() => navigate(`/myclubs/${club.clubId}`)}>
              {club.imgUrl ? <img src={club.imgUrl} alt={club.clubName} className="myclubs-club-image" /> : <div className="myclubs-image-placeholder">이미지 없음</div>}
              <h3>{club.clubName}</h3>
              <p><strong>설명:</strong> {club.description}</p>
              <p><strong>위치:</strong> {club.location}</p>
              <p><strong>가입일:</strong> {new Date(club.joinedAt).toLocaleDateString()}</p>
              <button className="myclubs-withdraw-button" onClick={e => { e.stopPropagation(); setSelectedClubId(club.clubId); setShowWithdrawModal(true); }}>탈퇴하기</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "applications" && (
        <div className="myclubs-club-list applications-view">
          {applicationStatus.length === 0 ? <p>신청한 클럽이 없습니다.</p> : applicationStatus.map(app => (
            <div key={app.applicationId} className="myclubs-club-card">
              <div className="with-banner">{renderStatus(app)}</div>
              <h3>{app.clubName}</h3>
              <p><strong>신청일:</strong> {new Date(app.appliedAt).toLocaleDateString()}</p>
              <p><strong>상태:</strong> {app.status}</p>
            </div>
          ))}
        </div>
      )}

      {showWithdrawModal && (
        <div className="myclubs-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="myclubs-modal-content" onClick={e => e.stopPropagation()}>
            <button className="myclubs-modal-close" onClick={() => setShowWithdrawModal(false)}>×</button>
            <h3>탈퇴 사유 입력</h3>
            <textarea value={withdrawReason} onChange={e => setWithdrawReason(e.target.value)} placeholder="탈퇴 사유를 입력하세요..." rows="4" style={{ width: "100%", padding: "10px" }} />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={handleWithdraw} className="myclubs-withdraw-btn">탈퇴하기</button>
              <button onClick={() => setShowWithdrawModal(false)} className="myclubs-cancel-btn">취소</button>
            </div>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div className="myclubs-modal-overlay" onClick={() => setShowRejectionModal(false)}>
          <div className="myclubs-modal-content" onClick={e => e.stopPropagation()}>
            <button className="myclubs-modal-close" onClick={() => setShowRejectionModal(false)}>×</button>
            <h3>거절 사유</h3>
            <p>{rejectionReason}</p>
            <button onClick={() => setShowRejectionModal(false)} className="myclubs-cancel-btn">닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
