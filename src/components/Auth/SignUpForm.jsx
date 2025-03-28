import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../../styles/Auth/SignupForm.css';
import { FaArrowLeft } from "react-icons/fa";

// todo: 이메일 인증

const SignUpForm = () => {
  // 기본설정
  const navigate = useNavigate();
  const name = useRef();
  const email = useRef();
  const password = useRef();
  const re_password = useRef();
  const memberRole = useRef();

  // 페이지 이동 설정
  const goToLogin = () => { navigate('/auth/login') };

  // 상태 설정
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    re_password: "",
    memberRole: ""
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('accesToken');
    if (accessToken) {
      navigate('/');
    }
  }, [navigate]);

  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 유효성 검사
    if (state.name.length < 1) {
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

    if (!emailRegex.test(state.email)) {
      email.current.focus();
      alert('올바른 이메일 형식이 아닙니다.');
      return;
    }

    if (!state.memberRole) {
      alert('역할을 선택해주세요');
      return;
    }

    // 보내는 데이터 확인 (console.log 추가)
    const dataToSend = {
      name: state.name,
      password: state.password,
      email: state.email,
      memberRole: state.memberRole,
    };

    console.log("보내는 데이터:", dataToSend); // 보내는 데이터 출력

    try {
      const response = await axios.post(`/api/auth/signup`, dataToSend, {
        headers: {
          'Auth-Token': localStorage.getItem('accesToken'),
        },
      });

      // 상태 코드에 따른 처리
      if (response.status === 200) {
        alert("회원가입에 성공하였습니다.");
        navigate('/auth/login');
      } else if (response.status === 400) {
        alert("회원가입 중 문제가 발생했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("로그인 만료. 다시 로그인해주세요.");
        navigate('/signin', { replace: true });
      } else {
        console.error('회원가입에 실패하였습니다.', error);
      }
    }
  };

  return (
    <div className="SignUpForm">
      <button onClick={goToLogin} className="btn_back"><FaArrowLeft /></button>
      <h4>회원가입</h4>
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
          type="password"  // 비밀번호 숨김 처리
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
          type="password"  // 비밀번호 재입력도 숨김 처리
          value={state.re_password}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="비밀번호 재입력"
        />
      </div>
      <div>
        <input
          ref={email}
          name="email"
          value={state.email}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
          placeholder="이메일"
        />
      </div>
      <div>
        <label htmlFor="role"></label>
        <select
          ref={memberRole}
          name="memberRole"
          value={state.memberRole}
          onChange={handleChangeState}
          onKeyDown={handleKeyDown}
        >
          <option value="">역할을 선택해주세요.</option>
          <option value="ADMIN">시스템 관리자</option>
          <option value="MANAGER">동아리 관리자</option>
          <option value="MEMBER">학생</option>
        </select>
      </div>
      <button onClick={handleSubmit}>회원가입하기</button>
    </div>
  );
};

export default SignUpForm;
