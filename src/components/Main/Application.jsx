import React, { useState } from 'react';
import {useParams,useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios'; // axios import
import '../../styles/Main/Application.css';


//todo 전화번호
const Application = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    major: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
    motivation: '',
  });

  const navigate = useNavigate();

 const { id } = useParams();
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phoneNmuber') {
      // 핸드폰 번호에서 숫자만 허용하고 '-' 입력 시 경고
      if (value.includes('-')) {
        alert('핸드폰 번호에는 "-"를 입력할 수 없습니다.');
        return; // '-' 입력시 값을 업데이트하지 않음
      }
      // 숫자만 허용, 다른 문자는 제거
      const numericValue = value.replace(/[^0-9]/g, ''); // 숫자 이외의 문자 제거
      setFormData({
        ...formData,
        [name]: numericValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };


  const validateForm = () => {
    const { studentId, major, birthDate, gender, phoneNumber, motivation } = formData;

    if ( !studentId || !major || !birthDate || !gender || !phoneNumber || !motivation) {
      alert('모든 필드를 채워주세요.');
      return false;
    }


    return true;  // 모든 유효성 검사 통과
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요한 서비스입니다.");
      navigate('/auth/login');
      return;
    }
  
    try {
      // ✅ 1. 현재 동아리 정보 불러오기
      const clubRes = await axios.get(`${import.meta.env.VITE_APP_URL}/api/clubs/${id}`, {
        headers: {
          Authorization: `Bearer Bearer ${token}`
        }
      });
  
      const joinRequirement = clubRes.data?.data?.joinRequirement;
  
      // ✅ 2. 학과 비교
      if (joinRequirement && joinRequirement !== formData.major) {
        alert(`가입 가능 학과는 "${joinRequirement}"입니다.`);
        return;
      }
  
      console.log("전송데이터:", formData);
  
      // ✅ 3. 실제 가입 요청 보내기
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${id}/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        alert('가입 신청이 성공적으로 완료되었습니다.');
        navigate('/main'); // 가입 완료 후 메인으로 이동 등 처리
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('서버와의 통신 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className="application-back-button">
        <button type="button" className="application-back-button-btn" onClick={() => navigate(`/main/home`)} ><FaArrowLeft /></button>
      </div>

      <h2 className="application-title">동아리 가입 신청</h2>

      <div className="application-form-box">
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="studentId">학번:</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="dob">생년월일:</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
          </div>
          <div className="application-half-width">
            <label htmlFor="gender">성별:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">성별 선택</option>
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </select>
          </div>
        </div>
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="phoneNumber">전화번호:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="application-form-group-vertical">
          <label htmlFor="motivation">지원동기:</label>
          <textarea
            id="motivation"
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="application-submit-btn">가입 신청</button>
      </div>
    </form>
  );
};

export default Application;
