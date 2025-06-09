import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/Auth/SignUpForm.css';
import { FaArrowLeft } from "react-icons/fa";
import DepartmentParts from "../../assets/Data/DepartmentParts";
import Select from "react-select";

const SignUpForm = () => {
  const navigate = useNavigate();

  const name = useRef();
  const email = useRef();
  const password = useRef();
  const re_password = useRef();
  const memberRole = useRef();
  const studentId = useRef();

  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    re_password: "",
    memberRole: "",
    major: "",
    studentId: ""
  });

  const [emailChecked, setEmailChecked] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [studentIdChecked, setStudentIdChecked] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) navigate('/main/home');
  }, [navigate]);

  const handleChangeState = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailChecked(false);
      setEmailVerified(false);
    }
    if (e.target.name === "studentId") setStudentIdChecked(false);
  };

  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSubmit(e); };

  const checkEmailDuplicate = async () => {
    if (!state.email) return alert("이메일을 입력해주세요.");
    const ajouEmailRegex = /^[^\s@]+@ajou\.ac\.kr$/;
    if (!ajouEmailRegex.test(state.email)) return alert("ajou.ac.kr 도메인 이메일만 사용할 수 있습니다.");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/auth/email`, { params: { email: state.email } });
      if (res.data.data) {
        alert("이미 가입된 이메일입니다.");
        setEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      }
    } catch (err) {
      console.error(err);
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const sendVerificationCode = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_URL}/api/auth/send-email`, { email: state.email });
      alert("인증 코드가 이메일로 발송되었습니다.");
    } catch (err) {
      console.error(err);
      alert("인증 코드 발송 중 오류 발생");
    }
  };

  const verifyEmailCode = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_URL}/api/auth/verify-email`, {
        email: state.email,
        code: verificationCode.trim(),
      });
      if (["200", 200, "OK"].includes(res.data.statusCode)) {
        alert("이메일 인증이 완료되었습니다.");
        setEmailVerified(true);
        setEmailChecked(true);
      } else {
        alert(res.data.message || "인증 코드가 일치하지 않습니다.");
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("이메일 인증 중 오류가 발생했습니다.");
    }
  };

  const checkStudentIdDuplicate = async () => {
    if (!state.studentId) return alert("학번을 입력해주세요.");
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/auth/studentId`, { params: { studentId: state.studentId } });
      if (res.data.data) {
        alert("이미 사용 중인 학번입니다.");
        setStudentIdChecked(false);
      } else {
        alert("사용 가능한 학번입니다.");
        setStudentIdChecked(true);
      }
    } catch (err) {
      console.error(err);
      alert("학번 중복 확인 중 오류가 발생했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ajouEmailRegex = /^[^\s@]+@ajou\.ac\.kr$/;
    if (!ajouEmailRegex.test(state.email)) {
      email.current.focus();
      return alert('ajou.ac.kr 도메인 메일만 가입할 수 있습니다.');
    }
    if (!state.name) return name.current.focus() || alert("이름을 입력하세요");
    if (state.password.length < 4) return password.current.focus() || alert("비밀번호를 4글자 이상 입력하세요");
    if (state.password !== state.re_password) return re_password.current.focus() || alert("비밀번호가 다릅니다. 다시 입력하세요");
    if (!state.memberRole) return alert("역할을 선택해주세요");
    if (!state.major) return alert("학과를 선택해주세요");
    if (!studentIdChecked) return alert("학번 중복 확인을 해주세요.");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/auth/signup`, state,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status === 200) {
        alert("회원가입에 성공하였습니다.");
        navigate('/auth/login');
      }
    } catch (error) {
      console.error(error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="SignUpForm">
      <button onClick={() => navigate('/auth/login')} className="btn_back">
        <FaArrowLeft />
      </button>
      <h4>회원가입</h4>

      {/* 학번 입력 */}
      <div className="input-with-button">
        <input
          ref={studentId}
          name="studentId"
          value={state.studentId}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="학번"
          className="with-check"
        />
        <button type="button" className="check-btn" onClick={checkStudentIdDuplicate}>
          중복 확인
        </button>
      </div>

      {/* 이름 */}
      <div>
        <input ref={name} name="name" value={state.name} onChange={handleChangeState} placeholder="이름" />
      </div>

      {/* 비밀번호 */}
      <div>
        <input
          ref={password}
          name="password"
          type="password"
          value={state.password}
          onChange={handleChangeState}
          placeholder="비밀번호"
        />
      </div>
      <div>
        <input
          ref={re_password}
          name="re_password"
          type="password"
          value={state.re_password}
          onChange={handleChangeState}
          placeholder="비밀번호 재입력"
        />
        {state.re_password && state.password !== state.re_password && (
          <p style={{ color: 'red', margin: '4px 0' }}>비밀번호가 다릅니다.</p>
        )}
      </div>

      {/* 이메일 입력 및 버튼 */}
      <div className="input-with-double-buttons">
        <input
          ref={email}
          name="email"
          value={state.email}
          onChange={handleChangeState}
          placeholder="이메일 (ajou.ac.kr)"
          className="with-check"
        />
        <button
          type="button"
          className="check-btn"
          onClick={emailChecked ? sendVerificationCode : checkEmailDuplicate}
        >
          {emailChecked
            ? emailVerified
              ? '인증 완료'
              : '코드 발송'
            : '중복 확인'}
        </button>
      </div>

      {/* 인증 코드 입력 및 확인 */}
      {emailChecked && !emailVerified && (
        <div className="input-with-button">
          <input
            type="text"
            placeholder="코드 발송 후 인증 코드 입력"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
          <button type="button" className="check-btn" onClick={verifyEmailCode}>
            인증 확인
          </button>
        </div>
      )}
      {emailVerified && (
        <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
          ✅ 이메일 인증 완료
        </p>
      )}

      {/* 역할 선택 */}
      <div>
        <select
          ref={memberRole}
          name="memberRole"
          value={state.memberRole}
          onChange={handleChangeState}
          className="form-input"
        >
          <option value="">역할 선택</option>
          <option value="ADMIN">시스템 관리자</option>
          <option value="MANAGER">동아리 관리자</option>
          <option value="MEMBER">학생</option>
        </select>
      </div>

      {/* 전공 선택 */}
      <div className="half-width">
        <Select
          name="major"
          options={DepartmentParts}
          value={DepartmentParts.find(major => major.value === state.major)}
          onChange={e => handleChangeState({ target: { name: 'major', value: e.value } })}
          isSearchable
          classNamePrefix="react-select"
          placeholder="학과 선택"
        />
      </div>

      <button onClick={handleSubmit}>회원가입하기</button>
    </div>
  );
};

export default SignUpForm;