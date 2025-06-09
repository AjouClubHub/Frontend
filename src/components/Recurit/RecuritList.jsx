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

  const [scheduleDates, setScheduleDates] = useState(new Set());
  const [recruitDates, setRecruitDates] = useState(new Set());

  const navigate = useNavigate();
  const location = useLocation();
  const { clubId } = useParams();
  const { isManager } = useOutletContext();

  const basePath = location.pathname.startsWith(`/clubsadmin/${clubId}`)
    ? `/clubsadmin/${clubId}`
    : `/myclubs/${clubId}`;

  useEffect(() => {
    fetchSchedules();
    fetchRecruit();
  }, [clubId, location.pathname]);

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

  useEffect(() => {
    if (!recruit) {
      setRecruitDates(new Set());
    } else {
      setRecruitDates(new Set(getDateRange(recruit.startDate, recruit.endDate)));
    }
  }, [recruit]);

  const formatLocalDate = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

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

  const parseSchedules = data =>
    data.flatMap(item =>
      getDateRange(item.startTime, item.endTime).map(d => ({ id: item.id, date: d, title: item.title, type: 'schedule' }))
    );

  const handleLabelClick = (e, type, id) => {
    e.stopPropagation();
    navigate(`${basePath}/recruit/${id}`);
  };

  const events = [
    ...schedules,
    ...(recruit
      ? getDateRange(recruit.startDate, recruit.endDate).map(d => ({ id: recruit.id, date: d, title: recruit.title, type: 'recruit' }))
      : []),
  ];

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
        tileContent={({ date }) => {
          const dateStr = formatLocalDate(date);
          return (
            <div className="labels">
              {scheduleDates.has(dateStr) && (
                <span className="label schedule" onClick={e => handleLabelClick(e, 'schedule', schedules.find(s => s.date === dateStr).id)}>
                  [일정]
                </span>
              )}
              {recruitDates.has(dateStr) && (
                <span className="label recruit" onClick={e => handleLabelClick(e, 'recruit', recruit.id)}>
                  [모집]
                </span>
              )}
            </div>
          );
        }}
        onClickDay={date => setSelectedDate(date)}
      />

      <div className="schedule-list">
        <h3>📋 등록된 일정 & 모집공고</h3>
        {grouped.length === 0 ? (
          <p>등록된 일정이나 모집공고가 없습니다.</p>
        ) : (
          <ul>
            {grouped.map(r => (
              <li key={`${r.type}-${r.id}`} onClick={() => navigate(`${basePath}/recruit/${r.id}`)} style={{ cursor: 'pointer' }}>
                {r.type === 'schedule' ? '[일정]' : '[모집]'} {r.start} ~ {r.end} - {r.title}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RecuritList;
