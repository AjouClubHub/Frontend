import React, { useState } from 'react';
import {useNavigate,useParams } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios'; // axios import
import '../../styles/Club/Application.css';

//todo 전화번호
const Application = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    birthDate: '',
    gender: '',
    phoneNumber: '',
    motivation: '',
  });

  const navigate = useNavigate();
  const {clubId} = useParams();


  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === 'phoneNumber') {
      // 1️⃣ 숫자만 남기기
      const onlyNumber = value.replace(/[^0-9]/g, '');
  
      // 2️⃣ 하이픈 자동 추가
      let formatted = onlyNumber;
      if (onlyNumber.length <= 3) {
        formatted = onlyNumber;
      } else if (onlyNumber.length <= 7) {
        formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
      } else {
        formatted = `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7, 11)}`;
      }
  
      setFormData({
        ...formData,
        [name]: formatted,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  

  const validateForm = () => {
    const { studentId,  birthDate, gender, phoneNumber, motivation } = formData;

    if ( !studentId || !birthDate || !gender || !phoneNumber || !motivation) {
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
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
    
      if (response.status === 200) {
        alert('가입 신청이 성공적으로 완료되었습니다.');
        navigate('/main');
      }
    } catch (error) {
      const { code, message } = error.response?.data || {};
    
      if (code === "MAJOR_REQUIREMENT_NOT_MET") {
        alert(message);
      } else if (code === "DUPLICATE_APPLICATION") {
        alert(message);
      } else {
        console.error('가입 신청 실패:', error);
        alert('❌ 서버와의 통신 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
    
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className='application-title'>
        <button type="button" className='application-back-button-btn' onClick={()=> navigate(-1)}>
          <FaArrowLeft />
        </button>
        <h2 className='application-title'>동아리 가입 신청</h2>
      </div>
   

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
