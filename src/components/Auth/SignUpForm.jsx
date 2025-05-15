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
  console.log(emailVerified)
  const [verificationCode, setVerificationCode] = useState("");
  const [studentIdChecked, setStudentIdChecked] = useState(false);



  const goToLogin = () => { navigate('/auth/login') };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      navigate('/main/home');
    }
  }, [navigate]);

  const handleChangeState = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailChecked(false);
      setEmailVerified(false);
    }
    if (e.target.name === "studentId") setStudentIdChecked(false);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  const checkEmailDuplicate = async () => {
    if (!state.email) {
      alert("이메일을 입력해주세요.");
      return;
    }
  
    const ajouEmailRegex = /^[^\s@]+@ajou\.ac\.kr$/;
    if (!ajouEmailRegex.test(state.email)) {
      alert("ajou.ac.kr 도메인 이메일만 사용할 수 있습니다.");
      return;
    }
  
    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/auth/email`, {
        params: { email: state.email }
      });
  
      const isDuplicate = res.data.data;
  
      if (isDuplicate) {
        alert("이미 가입된 이메일입니다.");
        setEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다. 인증 코드를 발송해주세요.");
        setEmailChecked(true);
        // ✅ 코드 발송은 이제 여기서 안 함!
      }
    } catch (err) {
      alert("이메일 중복 확인 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const sendVerificationCode = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_APP_URL}/api/auth/send-email`, {
        email: state.email
      });
      alert("인증 코드가 이메일로 발송되었습니다.");
    } catch (err) {
      alert("인증 코드 발송 중 오류 발생");
      console.error(err);
    }
  };
  
  

  const verifyEmailCode = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_APP_URL}/api/auth/verify-email`, {
        email: state.email,
        code: verificationCode.trim(), // 혹시 모를 공백 제거
      });
  
      console.log("응답 확인", res.data);
  
      // statusCode가 200 또는 문자열로 올 수도 있음
      if (
        res.data.statusCode === "200" ||
        res.data.statusCode === 200 ||
        res.data.statusCode === "OK"
      ) {
        alert("이메일 인증이 완료되었습니다.");
        setEmailVerified(true);
      } else {
        alert(res.data.message || "인증 코드가 일치하지 않습니다.");
      }

      console.log("이메일 인증 응답:",res.data)
  
    } catch (err) {
      console.error("🔥 인증 오류:", err.response?.data || err.message);
      alert("이메일 인증 중 오류가 발생했습니다.");
    }
  };
  

  const checkStudentIdDuplicate = async () => {
    if (!state.studentId) {
      alert("학번을 입력해주세요.");
      return;
    }

    try {
      const res = await axios.get(`${import.meta.env.VITE_APP_URL}/api/auth/studentId`, {
        params: { studentId: state.studentId }
      });

      const isDuplicate = res.data.data;

      if (isDuplicate) {
        alert("이미 사용 중인 학번입니다.");
        setStudentIdChecked(false);
      } else {
        alert("사용 가능한 학번입니다.");
        setStudentIdChecked(true);
      }

    } catch (err) {
      alert("학번 중복 확인 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const ajouEmailRegex = /^[^\s@]+@ajou\.ac\.kr$/;

    if (!emailRegex.test(state.email)) {
      email.current.focus();
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!ajouEmailRegex.test(state.email)) {
      email.current.focus();
      alert('ajou.ac.kr 도메인 메일만 가입할 수 있습니다.');
      return;
    }

    if (!state.name) {
      name.current.focus();
      alert("이름을 입력하세요");
      return;
    }

    if (state.password.length < 4) {
      password.current.focus();
      alert("비밀번호를 4글자 이상 입력하세요");
      return;
    }

    if (state.password !== state.re_password) {
      re_password.current.focus();
      alert("비밀번호가 다릅니다. 다시 입력하세요");
      return;
    }

    if (!state.memberRole) {
      alert("역할을 선택해주세요");
      return;
    }

    if (!state.major) {
      alert("학과를 선택해주세요");
      return;
    }

    // if (!emailChecked || !emailVerified) {
    //   alert("이메일 인증을 완료해주세요.");
    //   return;
    // }

    if (!studentIdChecked) {
      alert("학번 중복 확인을 해주세요.");
      return;
    }

    const dataToSend = {
      studentId: state.studentId,
      name: state.name,
      password: state.password,
      email: state.email,
      memberRole: state.memberRole,
      major: state.major
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_URL}/api/auth/signup`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.status === 200) {
        alert("회원가입에 성공하였습니다.");
        navigate('/auth/login');
      }
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("서버 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };


 



  return (
    <div className="SignUpForm">
      <button onClick={goToLogin} className="btn_back"><FaArrowLeft /></button>
      <h4>회원가입</h4>

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

      <div>
        <input
          ref={name}
          name="name"
          value={state.name}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="이름"
        />
      </div>

      <div>
        <input
          ref={password}
          name="password"
          type="password"
          value={state.password}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
          placeholder="비밀번호 재입력"
        />
      </div>

{/* 이메일 입력 + 중복 확인 + 인증코드 발송 버튼 (한 줄에) */}
<div className="input-with-double-buttons">
  <input
    ref={email}
    name="email"
    value={state.email}
    onChange={handleChangeState}
    onKeyDown={handleKeyDown}
    placeholder="이메일 (ajou.ac.kr)"
    className="with-check"
  />
  <button type="button" className="check-btn" onClick={checkEmailDuplicate}>
    중복 확인
  </button>

  {/* ✅ 중복 확인이 완료되고 아직 인증 전일 때만 코드 발송 버튼 노출 */}
  {emailChecked && !emailVerified && (
    <button
      type="button"
      className="check-btn"
      onClick={sendVerificationCode} // 따로 빼놓은 함수 사용
    >
      코드 발송
    </button>
  )}
</div>



{/* 인증 코드 입력 + 인증 확인 버튼 */}
{emailChecked && !emailVerified && (
  <div className="input-with-button">
    <input
      type="text"
      placeholder="인증 코드 입력"
      value={verificationCode}
      onChange={(e) => setVerificationCode(e.target.value)}
    />
    <button type="button" className="check-btn" onClick={verifyEmailCode}>
      인증 확인
    </button>
  </div>
)}

{/* 인증 완료되면 메시지 표시 */}
{emailVerified && (
  <p style={{ color: "green", fontWeight: "bold", marginTop: "5px" }}>
    ✅ 이메일 인증 완료
  </p>
)}


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

   


      <div className="half-width">
        <Select
          name="major"
          options={DepartmentParts}
          value={DepartmentParts.find(major => major.value === state.major)}
          onChange={e => handleChange({ target: { name: 'major', value: e.value } })}
          required
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