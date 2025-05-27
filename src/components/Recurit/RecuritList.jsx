import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Recurit/RecuritList.css';
import axios from 'axios';

const RecuritList = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { isManager } = useOutletContext();

  useEffect(() => {
    fetchSchedules();
  }, [clubId]);

  const fetchSchedules = async () => {
    const token = localStorage.getItem('accessToken');
    const start = new Date().toISOString();
    const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString();
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules?start=${start}&end=${end}`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      setSchedules(parseSchedules(res.data.data || []));
    } catch (err) {
      console.error('일정 불러오기 실패:', err);
    }
  };

  const parseSchedules = data => data.flatMap(item => {
    const dates = getDateRange(item.startTime, item.endTime);
    return dates.map(d => ({ id: item.id, date: d, title: item.title }));
  });

  const getDateRange = (start, end) => {
    const result = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      result.push(cur.toISOString().split('T')[0]);
      cur.setDate(cur.getDate() + 1);
    }
    return result;
  };

  const handleTileClick = date => {
    const dateStr = date.toISOString().split('T')[0];
    const found = schedules.find(s => s.date === dateStr);
    if (found) {
      navigate(`${found.id}`);
    }
  };

  const grouped = Object.values(
    schedules.reduce((acc, curr) => {
      if (!acc[curr.id]) acc[curr.id] = { id: curr.id, title: curr.title, dates: [] };
      acc[curr.id].dates.push(curr.date);
      return acc;
    }, {})
  ).map(r => {
    const sorted = r.dates.sort();
    return { ...r, start: sorted[0], end: sorted[sorted.length - 1] };
  });

  return (
    <div className="calendar-wrapper">
      <h2>🗓️ 일정</h2>

      {isManager && (
        <div className="schedule-actions">
          <button
            className="create-button"
            onClick={() => navigate(`recruitcreate`, { state: { mode: 'recruit' } })}
          >모집공고 등록하기</button>
          <button
            className="create-button"
            onClick={() => navigate(`recruitcreate`, { state: { mode: 'schedule' } })}
          >일정 등록하기</button>
        </div>
      )}

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={({ date }) => {
          const dateStr = date.toISOString().split('T')[0];
          return schedules.some(s => s.date === dateStr) ? <div className="dot" /> : null;
        }}
        onClickDay={handleTileClick}
      />

      <div className="schedule-list">
        <h3>📋 등록된 일정</h3>
        {grouped.length === 0 ? (
          <p>등록된 일정이 없습니다.</p>
        ) : (
          <ul>
            {grouped.map(r => (
              <li
                key={r.id}
                onClick={() => navigate(`${r.id}`)}
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
