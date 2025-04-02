import React, { useState } from 'react';
import Select from 'react-select';
import DepartmentParts from '../../assets/Data/DepartmentParts'; // DepartmentParts 불러오기
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios'; // axios import
import '../../styles/Main/Application.css';

const Application = () => {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    department: '',
    dob: '',
    gender: '',
    phone: '',
    motivation: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
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

  const handleSelectChange = (e) => {
    setFormData({
      ...formData,
      department: e.value, // 선택된 값으로 department 업데이트
    });
  };

  const validateForm = () => {
    const { name, studentId, department, dob, gender, phone, motivation } = formData;

    if (!name || !studentId || !department || !dob || !gender || !phone || !motivation) {
      alert('모든 필드를 채워주세요.');
      return false;
    }

    if (!/^\d{10,11}$/.test(phone)) {  // 핸드폰 번호는 10자리 또는 11자리 숫자여야 함
      alert('핸드폰 번호는 숫자만 입력 가능하며, 10자리 또는 11자리여야 합니다.');
      return false;
    }

    return true;  // 모든 유효성 검사 통과
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      return;  // 유효성 검사에 실패하면 제출하지 않음
    }

    try {
      const response = await axios.post('/api/clubs/{clubId}/applications', formData);
      console.log('Response:', response.data); // 서버 응답을 로그로 출력

      if (response.status === 200) {
        alert('가입 신청이 성공적으로 완료되었습니다.');
        // 성공적으로 처리된 후 처리할 작업을 추가할 수 있습니다.
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('서버와의 통신 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <div className="application-back-button">
        <button type="button" className="application-back-button-btn"><FaArrowLeft /></button>
      </div>

      <h2 className="application-title">동아리 가입 신청</h2>

      <div className="application-form-box">
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="name">이름:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
        {/* 학과 선택 */}
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="department">가입 학과:</label>
            <Select
              name="department"
              options={DepartmentParts}
              value={DepartmentParts.find(department => department.value === formData.department)}
              onChange={handleSelectChange}
              required
              isSearchable
              placeholder="학과 선택"
              className="application-react-select-container"
            />
          </div>
        </div>
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="dob">생년월일:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
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
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>
        </div>
        <div className="application-form-group">
          <div className="application-half-width">
            <label htmlFor="phone">전화번호:</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
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
