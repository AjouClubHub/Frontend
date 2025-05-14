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
    const fetchSchedules = async () => {
      const token = localStorage.getItem('accessToken');
      const start = new Date().toISOString();
      const end = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString(); // 60일 후

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules?start=${start}&end=${end}`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );

        const data = res.data?.data || [];

        // 날짜별로 일정 분해
        const parsedSchedules = data.flatMap((item) => {
          const range = getDateRange(item.startTime, item.endTime);
          return range.map((date) => ({
            id: item.id,
            date,
            title: item.title,
          }));
        });

        setSchedules(parsedSchedules);
      } catch (err) {
        console.error('일정 불러오기 실패:', err);
      }
    };

    fetchSchedules();
  }, [clubId]);

  const getDateRange = (start, end) => {
    const result = [];
    const current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      result.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return result;
  };

  const getTileContent = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const matches = schedules.filter((s) => s.date === dateStr);
    return matches.length > 0 ? (
      <div className="dot" title={matches.map((match) => match.title).join(", ")}>
        {matches.map((match, index) => (
          <div key={index} className="schedule-title">-{match.title}</div>
        ))}
      </div>
    ) : null;
  };

  const grouped = Object.values(
    schedules.reduce((acc, curr) => {
      if (!acc[curr.id]) {
        acc[curr.id] = {
          id: curr.id,
          title: curr.title,
          dates: [curr.date],
        };
      } else {
        acc[curr.id].dates.push(curr.date);
      }
      return acc;
    }, {})
  );

  const renderedSchedules = grouped.map((r) => {
    const sorted = r.dates.sort();
    return {
      id: r.id,
      title: r.title,
      start: sorted[0],
      end: sorted[sorted.length - 1],
    };
  });

  return (
    <div className="calendar-wrapper">
      <h2>🗓️ 일정</h2>

      {isManager && (
        <div className="schedule-form">
          <button
            className="create-button"
            onClick={() => navigate(`/clubsadmin/${clubId}/recruitcreate`)}
          >
            일정 등록하기
          </button>
        </div>
      )}

      <Calendar
        onChange={setSelectedDate}
        value={selectedDate}
        tileContent={getTileContent}
        onClickDay={(date) => {
          const dateStr = date.toISOString().split('T')[0];
          const matched = schedules.find((s) => s.date === dateStr);
          if (matched) {
            navigate(`/clubsadmin/${clubId}/recruit/${matched.id}`);
          } else {
            console.log('해당 날짜에는 일정 없음');
          }
        }}
      />

      <div className="schedule-list">
        <h3>📋 등록된 일정</h3>
        {renderedSchedules.length === 0 ? (
          <p>등록된 일정이 없습니다.</p>
        ) : (
          <ul>
            {renderedSchedules.map((r, i) => (
              <li key={i}>
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
