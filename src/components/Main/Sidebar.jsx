import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Main/Sidebar.css';
import { MdOutlineComputer, MdOutlineSocialDistance, MdManageAccounts, MdOutlineAccountBox } from 'react-icons/md';
import { LuBicepsFlexed } from 'react-icons/lu';
import { FaPaintBrush } from 'react-icons/fa';
import { GrGallery } from 'react-icons/gr';
import { PiSoccerBallFill } from 'react-icons/pi';
import { IoSchoolOutline } from 'react-icons/io5';
import { MdOutlineChurch } from 'react-icons/md';
import { GoArrowRight } from 'react-icons/go';

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

const categoryIcons = {
  '과학기술분과': MdOutlineComputer,
  '레저스포츠분과': LuBicepsFlexed,
  '사회활동분과': MdOutlineSocialDistance,
  '연행예술분과': FaPaintBrush,
  '창작전시분과': GrGallery,
  '체육분과': PiSoccerBallFill,
  '학술언론분과': IoSchoolOutline,
  '종교분과': MdOutlineChurch,
  '준동아리': GoArrowRight,
};

const Sidebar = ({ onCategoryClick, hideMyCategory = false }) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategorySelect = (cat) => {
    const next = selectedCategory === cat ? '' : cat;
    setSelectedCategory(next);
    onCategoryClick && onCategoryClick(next);
  };

  return (
    <div className="sidebar">
      <h4>카테고리 선택</h4>
      <div className="category-buttons">
        {categories.map(cat => {
          const IconComponent = categoryIcons[cat];
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={selectedCategory === cat ? 'radio-btn selected' : 'radio-btn'}
            >
              <div className="btn-content">
                {IconComponent && <IconComponent className="btn-icon" size={18} />}
                <span className="btn-label">{cat}</span>
              </div>
            </button>
          );
        })}
      </div>

      {!hideMyCategory && (
        <>
          <h4>My</h4>
          <button type="button" onClick={() => navigate('/myclubs/home')}>
            <MdOutlineAccountBox size={18} style={{ marginRight: '8px', verticalAlign: 'middle',  }} />
            내 클럽
          </button>
          <button type="button" onClick={() => navigate('/clubsadmin/home')}>
            <MdManageAccounts size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
            내 클럽 관리하기
          </button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
