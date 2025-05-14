import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const MemberDetail = () => {
  const { clubId, memberId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/members/${memberId}`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setData(res.data.data);
      } catch (err) {
        console.error("멤버 상세정보 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [clubId, memberId]);

  if (loading) return <div>📡 로딩 중...</div>;
  if (!data) return <div>❌ 데이터를 불러올 수 없습니다.</div>;

  const { member, applicationInfo } = data;

  return (
    <div style={{ padding: "20px", lineHeight: "1.8" }}>
      <h2>👤 멤버 상세 정보</h2>
      <ul>
        <li><strong>이름:</strong> {member.name}</li>
        <li><strong>학번:</strong> {member.studentId}</li>
        <li><strong>전공:</strong> {member.major}</li>
        <li><strong>역할:</strong> {member.memberRole === "MANAGER" ? "임원진" : "일반 멤버"}</li>
        <li><strong>가입일:</strong> {new Date(member.joinedAt).toLocaleDateString()}</li>
        <hr />
        <li><strong>생년월일:</strong> {applicationInfo.birthDate}</li>
        <li><strong>성별:</strong> {applicationInfo.gender}</li>
        <li><strong>전화번호:</strong> {applicationInfo.phoneNumber}</li>
        <li><strong>지원동기:</strong><br />{applicationInfo.motivation}</li>
      </ul>
    </div>
  );
};


export default MemberDetail;
