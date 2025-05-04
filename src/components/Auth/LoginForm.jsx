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
      alert("이메일과 비밀번호를 모두 입력하세요.");
    } else if (email === "") {
      alert("이메일을 입력하세요.");
    } else if (password === "") {
      alert("비밀번호를 입력하세요.");
    } else {
      // 로그인 요청
      axios
        .post(`${import.meta.env.VITE_APP_URL}/api/auth/login`, {
          email: email,
          password: password
        })
        .then((result) => {
          const token = result.data.token;
          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken", token.replace("Bearer ", ""));
          alert("로그인에 성공했습니다.");
          navigate('/main/home');
        })
        .catch((error) => {
          console.error("로그인 오류:", error);
  
          if (error.response) {
            const status = error.response.status;
  
            switch (status) {
              case 400:
                alert("비밀번호가 일치하지 않습니다.");
                break;
              case 401:
                alert("인증되지 않은 사용자입니다. 이메일을 확인해주세요.");
                break;
              case 403:
                alert("접근 권한이 없습니다.");
                break;
              case 404:
                alert("존재하지 않는 회원입니다.");
                break;
              case 500:
                alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
                break;
              default:
                alert(`알 수 없는 오류가 발생했습니다. (상태 코드: ${status})`);
            }
          } else {
            alert("네트워크 오류가 발생했습니다. 인터넷 연결을 확인하세요.");
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
