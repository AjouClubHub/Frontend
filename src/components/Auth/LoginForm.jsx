import React, { useState } from "react";
import axios from "axios";
import { NavLink ,useNavigate} from "react-router-dom";
import "../../styles/Auth/LoginForm.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const activeEnter = (e) => {
    if (e.key === "Enter") {
      onClickLogin();
    }
  };

  const onClickLogin = () => {
    if (email === "" && password === "") {
      alert("email, password를 입력하세요.");
    } else if (password === "") {
      alert("password를 입력하세요.");
    } else if (email === "") {
      alert("email을 입력하세요.");
    } else {
      // 로그인 요청
      axios
        .post(`${import.meta.env.VITE_APP_URL}/api/auth/login`, {
          email: email,
          password: password
        })
        .then(function (result) {
        

          localStorage.removeItem("accessToken");
          const token = result.data.token; // 서버에서 받은 토큰

          // 로컬스토리지에 토큰 저장
          localStorage.setItem("accessToken", token.replace("Bearer ", "")); // Bearer를 제외하고 저장

          // 로그인 후 홈 페이지로 이동
          navigate('/main/home');
        })
        .catch((error) => {
          console.log("로그인 오류. 다시 시도해주세요.");
          if (error.response !== undefined) {
            if (error.response.status === 404) alert("존재하지 않는 회원입니다.");
            else if (error.response.status === 400) alert("패스워드가 일치하지 않습니다.");
          }
        });
    }
  };

  return (
    <div className="LoginForm">
      <h4>로그인</h4>
      <div>
        <input
          type="text"
          name="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => activeEnter(e)}
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => activeEnter(e)}
        />
      </div>
      <button className="login-button" onClick={onClickLogin}>
        로그인
      </button>
      <div className="font-custom">
        <NavLink to="/auth/signup">
          <u className="font-custom-two">회원가입</u>
        </NavLink>
      </div>
    </div>
  );
};

export default LoginForm;
