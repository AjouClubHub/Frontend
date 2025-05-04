import './App.css'
import {BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter} from "react-router-dom"
import Layout from './components/Layout/Layout';
import AuthPage from "./pages/AuthPage";
import MainPage from "./pages/MainPage"
import ClubsAdminPage from "./pages/ClubsAdminPage"
import MyClubsPage from "./pages/MyClubsPage"







//1."/":모든 일기를 조회하는 Home 페이지
//2. "new":새로운 일기를 작성하는 New 페이지
//3. "diary":일기를 상세히 조회하는 Diary페이지

//원하는 경로에 원하는 컴포넌트를 불러올 수 있음

//Route 컴포넌트안에는 Route만 있을수있음

//<div>hello</div>는 모든 컴포넌트에서 렌더링됨

//<Link>이용하면 훨씬더 렌더링 없이 사용할 수 있음

//이벤트헨들러안에서 특정페이지로 이동이 필요할때는 usenavigate

//이미지는 랜더링을 줄이고 메모리크기를 최적화시키기 위해 import로 불러와야함





function App() {
  const userId = localStorage.getItem("userId");

 

  return (
    <>


    <Routes>
          {/* 초기 경로 설정 */}
          <Route element={<Layout />}>
          <Route path="/" element={<Navigate to={userId ? "/main" : "/auth/login"} replace />} />
          <Route path="/main/*" element={<MainPage/>} />
          <Route path="/clubsadmin/*" element={<ClubsAdminPage/>}/>
          <Route path="/myclubs/*" element={<MyClubsPage/>}/>
        
          </Route>
          {/* 주요 페이지 라우팅 */}
          <Route path="/auth/*" element={<AuthPage />} />
         
    
      
    </Routes>



   
   

      
       


      
    </>
  
  )
}

export default App
