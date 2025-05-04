import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecuritDetail = () => {
  const { clubId } = useParams();
  const [recruitment, setRecruitment] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecruitment = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setRecruitment(res.data.data);
      } catch (err) {
        console.error("모집 공고 불러오기 실패:", err);
        setError("모집 정보를 불러오는 데 실패했습니다.");
      }
    };

    fetchRecruitment();
  }, [clubId]);

  if (error) return <div>{error}</div>;
  if (!recruitment) return <div>불러오는 중...</div>;

  return (
    <div className="recruit-detail">
      <h2>📄 모집 공고 상세</h2>
      <p><strong>동아리명:</strong> {recruitment.clubName}</p>
      <p><strong>제목:</strong> {recruitment.title}</p>
      <p><strong>자격 요건:</strong> {recruitment.requirements}</p>
      <p><strong>모집 시작일:</strong> {recruitment.startDate}</p>
      <p><strong>모집 마감일:</strong> {recruitment.endDate}</p>
    </div>
  );
};

export default RecuritDetail;
