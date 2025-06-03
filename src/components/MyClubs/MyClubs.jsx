import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../../styles/MyClubs/MyClubs.css";

const MyClubs = () => {
  const [activeTab, setActiveTab] = useState("joined");
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState(null);
  const [leavenReason, setLeavenReason] = useState("");

  const [rejectionReason, setRejectionReason] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);

  const navigate = useNavigate();
  const { clubId } = useParams();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clubsRes, appsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_URL}/api/my/clubs`, {
            headers: { Authorization: `Bearer Bearer ${token}` },
          }),
          axios.get(`${import.meta.env.VITE_APP_URL}/api/my/applications`, {
            headers: { Authorization: `Bearer Bearer ${token}` },
          }),
        ]);
        setJoinedClubs(clubsRes.data.data || []);
        setApplicationStatus(appsRes.data.data || []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div>📡 로딩 중...</div>;

  // 신청 취소
  const handleCancelApplication = async (applicationId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${applicationId}`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      alert("가입 신청이 취소되었습니다.");
      setApplicationStatus((prev) =>
        prev.filter((app) => app.applicationId !== applicationId)
      );
    } catch (err) {
      console.error("가입 신청 취소 실패:", err);
      alert("가입 신청 취소에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const getRejectionReason = async (applicationId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/my/applications/${applicationId}/rejection`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      setRejectionReason(res.data.data.rejectionReason || "사유 없음");
    } catch (err) {
      console.error("거절 사유 조회 실패:", err);
      setRejectionReason("거절 사유를 불러오지 못했습니다.");
    } finally {
      setIsRejectionModalOpen(true);
    }
  };


  const handleWithdraw = async () => {
    if (!leavenReason) {
      alert("탈퇴 사유를 입력해야 합니다.");
      return;
    }


    setJoinedClubs((prev) =>
      prev.filter((club) => club.clubId !== selectedClubId)
    );
 
    setApplicationStatus((prev) =>
      prev.map((app) =>
        app.applicationId === selectedClubId
          ? { ...app, status: "WITHDRAWN" }
          : app
      )
    );

    closeModal();

    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${selectedClubId}/withdraw`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { leavenReason },
        }
      );
      alert(res.data.message);
    } catch (err) {
      console.error("클럽 탈퇴 실패:", err);
      alert("탈퇴 처리에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const openModal = (id) => {
    setSelectedClubId(id);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setLeavenReason("");
  };

 
  const renderStatus = (status, applicationId) => {
    switch (status) {
      case "PENDING":
        return (
          <div className="status-banner status-pending">
            신청 대기 중
            <button
              onClick={() => handleCancelApplication(applicationId)}
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
              onClick={() => getRejectionReason(applicationId)}
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
        <button
          className={activeTab === "joined" ? "tab active" : "tab"}
          onClick={() => setActiveTab("joined")}
        >
          내 클럽
        </button>
        <button
          className={activeTab === "applications" ? "tab active" : "tab"}
          onClick={() => setActiveTab("applications")}
        >
          신청 현황
        </button>
      </div>

      {activeTab === "joined" && (
        <>
          <hr className="divider" />
          <div className="myclubs-club-list">
            {joinedClubs.length === 0 ? (
              <p>가입된 클럽이 없습니다.</p>
            ) : (
              joinedClubs.map((club) => (
                <div
                  key={club.clubId}
                  className="myclubs-club-card"
                  onClick={() => navigate(`/myclubs/${club.clubId}`)}
                >
                  {club.imgUrl ? (
                    <img
                      src={club.imgUrl}
                      alt={club.clubName}
                      className="myclubs-club-image"
                    />
                  ) : (
                    <div className="myclubs-image-placeholder">
                      이미지 없음
                    </div>
                  )}
                  <h3>{club.clubName}</h3>
                  <p>
                    <strong>설명:</strong> {club.description}
                  </p>
                  <p>
                    <strong>동방 위치:</strong> {club.location}
                  </p>
                  <p>
                    <strong>가입일:</strong>{" "}
                    {new Date(club.joinedAt).toLocaleDateString()}
                  </p>
                  <button
                    className="myclubs-withdraw-button"
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
        </>
      )}

      {activeTab === "applications" && (
        <>
          <hr className="divider" />
          <div className={`myclubs-club-list ${
    activeTab === "applications" ? "applications-view" : ""
  }`}>
            {applicationStatus.length === 0 ? (
              <p>신청한 클럽이 없습니다.</p>
            ) : (
              applicationStatus.map((app) => (
                <div key={app.applicationId} className="myclubs-club-card">
                  <div className="with-banner">
                    {renderStatus(app.status, app.applicationId)}
                  </div>

                  <h3>{app.clubName}</h3>
                  <p>
                    <strong>신청일:</strong>{" "}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>신청현황:</strong> {app.status}
                  </p>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="myclubs-modal-overlay" onClick={closeModal}>
          <div
            className="myclubs-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="myclubs-modal-close" onClick={closeModal}>
              ×
            </button>
            <h3>탈퇴 사유 입력</h3>
            <textarea
              value={leavenReason}
              onChange={(e) => setLeavenReason(e.target.value)}
              placeholder="탈퇴 사유를 입력하세요..."
              rows="4"
              style={{ width: "100%", padding: "10px" }}
            />
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              <button onClick={handleWithdraw} className="myclubs-withdraw-btn">
                탈퇴하기
              </button>
              <button onClick={closeModal} className="myclubs-cancel-btn">
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {isRejectionModalOpen && (
        <div
          className="myclubs-modal-overlay"
          onClick={() => setIsRejectionModalOpen(false)}
        >
          <div
            className="myclubs-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="myclubs-modal-close"
              onClick={() => setIsRejectionModalOpen(false)}
            >
              ×
            </button>
            <h3>거절 사유</h3>
            <p>{rejectionReason}</p>
            <button
              onClick={() => setIsRejectionModalOpen(false)}
              className="myclubs-cancel-btn"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyClubs;
