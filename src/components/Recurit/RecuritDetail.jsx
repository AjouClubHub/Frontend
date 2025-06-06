// RecuritDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useOutletContext, useNavigate } from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const RecuritDetail = () => {
  const { clubId, scheduleId } = useParams();
  const navigate = useNavigate();
  const { isManager } = useOutletContext();

  const [recruit, setRecruit] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모집공고 폼 필드
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [alwaysOpen, setAlwaysOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 모집공고 불러오기
  const fetchRecruit = async (token) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      return res.data.data;
    } catch {
      return null;
    }
  };

  // 일정 불러오기
  const fetchSchedule = async (token, id) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${id}`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      return res.data.data;
    } catch {
      return null;
    }
  };

  // 마운트 시: 모집공고와 일정 모두 조회, scheduleId가 모집공고 ID면 모집공고 모드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      const rec = await fetchRecruit(token);
      setRecruit(rec);

      if (rec && String(rec.id) === scheduleId) {
        // 모집공고 모드
        setSchedule(null);
        setTitle(rec.title);
        setRequirements(rec.requirements);
        setAlwaysOpen(rec.alwaysOpen);
        setStartDate(rec.startDate);
        setEndDate(rec.endDate);
      } else {
        // 일정 모드
        const sch = await fetchSchedule(token, scheduleId);
        if (!sch) {
          setError("일정 정보를 불러오는 데 실패했습니다.");
        } else {
          setSchedule(sch);
        }
      }

      setLoading(false);
    };

    loadData();
  }, [clubId, scheduleId]);

  const isRecruitMode = recruit && String(recruit.id) === scheduleId;

  // 로딩 및 에러 처리
  if (loading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (isRecruitMode && !recruit) return <div>모집 공고가 없습니다.</div>;
  if (!isRecruitMode && !schedule) return <div>일정이 없습니다.</div>;

  // 모집공고 저장 (PATCH)
  const handleRecruitSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const payload = {
        title,
        requirements,
        alwaysOpen,
        startDate: alwaysOpen ? null : startDate,
        endDate: alwaysOpen ? null : endDate,
      };
      await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        payload,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      // 저장 후 재조회
      const rec = await fetchRecruit(token);
      setRecruit(rec);
      setTitle(rec.title);
      setRequirements(rec.requirements);
      setAlwaysOpen(rec.alwaysOpen);
      setStartDate(rec.startDate);
      setEndDate(rec.endDate);
      alert("모집공고가 수정되었습니다.");
    } catch (err) {
      console.error("모집 공고 수정 실패:", err);
      alert("모집 공고 수정에 실패했습니다.");
    }
  };

  // 일정 삭제
  const handleScheduleDelete = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      await axios.delete(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      navigate(`/clubsadmin/${clubId}/recruit`);
    } catch (err) {
      console.error("일정 삭제 실패:", err);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.5rem",
          marginBottom: "1rem",
        }}
      >
        <IoMdArrowRoundBack />
      </button>

      {isRecruitMode ? (
        <section>
          <h2>📰 모집공고 상세</h2>
          <div style={{ marginBottom: "1rem" }}>
            <label>
              <strong>제목:</strong>
              <br />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>
              <strong>요구사항:</strong>
              <br />
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
              />
            </label>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>
              <input
                type="checkbox"
                checked={alwaysOpen}
                onChange={(e) => setAlwaysOpen(e.target.checked)}
              />{" "}
              <strong>상시 모집</strong>
            </label>
          </div>

          {!alwaysOpen && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  <strong>시작 날짜:</strong>
                  <br />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                  />
                </label>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block" }}>
                  <strong>종료 날짜:</strong>
                  <br />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                  />
                </label>
              </div>
            </>
          )}

          {isManager && (
            <button
              onClick={handleRecruitSave}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
              모집공고 수정 완료
            </button>
          )}
        </section>
      ) : (
        <section>
          <h2>🗓 일정 상세</h2>
          <p>
            <strong>제목:</strong> {schedule.title}
          </p>
          <p>
            <strong>내용:</strong> {schedule.content}
          </p>
          <p>
            <strong>시작 시간:</strong> {new Date(schedule.startTime).toLocaleString()}
          </p>
          <p>
            <strong>종료 시간:</strong> {new Date(schedule.endTime).toLocaleString()}
          </p>
          {isManager && (
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => navigate(`/clubsadmin/${clubId}/recruitedit/${scheduleId}`)}
                style={{ marginRight: "0.5rem", padding: "0.5rem 1rem" }}
              >
                일정 수정
              </button>
              <button
                onClick={handleScheduleDelete}
                style={{ padding: "0.5rem 1rem" }}
              >
                일정 삭제
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default RecuritDetail;
