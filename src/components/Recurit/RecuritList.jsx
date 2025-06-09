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

  // 일정·모집공고 날짜를 담을 Set
  const [scheduleDates, setScheduleDates] = useState(new Set());
  const [recruitDates, setRecruitDates] = useState(new Set());

  const navigate = useNavigate();
  const location = useLocation();
  const { clubId } = useParams();
  const { isManager } = useOutletContext();

  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  // 초기 데이터 로드
  useEffect(() => {
    fetchSchedules();
    fetchRecruit();
  }, [clubId, location.pathname]);

  // 일정 조회
  const fetchSchedules = async () => {
    const token = localStorage.getItem('accessToken');
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules`,
        { headers: { Authorization: `Bearer Bearer ${token}` }, params: { start, end } }
      );
      const evts = parseSchedules(res.data.data || []);
      setSchedules(evts);
      setScheduleDates(new Set(evts.map(e => e.date)));
    } catch (err) {
      console.error('fetchSchedules 에러:', err);
      setSchedules([]);
      setScheduleDates(new Set());
    }
  };

  // 모집공고 조회
  const fetchRecruit = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitment`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      const rec = res.data.data || null;
      setRecruit(rec);
    } catch (err) {
      console.error('fetchRecruit 에러:', err);
      setRecruit(null);
      setRecruitDates(new Set());
    }
  };

  // 모집공고 변경 시 날짜 Set 갱신
  useEffect(() => {
    if (!recruit) {
      setRecruitDates(new Set());
    } else {
      const dates = getDateRange(recruit.startDate, recruit.endDate);
      setRecruitDates(new Set(dates));
    }
  }, [recruit]);

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

  // 일정 → 이벤트 리스트 변환
  const parseSchedules = data =>
    data.flatMap(item => {
      const dates = getDateRange(item.startTime, item.endTime);
      return dates.map(d => ({ id: item.id, date: d, title: item.title, type: 'schedule' }));
    });

  // 달력 클릭 시 이동 처리
  const handleTileClick = date => {
    const dateStr = formatLocalDate(date);
    if (scheduleDates.has(dateStr)) {
      const sch = schedules.find(e => e.date === dateStr);
      return navigate(`${basePath}/recruit/${sch.id}`);
    }
    if (recruitDates.has(dateStr) && recruit) {
      return navigate(`${basePath}/recruit/${recruit.id}`);
    }
  };

  // 하단 목록 그룹화
  const events = [...schedules, ...(recruit ? parseSchedules([{ id: recruit.id, startTime: recruit.startDate, endTime: recruit.endDate, title: recruit.title }]) : [])];
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
          <button className="create-button" onClick={() => navigate(`${basePath}/recruitcreate`, { state: { mode: 'recruit' } })}>
            모집공고 등록하기
          </button>
          <button className="create-button" onClick={() => navigate(`${basePath}/recruitcreate`, { state: { mode: 'schedule' } })}>
            일정 등록하기
          </button>
        </div>
      )}

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => (
          <div className="dots">
            {scheduleDates.has(formatLocalDate(date)) && <span className="dot blue" />}
            {recruitDates.has(formatLocalDate(date)) && <span className="dot red" />}
          </div>
        )}
        onClickDay={handleTileClick}
      />

      <div className="schedule-list">
        <h3>📋 등록된 일정 & 모집공고</h3>
        {grouped.length === 0 ? (
          <p>등록된 일정이나 모집공고가 없습니다.</p>
        ) : (
          <ul>
            {grouped.map(r => (
              <li key={`${r.type}-${r.id}`} onClick={() => navigate(`${basePath}/recruit/${r.id}`)} style={{ cursor: 'pointer' }}>
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
