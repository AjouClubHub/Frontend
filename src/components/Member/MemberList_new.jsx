// src/components/Member/MemberList_new.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation, useOutletContext } from "react-router-dom";
import "../../styles/Member/MemberList.css";

const MemberList_new = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isManager } = useOutletContext();

  const isAdminView = location.pathname.includes("membernew");
  const basePath = location.pathname.includes("clubsadmin") ? "/clubsadmin" : "/myclubs";

  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const pendingOnly = res.data.data.filter(app => app.status === "PENDING");
        setApplications(pendingOnly);
      } catch (err) {
        console.error("신청자 목록 불러오기 실패:", err);
      }
    };
    if (isManager) fetchApplications();
  }, [clubId, isManager]);

  const goToExisting = () => {
    navigate(`${basePath}/${clubId}/member`);
  };
  const goToNew = () => {
    navigate(`${basePath}/${clubId}/membernew`);
  };

  const handleApprove = async (applicationId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${applicationId}/approval`,
        { status: "APPROVED" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("승인 완료");
      setApplications(apps => apps.filter(app => app.applicationId !== applicationId));
    } catch (err) {
      console.error("승인 실패:", err);
      alert("승인 중 오류 발생");
    }
  };

  const handleRejectClick = (applicationId) => {
    setSelectedAppId(applicationId);
    setRejectionReason("");
    setShowModal(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("거절 사유를 입력해주세요.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${selectedAppId}/approval`,
        { status: "REJECTED", rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("거절 완료");
      setApplications(apps => apps.filter(app => app.applicationId !== selectedAppId));
    } catch (err) {
      console.error("거절 실패:", err);
      alert("거절 중 오류 발생");
    } finally {
      setShowModal(false);
    }
  };

  return (
    <div className="member-list">
      <div className="member-header">
        <h2>👥 클럽 멤버 목록</h2>
        <div className="member-filter-buttons">
          <button onClick={goToExisting} className={!isAdminView ? 'active' : ''}>
            기존 멤버
          </button>
          {isManager && (
            <button onClick={goToNew} className={isAdminView ? 'active' : ''}>
              신청 관리
            </button>
          )}
        </div>
      </div>

      {isAdminView ? (
        applications.length === 0 ? (
          <p>신청자가 없습니다.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {applications.map(app => (
              <li key={app.applicationId} style={{ marginBottom: 20, padding: 12, border: '1px solid #ddd', borderRadius: 8, backgroundColor: '#f9f9f9' }}>
                <strong>{app.memberName}</strong>님 - 신청일: {new Date(app.appliedAt).toLocaleDateString()}
                <div style={{ marginTop: 8 }}>
                  <button onClick={() => handleApprove(app.applicationId)} style={{ marginRight: 10 }}>승인</button>
                  <button onClick={() => handleRejectClick(app.applicationId)}>거절</button>
                </div>
              </li>
            ))}
          </ul>
        )
      ) : (
        // 기존 멤버 뷰로 리디렉션하거나 별도 컴포넌트 렌더링
        <p>기존 멤버 보기 화면으로 이동합니다.</p>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>거절 사유 입력</h3>
            <textarea rows={4} placeholder="거절 사유를 입력하세요" value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} />
            <div className="modal-actions">
              <button onClick={confirmReject} style={{ marginRight: 8 }}>확인</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList_new;
