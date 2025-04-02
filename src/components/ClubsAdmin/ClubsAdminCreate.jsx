import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import DepartmentParts from "../../assets/Data/DepartmentParts";
import "../../styles/ClubsAdmin/ClubsAdminCreate.css";  // 학과 목록을 외부 파일에서 불러오기
import axios from 'axios';  // axios 임포트

//todo: role이 clubsadmin일때만 페이지 들어올수있게
const ClubsAdminCreate = () => {
 
  const navigate = useNavigate();

  // 폼 상태 설정
  const [formData, setFormData] = useState({
    name: "",  // 클럽 이름 추가
    type: "",
    category: "",
    contacInfo: "",
    description: "",
    location:"",
    keyword: "",
    recruiredMajors: "",
  });

  // 폼 필드 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 데이터 처리 로직 추가
    console.log("폼 제출 데이터:", formData);
  
    // API 호출하여 서버로 데이터 전송
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}/api/clubs/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // JWT 토큰
        }
      });

      if (response.status === 200) {
        alert("동아리 개설에 성공했습니다.");
        navigate("/clubsadmin/home"); // 성공적으로 처리 후 홈으로 이동
      } else {
        alert("동아리 개설 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("동아리 개설 API 호출 중 에러 발생:", error);
      alert("동아리 개설에 실패했습니다.");
    }
  };

  return (
    <div className="club-create-form">
      <h2>동아리 개설하기</h2>

      <form onSubmit={handleSubmit}>
        {/* 클럽 이름 입력 칸 추가 */}
        <div className="form-box">
          <div>
            <label htmlFor="clubName">클럽 이름:</label>
            <input
              type="text"
              name="clubName"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="클럽 이름을 입력하세요"
            />
          </div>
        </div>

        {/* 기존 폼 내용 */}
        <div className="form-box">
          <div className="form-group">
            <div className="half-width">
              <label htmlFor="clubType">클럽 유형:</label>
              <select
                name="clubType"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="소학회">소학회</option>
                <option value="동아리">동아리</option>
              </select>
            </div>

            <div className="half-width">
              <label htmlFor="category">카테고리:</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">선택하세요</option>
                <option value="운동">운동</option>
                <option value="문화/예술/공연">문화/예술/공연</option>
                <option value="IT">IT</option>
                <option value="봉사/사회활동">봉사/사회활동</option>
                <option value="학술/교양">학술/교양</option>
                <option value="창업/취업">창업/취업</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-box">
          <div className="form-group">

            <div className="half-width">
              <label htmlFor="execPhone">임원진 번호:</label>
              <input
                type="text"
                name="execPhone"
                value={formData.contacInfo}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="form-box">
          <div className="form-group-vertical">
            <label htmlFor="intro">소개글:</label>
            <textarea
              name="intro"
              value={formData.keyword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-box">
          <div className="form-group-vertical">
            <label htmlFor="intro">동아리방 위치:</label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-box">
          <div className="form-group">
            <div className="half-width">
              <label htmlFor="department">가입 가능 학과:</label>
              <Select
                name="department"
                options={DepartmentParts}
                value={DepartmentParts.find(requiredMajors => requiredMajors.value === formData.recruiredMajors)}
                onChange={e => handleChange({ target: { name: 'requiredMajors', value: e.value } })}
                required
                isSearchable
                placeholder="학과 선택"
              />
            </div>

           
          </div>
        </div>

        <button type="submit">동아리 개설하기</button>
      </form>
    </div>
  );
};

export default ClubsAdminCreate;
