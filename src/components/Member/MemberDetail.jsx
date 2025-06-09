// src/components/Member/MemberDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import axios from "axios";
import { IoMdArrowBack } from "react-icons/io";

const MemberDetail = () => {
  const { clubId, memberId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const navigate = useNavigate();

  // 일반 멤버 조회 성공 시 결과
  const [memberData, setMemberData] = useState(null);
  // 임원진(404일 때) 조회 결과
  const [adminData, setAdminData]   = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      const token = localStorage.getItem("accessToken");

      try {
        // 1) 일반 멤버용 조회 시도 (404 안 뜨면 성공)
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/members/${memberId}`,
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
        // { data: { member: {...}, applicationInfo: {...} } }
        setMemberData(res.data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          // 2) 404일 때만 임원진용(my page) 폴백
          try {
            const meRes = await axios.get(
              `${import.meta.env.VITE_APP_URL}/api/member/mypage`,
              { headers: { Authorization: `Bearer Bearer ${token}` } }
            );
            const { member, applicationInfo } = meRes.data.data;
            // URL의 memberId와 일치 확인
            if (String(member.memberId) === memberId) {
              setAdminData({ member, applicationInfo });
            } else {
              setError("임원진 정보를 불러올 수 없습니다.");
            }
          } catch (meErr) {
            console.error("마이페이지 조회 실패:", meErr);
            setError("마이페이지 조회 중 오류가 발생했습니다.");
          }
        } else {
          console.error("멤버 조회 실패:", err);
          setError("멤버 상세정보 조회 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [clubId, memberId]);

  if (loading) return <div>📡 불러오는 중...</div>;
  if (error)   return <div>❌ {error}</div>;

  // ———— 404 안 뜨고 성공했을 때: 일반 멤버 UI ————
  if (memberData) {
    const { member, applicationInfo } = memberData;
    return (
      <div style={{ padding: 20 }}>
           <button onClick={() => navigate(-1)}>< IoMdArrowBack /></button>
        <h2>👤 멤버 상세 정보</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>이름:</strong> {member.name}</li>
          <li><strong>학번:</strong> {member.studentId}</li>
          <li><strong>전공:</strong> {member.major}</li>
          <li><strong>역할:</strong> 일반 멤버</li>
          <li><strong>가입일:</strong> {new Date(member.joinedAt).toLocaleDateString()}</li>
          <hr/>
          <li><strong>생년월일:</strong> {applicationInfo.birthDate}</li>
          <li><strong>성별:</strong> {applicationInfo.gender}</li>
          <li><strong>전화번호:</strong> {applicationInfo.phoneNumber}</li>
          <li><strong>지원동기:</strong><br/>{applicationInfo.motivation}</li>
        </ul>
      </div>
    );
  }

  // ———— 404일 때 폴백: 임원진 UI ————
  if (adminData) {
    const { member } = adminData;
    return (
      <div style={{ padding: 20 }}>
        <h2>👤 멤버 상세 정보 (임원진)</h2>
        <ul style={{ lineHeight: 1.8 }}>
          <li><strong>이름:</strong> {member.name}</li>
          <li><strong>학번:</strong> {member.studentId}</li>
          <li><strong>전공:</strong> {member.major}</li>
          <li><strong>역할:</strong> 임원진</li>
          <hr/>
        </ul>
      </div>
    );
  }

  return <div>데이터를 표시할 수 없습니다.</div>;
};

export default MemberDetail;
