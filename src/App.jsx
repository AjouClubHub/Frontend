import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate,useLocation} from "react-router-dom"
import Navbar from "./components/Main/Navbar";
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage"
import ClubsAdminPage from "./pages/ClubsAdminPage"
import { Children } from 'react';




//1."/":모든 일기를 조회하는 Home 페이지
//2. "new":새로운 일기를 작성하는 New 페이지
//3. "diary":일기를 상세히 조회하는 Diary페이지

//원하는 경로에 원하는 컴포넌트를 불러올 수 있음

//Route 컴포넌트안에는 Route만 있을수있음

//<div>hello</div>는 모든 컴포넌트에서 렌더링됨

//<Link>이용하면 훨씬더 렌더링 없이 사용할 수 있음

//이벤트헨들러안에서 특정페이지로 이동이 필요할때는 usenavigate

//이미지는 랜더링을 줄이고 메모리크기를 최적화시키기 위해 import로 불러와야함


const Layout = ({children}) => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/auth");
  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
    </>
  );
  

}


function App() {
 

  return (
    <>
      
        <Routes>
          {/* 초기 경로 설정 */}
          {/* 주요 페이지 라우팅 */}
          <Route path="/auth/*" element={<AuthPage />} />
          <Route path="/main/*" element={<MainPage/>} />
          <Route path="/clubsadmin/*" element={<ClubsAdminPage/>}/>
      
    </Routes>
   


      
    </>
  
  )
}

export default App
