import React, { useEffect, useState } from "react";
import axios from "axios";
import {  useParams ,useNavigate } from "react-router-dom";

const MemberList_new = () => {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showModal, setShowModal] = useState(false); // 모달 표시 여부

  const navigate = useNavigate();

  const { clubId } = useParams();




  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        const pendingOnly = res.data.data.filter(
          (app) => app.status === "PENDING"
        );
        setApplications(pendingOnly);
      } catch (err) {
        console.error("신청자 목록 불러오기 실패:", err);
      }
    };

    fetchApplications();
  }, [clubId]);

  const handleApprove = async (applicationId) => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.put(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${applicationId}/approval`,
        { status: "APPROVED" },
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      alert("승인 완료");
      setApplications((apps) =>
        apps.filter((app) => app.applicationId !== applicationId)
      );
    } catch (err) {
      console.error("승인 실패:", err);
      alert("승인 중 오류 발생 (이미 승인된 신청일 수 있습니다)");
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
        {
          status: "REJECTED",
          rejectionReason: rejectionReason,
        },
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );

      alert("거절 완료");
      setApplications((apps) =>
        apps.filter((app) => app.applicationId !== selectedAppId)
      );
    } catch (err) {
      console.error("거절 실패:", err);
      alert("거절 중 오류 발생 (이미 처리된 신청일 수 있습니다)");
    } finally {
      setShowModal(false);
      setSelectedAppId(null);
      setRejectionReason("");
    }
  };

  return (
    
    <div>
      <h2>가입 신청 목록</h2>
      {applications.length === 0 ? (
        <p>신청자가 없습니다.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
        {applications.map((app) => {
          console.log("🔍 app 구조 확인:", app); // ✅ 여기 추가
      
          return (
            <li
              key={app.applicationId}
              onClick={() =>
                navigate(`/clubsadmin/${clubId}/membernew/${app.applicationId}`)
              }
              style={{
                marginBottom: "20px",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
            >
              <strong>{app.memberName}</strong>님 - 신청일:{" "}
              {new Date(app.appliedAt).toLocaleDateString()}
              <br />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApprove(app.applicationId);
                }}
                style={{ marginRight: "10px" }}
              >
                승인
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectClick(app.applicationId);
                }}
              >
                거절
              </button>
            </li>
          );
        })}
      </ul>
      
      )}

      {/* ✅ 거절 사유 입력 모달 */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            <h3>거절 사유 입력</h3>
            <textarea
              rows="4"
              style={{ width: "100%", padding: "8px", marginTop: "8px" }}
              placeholder="거절 사유를 입력하세요"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div style={{ marginTop: "12px", textAlign: "right" }}>
              <button onClick={confirmReject} style={{ marginRight: "8px" }}>
                확인
              </button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberList_new;
