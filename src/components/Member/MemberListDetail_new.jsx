// src/components/Club/MemberListDetail_new.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import axios from "axios";
import "../../styles/Club/Application.css";

const MemberListDetail_new = () => {
  const { clubId, applicationId } = useParams();  // clubId 추가
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications/${applicationId}`,
          {
            headers: { Authorization: `Bearer Bearer ${token}` },  // 중복 Bearer 제거
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.error("신청자 정보 불러오기 실패:", err);
        setError("데이터를 불러올 수 없습니다.");
      }
    };

    if (clubId && applicationId) {
      fetchApplication();
    } else {
      setError("잘못된 경로입니다.");
    }
  }, [clubId, applicationId]);

  if (error) return <div>❌ {error}</div>;
  if (!data) return <div>⏳ 신청자 정보를 불러오는 중...</div>;

  const { application, applicationInfo } = data;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>
        <IoMdArrowRoundBack />
      </button>
      <h2>👤 신청자 상세 정보</h2>
      <ul style={{ lineHeight: "1.8" }}>
        <li>
          <strong>지원 동아리:</strong> {application?.clubName} (
          {application?.clubType})
        </li>
        <li>
          <strong>신청 상태:</strong> {application?.status}
        </li>
        <li>
          <strong>신청일:</strong>{" "}
          {application?.appliedAt &&
            new Date(application.appliedAt).toLocaleDateString()}
        </li>
        <li>
          <strong>이름:</strong> {application?.memberName}
        </li>
        <li>
          <strong>학번:</strong> {applicationInfo?.studentId}
        </li>
        <li>
          <strong>생년월일:</strong> {applicationInfo?.birthDate}
        </li>
        <li>
          <strong>성별:</strong> {applicationInfo?.gender}
        </li>
        <li>
          <strong>전화번호:</strong> {applicationInfo?.phoneNumber}
        </li>
        <li>
          <strong>지원동기:</strong> {applicationInfo?.motivation}
        </li>
      </ul>
    </div>
  );
};

export default MemberListDetail_new;
