import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../../styles/Main/Sidebar.css"

import { RiComputerLine } from "react-icons/ri";
import { MdHome } from "react-icons/md";

const categories = ['운동', '문화/예술/공연', 'IT', '봉사/사회활동', '학술/교양', '창업/취업'];

const Sidebar = ({ onCategoryClick }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategoryClick = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    onCategoryClick(updated);
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
