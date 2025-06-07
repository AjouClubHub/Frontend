import React, { useEffect, useState } from "react";
import {
  useParams,
  useOutletContext,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const RecuritDetail = () => {
  const { clubId, scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isManager } = useOutletContext();

  // route 기반으로 목록 경로 계산
  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  // 로딩·에러 처리
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 원본 데이터
  const [recruit, setRecruit] = useState(null);
  const [schedule, setSchedule] = useState(null);

  // 폼 상태 (공통: title)
  const [title, setTitle] = useState("");

  // 모집공고 전용
  const [requirements, setRequirements] = useState("");
  const [alwaysOpen, setAlwaysOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 일정 전용
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 모드 판별
  const isRecruitMode = recruit && String(recruit.id) === scheduleId;

  // API 호출 함수
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

  // 컴포넌트 마운트 & scheduleId 변경 시 로드
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");

      // 1) 모집공고 불러오기
      const rec = await fetchRecruit(token);
      setRecruit(rec);

      // 2) 상세 ID가 모집공고인지 일정인지 분기
      if (rec && String(rec.id) === scheduleId) {
        // 모집공고 모드
        setSchedule(null);
        // 폼 초기값 채우기
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
          // 폼 초기값 채우기
          setTitle(sch.title);
          setContent(sch.content);
          // datetime-local input에 맞춰 trimming
          setStartTime(sch.startTime.slice(0, 16));
          setEndTime(sch.endTime.slice(0, 16));
        }
      }
      setLoading(false);
    };

    loadData();
  }, [clubId, scheduleId]);

  // 로딩/에러 UI
  if (loading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (isRecruitMode && !recruit) return <div>모집 공고가 없습니다.</div>;
  if (!isRecruitMode && !schedule) return <div>일정이 없습니다.</div>;

  // 모집공고 저장
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
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        payload,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      const updated = response.data.data;
      // state 업데이트
      setRecruit(updated);
      setTitle(updated.title);
      setRequirements(updated.requirements);
      setAlwaysOpen(updated.alwaysOpen);
      setStartDate(updated.startDate);
      setEndDate(updated.endDate);

      alert("모집공고가 수정되었습니다.");
      navigate(`${basePath}/recruit`);
    } catch (err) {
      console.error("모집 공고 수정 실패:", err.response || err);
      alert("모집 공고 수정에 실패했습니다.");
    }
  };

  // 일정 저장
  const handleScheduleSave = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      const payload = {
        title,
        content,
        startTime,
        endTime,
      };
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
        payload,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      const updated = response.data.data;
      // state 업데이트
      setSchedule(updated);
      setTitle(updated.title);
      setContent(updated.content);
      setStartTime(updated.startTime.slice(0, 16));
      setEndTime(updated.endTime.slice(0, 16));

      alert("일정이 수정되었습니다.");
      navigate(`${basePath}/recruit`);
    } catch (err) {
      console.error("일정 수정 실패:", err.response || err);
      alert("일정 수정에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <button
        type="button"
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
          <h2>📰 모집공고 상세/수정</h2>
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

          <label style={{ display: "block", marginTop: "1rem" }}>
            <strong>요구사항:</strong>
            <br />
            <textarea
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          <label style={{ display: "block", marginTop: "1rem" }}>
            <input
              type="checkbox"
              checked={alwaysOpen}
              onChange={(e) => setAlwaysOpen(e.target.checked)}
            />{" "}
            <strong>상시 모집</strong>
          </label>

          {!alwaysOpen && (
            <>
              <label style={{ display: "block", marginTop: "1rem" }}>
                <strong>시작 날짜:</strong>
                <br />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
              </label>

              <label style={{ display: "block", marginTop: "1rem" }}>
                <strong>종료 날짜:</strong>
                <br />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: "0.5rem", marginTop: "0.25rem" }}
                />
              </label>
            </>
          )}

          {isManager && (
            <button
              type="button"
              onClick={handleRecruitSave}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
              모집공고 수정 완료
            </button>
          )}
        </section>
      ) : (
        <section>
          <h2>🗓 일정 상세/수정</h2>
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

          <label style={{ display: "block", marginTop: "1rem" }}>
            <strong>내용:</strong>
            <br />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          <label style={{ display: "block", marginTop: "1rem" }}>
            <strong>시작 시간:</strong>
            <br />
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          <label style={{ display: "block", marginTop: "1rem" }}>
            <strong>종료 시간:</strong>
            <br />
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ padding: "0.5rem", marginTop: "0.25rem" }}
            />
          </label>

          {isManager && (
            <button
              type="button"
              onClick={handleScheduleSave}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
              일정 수정 완료
            </button>
          )}
        </section>
      )}
    </div>
  );
};

export default RecuritDetail;
