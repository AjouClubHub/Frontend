import { Routes, Route, useOutletContext } from "react-router-dom";
import Main from  "../components/Main/Main"
import Application from "../components/Club/Application"

const MainPage = () => {
  const { selectedCategory } = useOutletContext(); // Layout에서 넘긴 값 받기

  return (
    <Routes>
      <Route path="home" element={<Main selectedCategory={selectedCategory} />} />
      <Route path=":clubId/application" element={<Application />} />
    </Routes>
  );
};

export default MainPage;
