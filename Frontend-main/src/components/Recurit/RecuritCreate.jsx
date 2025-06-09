import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import '../../styles/Recurit/RecuritCreate.css';

const RecuritCreate = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const mode = state?.mode || 'recruit';

  const initialForm = {
    title: '',
    requirements: '',
    alwaysOpen: false,
    startDate: '',
    endDate: '',
    content: '',
    startTime: '',
    endTime: ''
  };
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');
    try {
      if (mode === 'recruit') {
        await axios.post(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitments`,
          {
            title: form.title,
            requirements: form.requirements,
            alwaysOpen: form.alwaysOpen,
            startDate: form.startDate,
            endDate: form.endDate
          },
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
        alert('모집공고가 등록되었습니다');
      } else {
        await axios.post(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/schedules`,
          {
            title: form.title,
            content: form.content,
            startTime: form.startTime,
            endTime: form.endTime
          },
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
        alert('일정이 등록되었습니다');
      }
      // 등록 후 리쿠르트 리스트 컴포넌트로 이동
      navigate(`/clubsadmin/${clubId}/recruit`);
    } catch (err) {
      console.error('등록 실패:', err);
      setError('등록 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="recruit-create-wrapper">
      <h2>{mode === 'recruit' ? '모집공고 등록' : '일정 등록'}</h2>
      <form onSubmit={handleSubmit} className="recruit-form">
        <label>
          제목
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </label>

        {mode === 'recruit' ? (
          <>
            <label>
              요구사항
              <input
                type="text"
                name="requirements"
                value={form.requirements}
                onChange={handleChange}
              />
            </label>
            <fieldset className="always-open-fieldset">
              <legend>상시모집 여부</legend>
              <label>
                <input
                  type="radio"
                  name="alwaysOpen"
                  value="true"
                  checked={form.alwaysOpen === true}
                  onChange={() =>
                    setForm(prev => ({ ...prev, alwaysOpen: true }))
                  }
                />{' '}
                예
              </label>
              <label>
                <input
                  type="radio"
                  name="alwaysOpen"
                  value="false"
                  checked={form.alwaysOpen === false}
                  onChange={() =>
                    setForm(prev => ({ ...prev, alwaysOpen: false }))
                  }
                />{' '}
                아니오
              </label>
            </fieldset>
            <label>
              시작일
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              종료일
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
            </label>
          </>
        ) : (
          <>
            <label>
              내용
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              시작시간
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              종료시간
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
              />
            </label>
          </>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="button-group">
          <button type="submit">등록</button>
          <button type="button" onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecuritCreate;
