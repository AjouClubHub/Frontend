// src/components/Recurit/RecuritList.jsx
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
  const location = useLocation();              // ★ useLocation 추가
  const { clubId } = useParams();
  const { isManager } = useOutletContext();

  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  // ★ location.pathname을 deps에 포함
  useEffect(() => {
    fetchSchedules();
    fetchRecruit();
  }, [clubId, location.pathname]);

  // 일정 조회 (60일 뒤까지)
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
      console.log('🔄 fetchSchedules 결과:', res.data.data);
      setSchedules(parseSchedules(res.data.data || []));
    } catch (err) {
      console.error('fetchSchedules 에러:', err);
      setSchedules([]);
    }
  };

  // 단건 모집공고 조회
  const fetchRecruit = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      console.log('🔄 fetchRecruit 결과:', res.data.data);
      setRecruit(res.data.data || null);
    } catch (err) {
      console.error('fetchRecruit 에러:', err);
      setRecruit(null);
    }
  };

  // 날짜 포맷 헬퍼
  const formatLocalDate = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // 날짜 범위 생성
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

  // 일정 → 이벤트 리스트
  const parseSchedules = data =>
    data.flatMap(item => {
      const dates = getDateRange(item.startTime, item.endTime);
      return dates.map(d => ({
        id: item.id,
        date: d,
        title: item.title,
        type: 'schedule'
      }));
    });

  // 모집공고 → 이벤트 리스트
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

  const events = [...schedules, ...parseRecruit()];

  const handleTileClick = date => {
    const dateStr = formatLocalDate(date);
    const sch = events.find(e => e.date === dateStr && e.type === 'schedule');
    if (sch) {
      navigate(`${basePath}/recruit/${sch.id}`);
      return;
    }
    const rec = events.find(e => e.date === dateStr && e.type === 'recruit');
    if (rec && recruit && rec.id === recruit.id) {
      navigate(`${basePath}/recruit/${rec.id}`);
    }
  };

  // 하단 목록 그룹화
  const grouped = Object.values(
    events.reduce((acc, curr) => {
      const key = `${curr.type}-${curr.id}`;
      if (!acc[key]) acc[key] = { id: curr.id, title: curr.title, type: curr.type, dates: [] };
      acc[key].dates.push(curr.date);
      return acc;
    }, {})
  ).map(r => {
    const sorted = r.dates.sort();
    return { id: r.id, title: r.title, type: r.type, start: sorted[0], end: sorted[sorted.length - 1] };
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
        tileContent={({ date }) =>
          events.some(e => e.date === formatLocalDate(date)) ? <div className="dot" /> : null
        }
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
                onClick={() => navigate(`${basePath}/recruit/${r.id}`)}
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
