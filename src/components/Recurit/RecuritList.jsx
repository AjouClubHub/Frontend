import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../../styles/Recurit/RecuritList.css';
import axios from 'axios';

const RecuritList = ({ isManager }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [closedSchedules, setClosedSchedules] = useState([]);
  const navigate = useNavigate();
  const { clubId } = useParams();
  const combinedRecruitments = [...schedules, ...closedSchedules];

  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const openRes = await axios.get(`${import.meta.env.VITE_APP_URL}/api/recruitments/open`, {
          headers: { Authorization: `Bearer Bearer ${token}` },
        });
        const closedRes = await axios.get(`${import.meta.env.VITE_APP_URL}/api/recruitments/closed`, {
          headers: { Authorization: `Bearer Bearer ${token}` },
        });

        const openData = openRes.data?.data?.flatMap((item) => {
          const range = getDateRange(item.startDate, item.endDate);
          return range.map((date) => ({
            id: item.id,
            date,
            title: `🔵 ${item.title}`
          }));
        }) || [];
        
        const closedData = closedRes.data?.data?.flatMap((item) => {
          const range = getDateRange(item.startDate, item.endDate);
          return range.map((date) => ({
            id: item.id,
            date,
            title: `🔴 ${item.title}`
          }));
        }) || [];
        

        setSchedules(openData);
        setClosedSchedules(closedData);
      } catch (err) {
        console.error("일정 불러오기 실패", err);
      }
    };

    fetchSchedules();
  }, []);

  console.log("스케줄 전체:",schedules)

  const getTileContent = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const matchOpen = schedules.find((s) => s.date === dateStr);
    const matchClosed = closedSchedules.find((s) => s.date === dateStr);

    if (matchOpen) {
      return <div className="dot dot-open" title={matchOpen.title}>{matchOpen.title}</div>;
    } else if (matchClosed) {
      return <div className="dot dot-closed" title={matchClosed.title}>{matchClosed.title}</div>;
    }    
    return null;
  };

  // 날짜 사이 범위 구하는 함수
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

// 모집 공고별로 그룹화
const groupedRecruitments = Object.values(
  combinedRecruitments.reduce((acc, curr) => {
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

// 날짜 정렬 + 시작~끝 포맷 적용
const renderedRecruitments = groupedRecruitments.map((r) => {
  const sorted = r.dates.sort(); // 날짜 순 정렬
  return {
    id: r.id,
    title: r.title,
    start: sorted[0],
    end: sorted[sorted.length - 1],
  };
});



  return (
    <div className="calendar-wrapper">
      <h2>🗓️일정</h2>

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

    // 모집중 또는 마감된 일정 중 해당 날짜에 해당하는 모집 찾기
    const matched =
      schedules.find((s) => s.date === dateStr) ||
      closedSchedules.find((s) => s.date === dateStr);

    if (matched) {
      navigate(`/clubsadmin/${clubId}/recruit/${matched.id}`);
    } else {
      console.log('해당 날짜에는 모집 공고 없음');
    }
  }}
/>


      <div className="schedule-list">
        <h3>📋 등록된 일정</h3>
        {[...schedules, ...closedSchedules].length === 0 ? (
          <p>등록된 일정이 없습니다.</p>
        ) : (
      <ul>
  {renderedRecruitments.map((r, i) => (
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
