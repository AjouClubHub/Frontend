import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../../styles/Main/Sidebar.css"

import { RiComputerLine } from "react-icons/ri";
import { MdHome } from "react-icons/md";

// 카테고리 목록
const categories = [
  '운동', '문화/예술/공연', 'IT', '봉사/사회활동', '학술/교양', '창업/취업'
];

const Sidebar = ({ onCategoryClick }) => {
  const navigate = useNavigate();  // useNavigate 훅 사용
  const [selectedCategories, setSelectedCategories] = useState([]); // 선택된 카테고리 상태 (배열로 다중 선택)

  // 내 동아리 관리 페이지로 이동
  const goToMyClubs = () => {
    navigate('/myclubs/home');
  };

  // 내 동아리 관리하기 페이지로 이동
  const goToClubAdmin = () => {
    navigate('/clubsadmin/home');
  };

  const goToMain = () => {
    navigate('/main/home')
  }

  // 카테고리 클릭 시 필터링하여 동아리/소학회 표시
  const handleCategoryClick = (category) => {
    console.log(`Category clicked: ${category}`);
    // 이미 선택된 카테고리를 클릭하면 선택 해제
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(item => item !== category)); // 카테고리 해제
    } else {
      // 선택되지 않은 카테고리를 클릭하면 선택
      setSelectedCategories([...selectedCategories, category]);
    }
    console.log('Selected Categories:', selectedCategories); // 선택된 카테고리 출력
    
    // 선택된 카테고리 배열을 전달하여 필터링
    onCategoryClick(selectedCategories.includes(category) ? 
      selectedCategories.filter(item => item !== category) : // 해제된 카테고리 제외
      [...selectedCategories, category] // 새로 추가된 카테고리
    );
  };

  return (
    <div className="sidebar">
      <div className="Home" onClick={goToMain}><MdHome /> 홈</div>
      <div className="club-management">
      <h4>My</h4>
        <button onClick={goToMyClubs}>내 소속(모임)</button>
        <button onClick={goToClubAdmin}>내 동아리 관리하기</button>
      </div>
      
      <div className="category-filter">
        <h4>카테고리</h4>
        {categories.map((category) => (
          <button 
            key={category} 
            className={selectedCategories.includes(category) ? 'selected' : ''} 
            onClick={() => handleCategoryClick(category)}
          >
            <input 
              type="checkbox" 
              checked={selectedCategories.includes(category)} 
              onChange={() => handleCategoryClick(category)} 
            />
            <span>{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
