import { Routes, Route, useOutletContext, useLocation } from "react-router-dom";
import Main from  "../components/Main/Main"
import Application from "../components/Club/Application"
import usePageTitle from '../hooks/usePageTitle.jsx';

const MainPage = () => {
  const { selectedCategory } = useOutletContext(); // Layout에서 넘긴 값 받기

  const location = useLocation();  // 현재 URL 정보를 가져오기

   // 경로에 따른 페이지 제목 설정
   const getPageTitle = (path) => {
    if (path.includes('home')) {
      return 'Clubing';  // 'member'로 시작하는 경로
    } else if (path.includes('application')) {
      return '가입신청 :Clubing';  // 'notice'로 시작하는 경로
    } 
    return 'Clubing';  // 기본 제목
  };



  // 현재 URL 경로에 맞는 제목을 설정
  usePageTitle(getPageTitle(location.pathname));

  return (
    <Routes>
      <Route path="home" element={<Main selectedCategory={selectedCategory} />} />
      <Route path=":clubId/application" element={<Application />} />
    </Routes>
  );
};

export default MainPage;
