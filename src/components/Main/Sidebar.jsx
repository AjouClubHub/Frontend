import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Main/Sidebar.css";

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
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (cat) => {
    const next = selectedCategory === cat ? '' : cat;  // same click toggles off
    setSelectedCategory(next);
    onCategoryClick && onCategoryClick(next);
  };

  return (
    <div className="sidebar">
      <h4>카테고리 선택</h4>
      <div className="category-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => handleCategorySelect(cat)}
            className={selectedCategory === cat ? 'radio-btn selected' : 'radio-btn'}
          >
            <span className="radio-indicator" />
            {cat}
          </button>
        ))}
      </div>

      <h4>My</h4>
      <button onClick={() => navigate('/myclubs/home')}>내 클럽</button>
      <button onClick={() => navigate('/clubsadmin/home')}>내 클럽 관리하기</button>
    </div>
  );
};

export default Sidebar;
