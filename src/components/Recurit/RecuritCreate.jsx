import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Recurit/RecuritCreate.css"; // 필요시 CSS 생성

const RecuritCreate = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    requirements: "",
    startDate: "",
    endDate: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/recruitments`,
        form,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("모집 공고가 등록되었습니다!");
      navigate(`/clubsadmin/${clubId}/recruit`);
    } catch (err) {
      console.error("모집 등록 실패:", err);
      setError("등록에 실패했습니다. 입력값과 권한을 확인해주세요.");
    }
  };

  return (
    <div className="recruit-create-wrapper">
      <h2>📢 모집 공고 등록</h2>
      <form onSubmit={handleSubmit} className="recruit-form">
        <label>
          제목
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="모집 제목 입력"
            required
          />
        </label>

        <label>
          자격 요건
          <textarea
            name="requirements"
            value={form.requirements}
            onChange={handleChange}
            placeholder="자격 요건 입력"
            required
          />
        </label>

        <label>
          모집 시작일
          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          모집 마감일
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <div className="button-group">
          <button type="submit">등록하기</button>
          <button type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default RecuritCreate;
