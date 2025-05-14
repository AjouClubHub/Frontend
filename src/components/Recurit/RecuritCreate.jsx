import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Recurit/RecuritCreate.css"; // 기존 스타일 재사용

const RecuritCreate = () => {
  const { clubId, scheduleId } = useParams();  // scheduleId로 수정할 일정을 받음
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    startTime: "",
    endTime: "",
  });

  const [error, setError] = useState(null);

  // 일정 데이터를 불러오기 위한 useEffect (수정 모드일 때)
  useEffect(() => {
    if (scheduleId) {
      fetchSchedule(scheduleId);  // scheduleId가 있으면 수정 모드
    }
  }, [scheduleId]);

  const fetchSchedule = async (scheduleId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setForm({
        title: res.data.data.title,
        content: res.data.data.content,
        startTime: res.data.data.startTime,
        endTime: res.data.data.endTime,
      });
    } catch (err) {
      console.error("일정 조회 실패:", err);
      setError("일정 정보를 불러오는 데 실패했습니다.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    console.log("요청할 데이터:", form);  // 보내는 데이터
    console.log("Authorization 헤더:", `Bearer Bearer ${token}`);  // Authorization 헤더 확인

    try {
      if (scheduleId) {
        // 수정 모드: PUT 요청
        await updateSchedule(scheduleId, form, token);
      } else {
        // 등록 모드: POST 요청
        await createSchedule(form, token);
      }
    } catch (err) {
      console.error("일정 등록/수정 실패:", err);
      setError("등록/수정에 실패했습니다. 입력값과 권한을 확인해주세요.");
    }
  };

  // 일정 등록 함수 (POST)
  const createSchedule = async (form, token) => {
    try {
      const url = `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules`;

      const response = await axios.post(url, form, {
        headers: {
          Authorization: `Bearer Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("일정이 등록되었습니다!");
      navigate(`/clubs/${clubId}/schedules/${response.data.data.id}`); // 새로 등록된 일정의 상세 페이지로 이동
    } catch (err) {
      setError("일정 등록 중 오류가 발생했습니다.");
      throw err;
    }
  };

  // 일정 수정 함수 (PUT)
  const updateSchedule = async (scheduleId, form, token) => {
    try {
      const url = `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules/${scheduleId}`;

      const response = await axios.put(url, form, {
        headers: {
          Authorization: `Bearer Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("일정이 수정되었습니다!");
      navigate(`/clubsadmin/${clubId}/recruit/${response.data.data.id}`); // 수정된 일정의 상세 페이지로 이동
    } catch (err) {
      setError("일정 수정 중 오류가 발생했습니다.",err);

    }
  };

  return (
    <div className="recruit-create-wrapper">
      <h2>🗓️ 일정 {scheduleId ? "수정" : "등록"}</h2>
      <form onSubmit={handleSubmit} className="recruit-form">
        <label>
          일정 제목
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="예: OT 일정, 정기모임 등"
            required
          />
        </label>

        <label>
          내용
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="일정 상세 내용을 입력하세요"
            required
          />
        </label>

        <label>
          시작 일시
          <input
            type="datetime-local"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          종료 일시
          <input
            type="datetime-local"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="button-group">
          <button type="submit">{scheduleId ? "수정하기" : "등록하기"}</button>
          <button type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default RecuritCreate;
