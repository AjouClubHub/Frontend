import React, { useEffect, useState } from "react";
import {
  useParams,
  useOutletContext,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const RecruitDetail = () => {
  const { clubId, scheduleId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isManager } = useOutletContext();

  // route 기반 목록 경로
  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  // 로딩/에러 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 원본 데이터
  const [recruit, setRecruit] = useState(null);
  const [schedule, setSchedule] = useState(null);

  // 폼 필드
  const [title, setTitle] = useState("");
  const [requirements, setRequirements] = useState("");
  const [alwaysOpen, setAlwaysOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [content, setContent] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // 편집 모드
  const [isEditing, setIsEditing] = useState(false);

  const isRecruitMode = recruit && String(recruit.id) === scheduleId;

  // 데이터 로드
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("accessToken");
      try {
        // 모집공고
        const recRes = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
        const rec = recRes.data.data;
        setRecruit(rec);

        if (rec && String(rec.id) === scheduleId) {
          // 공고 상세 초기화
          setSchedule(null);
          setTitle(rec.title);
          setRequirements(rec.requirements);
          setAlwaysOpen(rec.alwaysOpen);
          setStartDate(rec.startDate);
          setEndDate(rec.endDate);
        } else {
          // 일정 상세 초기화
          const schRes = await axios.get(
            `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
            { headers: { Authorization: `Bearer Bearer ${token}` } }
          );
          const sch = schRes.data.data;
          if (!sch) throw new Error("일정 없음");
          setSchedule(sch);
          setTitle(sch.title);
          setContent(sch.content);
          setStartTime(sch.startTime.slice(0, 16));
          setEndTime(sch.endTime.slice(0, 16));
        }
      } catch (err) {
        console.error(err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [clubId, scheduleId]);

  // 저장 핸들러
  const saveChanges = async () => {
    const token = localStorage.getItem("accessToken");
    try {
      if (isRecruitMode) {
        // 모집공고 수정
        await axios.patch(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
          {
            title,
            requirements,
            alwaysOpen,
            startDate: alwaysOpen ? null : startDate,
            endDate: alwaysOpen ? null : endDate,
          },
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
      } else {
        // 일정 수정
        const payload = {
          title,
          content,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
        };
        await axios.put(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
          payload,
          { headers: { Authorization: `Bearer Bearer ${token}`, "Content-Type": "application/json" } }
        );
      }

      // 편집 모드 종료 및 리스트로 이동
      setIsEditing(false);
      navigate(`${basePath}/recruit`);
    } catch (err) {
      console.error(err.response || err);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (isRecruitMode && !recruit) return <div>모집 공고가 없습니다.</div>;
  if (!isRecruitMode && !schedule) return <div>일정이 없습니다.</div>;

  return (
    <div style={{ padding: "1rem" }}>
      <button
        onClick={() => navigate(-1)}
        style={{ background: "none", border: "none", fontSize: "1.5rem" }}
      >
        <IoMdArrowRoundBack />
      </button>

      {/* 읽기 전용 모드 */}
      {!isEditing && (
        <>
          {isRecruitMode ? (
            <section>
              <h2>🗓 모집공고 상세보기</h2>
              <p><strong>제목:</strong> {recruit.title}</p>
              <p><strong>요구사항:</strong> {recruit.requirements}</p>
              <p><strong>상시모집:</strong> {recruit.alwaysOpen ? "예" : "아니오"}</p>
              {!recruit.alwaysOpen && (
                <p>
                  <strong>기간:</strong> {recruit.startDate} ~ {recruit.endDate}
                </p>
              )}
            </section>
          ) : (
            <section>
              <h2>🗓 일정 상세보기</h2>
              <p><strong>제목:</strong> {schedule.title}</p>
              <p><strong>내용:</strong> {schedule.content}</p>
              <p>
                <strong>시간:</strong>{" "}
                {new Date(schedule.startTime).toLocaleString()} ~ {new Date(schedule.endTime).toLocaleString()}
              </p>
            </section>
          )}

          {isManager && (
            <button
              onClick={() => setIsEditing(true)}
              style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
            >
              수정하기
            </button>
          )}
        </>
      )}

      {/* 편집 모드 */}
      {isEditing && (
        <section>
          <h2>✏️ {isRecruitMode ? "모집공고 수정" : "일정 수정"}</h2>

          {isRecruitMode ? (
            // 모집공고 폼
            <>            
              <label>제목<br/>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ display: "block", marginTop: "1rem" }}>요구사항<br/>
                <textarea
                  value={requirements}
                  onChange={e => setRequirements(e.target.value)}
                  rows={3}
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ display: "block", marginTop: "1rem" }}>
                <input
                  type="checkbox"
                  checked={alwaysOpen}
                  onChange={e => setAlwaysOpen(e.target.checked)}
                /> 상시모집
              </label>
              {!alwaysOpen && (
                <div style={{ marginTop: "1rem" }}>
                  <label>시작 날짜<br/>
                    <input
                      type="date"
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                    />
                  </label>
                  <label style={{ marginLeft: "1rem" }}>종료 날짜<br/>
                    <input
                      type="date"
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                    />
                  </label>
                </div>
              )}
            </>
          ) : (
            // 일정 폼
            <>
              <label>제목<br/>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ display: "block", marginTop: "1rem" }}>내용<br/>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  rows={3}
                  style={{ width: "100%" }}
                />
              </label>
              <label style={{ display: "block", marginTop: "1rem" }}>시작 시간<br/>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={e => setStartTime(e.target.value)}
                />
              </label>
              <label style={{ display: "block", marginTop: "1rem" }}>종료 시간<br/>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={e => setEndTime(e.target.value)}
                />
              </label>
            </>
          )}

          <div style={{ marginTop: "1rem" }}>
            <button onClick={saveChanges} style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
              저장
            </button>
            <button
              onClick={() => setIsEditing(false)}
            >
              취소
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default RecruitDetail;
