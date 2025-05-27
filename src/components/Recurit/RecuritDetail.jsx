import React, { useEffect, useState } from "react";
import { useParams, useOutletContext,useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const RecuritDetail = () => {
  const { clubId, scheduleId } = useParams();
  const navigate = useNavigate();
  const { isManager } = useOutletContext(); // 부모에서 전달된 isManager 값 받기
  const [schedule, setSchedule] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setSchedule(res.data.data);
      } catch (err) {
        console.error("일정 상세 조회 실패:", err);
        setError("일정 정보를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedule();
  }, [clubId, scheduleId]);

  const handleEdit = () => {
    // 수정 페이지로 리디렉션
    navigate(`/clubsadmin/${clubId}/recruitedit/${scheduleId}`);
  };
  

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      // 삭제 후 리디렉션
      navigate(`/clubs/${clubId}/schedules`);
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      setError("일정을 삭제하는 데 실패했습니다.");
    }
  };

  if (isLoading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (!schedule) return <div>일정을 찾을 수 없습니다.</div>;

  return (
    <div className="recruit-detail">
      <h2>📄 <strong>제목:</strong> {schedule.title}</h2>
      <button onClick={() => navigate(-1)}><IoMdArrowRoundBack /></button>
      <p><strong>내용:</strong> {schedule.content}</p>
      <p><strong>시작 시간:</strong> {new Date(schedule.startTime).toLocaleString()}</p>
      <p><strong>종료 시간:</strong> {new Date(schedule.endTime).toLocaleString()}</p>

    

      {/* 관리자인 경우 수정 및 삭제 버튼을 표시 */}
      {isManager && (
        <div>
          <button onClick={handleEdit}>일정 수정</button>
          <button onClick={handleDelete}>일정 삭제</button>
        </div>
      )}
    </div>
  );
};

export default RecuritDetail;
