import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../../styles/Main/Sidebar.css"

import { RiComputerLine } from "react-icons/ri";
import { MdHome } from "react-icons/md";

// ✨ 카테고리 수정
const categories = [
  '과학기술분과',
  '레저스포츠분과',
  '사회활동분과',
  '연행예술분과',
  '종교분과',
  '창작전시분과',
  '체육분과',
  '학술언론분과',
  '준동아리'
];

const Sidebar = ({ onCategoryClick }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
  
    setSelectedCategories(updated);
    
    if (onCategoryClick) {
      onCategoryClick(updated); // ✅ 안전하게 함수가 있을 때만 호출
    }
  };
  

  return (
    <div className="sidebar">
      <h4>카테고리</h4>
      {categories.map((cat) => (
        <button key={cat} onClick={() => handleCategoryClick(cat)}>
          <input type="checkbox" checked={selectedCategories.includes(cat)} readOnly />
          {cat}
        </button>
      ))}
      <h4>My</h4>
      <button onClick={() => navigate('/myclubs/home')}>내 소속(모임)</button>
      <button onClick={() => navigate('/clubsadmin/home')}>내 동아리 관리하기</button>
    </div>
  );
};

export default Sidebar;
