// RecuritList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext, useLocation } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Recurit/RecuritList.css';
import axios from 'axios';

const RecuritList = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [recruit, setRecruit] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { clubId } = useParams();
  const { isManager } = useOutletContext();

  // basePath 계산: "/clubsadmin/:clubId" 또는 "/myclubs/:clubId"
  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  useEffect(() => {
    fetchSchedules();
    fetchRecruit();
  }, [clubId]);

  // 1) 일정 조회 (60일 뒤까지)
  const fetchSchedules = async () => {
    const token = localStorage.getItem('accessToken');
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules`,
        {
          headers: { Authorization: `Bearer Bearer ${token}` },
          params: { start, end }
        }
      );
      setSchedules(parseSchedules(res.data.data || []));
    } catch {
      setSchedules([]);
    }
  };

  // 2) 단건 모집공고 조회
  const fetchRecruit = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      setRecruit(res.data.data || null);
    } catch {
      setRecruit(null);
    }
  };

  // Date → "YYYY-MM-DD"
  const formatLocalDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // start~end 사이 날짜 배열 생성
  const getDateRange = (start, end) => {
    const result = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      result.push(formatLocalDate(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  };

  // 일정 데이터를 하루 단위로 분해
  const parseSchedules = (data) =>
    data.flatMap(item => {
      const dates = getDateRange(item.startTime, item.endTime);
      return dates.map(d => ({
        id: item.id,
        date: d,
        title: item.title,
        type: 'schedule'
      }));
    });

  // 모집공고를 하루 단위로 분해
  const parseRecruit = () => {
    if (!recruit) return [];
    const dates = getDateRange(recruit.startDate, recruit.endDate);
    return dates.map(d => ({
      id: recruit.id,
      date: d,
      title: `[모집공고] ${recruit.title}`,
      type: 'recruit'
    }));
  };

  // 달력에 표시할 이벤트 배열
  const events = [...schedules, ...parseRecruit()];

  // 달력 날짜 클릭 시 호출
  const handleTileClick = (date) => {
    const dateStr = formatLocalDate(date);

    // 1) 일정 유형 우선 탐색
    const foundSchedule = events.find(e => e.date === dateStr && e.type === 'schedule');
    if (foundSchedule) {
      navigate(`${basePath}/recruit/${foundSchedule.id}`); // 일정 상세
      return;
    }

    // 2) 그게 없으면 모집공고 탐색
    const foundRecruit = events.find(e => e.date === dateStr && e.type === 'recruit');
    if (foundRecruit && recruit && foundRecruit.id === recruit.id) {
      navigate(`${basePath}/recruit/${foundRecruit.id}`); // 모집공고 상세
    }
  };

  // 하단 목록용 그룹화
  const grouped = Object.values(
    events.reduce((acc, curr) => {
      const key = `${curr.type}-${curr.id}`;
      if (!acc[key]) acc[key] = {
        id: curr.id,
        title: curr.title,
        type: curr.type,
        dates: []
      };
      acc[key].dates.push(curr.date);
      return acc;
    }, {})
  ).map(r => {
    const sorted = r.dates.sort();
    return {
      id: r.id,
      title: r.title,
      type: r.type,
      start: sorted[0],
      end: sorted[sorted.length - 1]
    };
  });

  return (
    <div className="calendar-wrapper">
      <h2>🗓️ 일정 & 모집공고</h2>

      {isManager && (
        <div className="schedule-actions">
          <button
            className="create-button"
            onClick={() => navigate(`${basePath}/recruitcreate`, { state: { mode: 'recruit' } })}
          >
            모집공고 등록하기
          </button>
          <button
            className="create-button"
            onClick={() => navigate(`${basePath}/recruitcreate`, { state: { mode: 'schedule' } })}
          >
            일정 등록하기
          </button>
        </div>
      )}

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => {
          const dateStr = formatLocalDate(date);
          return events.some(e => e.date === dateStr)
            ? <div className="dot" />
            : null;
        }}
        onClickDay={handleTileClick}
      />

      <div className="schedule-list">
        <h3>📋 등록된 일정 & 모집공고</h3>
        {grouped.length === 0 ? (
          <p>등록된 일정이나 모집공고가 없습니다.</p>
        ) : (
          <ul>
            {grouped.map(r => (
              <li
                key={`${r.type}-${r.id}`}
                onClick={() => {
                  if (r.type === 'schedule') {
                    navigate(`${basePath}/recruit/${r.id}`);
                  } else if (recruit && r.id === recruit.id) {
                    navigate(`${basePath}/recruit/${r.id}`);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {r.start} ~ {r.end} - {r.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecuritList;
