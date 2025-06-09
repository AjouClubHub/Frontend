// src/components/Main/Sidebar.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import "../../styles/Main/Sidebar.css";
import {
  MdOutlineComputer,
  MdOutlineSocialDistance,
  MdManageAccounts,
  MdOutlineAccountBox,
  MdOutlineChurch
} from "react-icons/md";
import { LuBicepsFlexed } from "react-icons/lu";
import { FaPaintBrush } from "react-icons/fa";
import { GrGallery } from "react-icons/gr";
import { PiSoccerBallFill } from "react-icons/pi";
import { IoSchoolOutline } from "react-icons/io5";
import { GoArrowRight } from "react-icons/go";

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

const Sidebar = ({ selectedCategory, onCategoryClick }) => {
  const navigate = useNavigate();

  const handleCategorySelect = (cat) => {
    // same click toggles off
    const next = selectedCategory === cat ? '' : cat;
    onCategoryClick(next);
  };

  return (
    <div className="sidebar">
      <h4>카테고리 선택</h4>
      <div className="category-buttons">
        {categories.map(cat => {
          const IconComponent = categoryIcons[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategorySelect(cat)}
              className={isActive ? 'radio-btn selected' : 'radio-btn'}
            >
              <span className="radio-indicator" />
              {IconComponent && (
                <IconComponent
                  size={18}
                  style={{ marginRight: '8px', verticalAlign: 'middle' }}
                />
              )}
              {cat}
            </button>
          );
        })}
      </div>

      <h4>My</h4>
      <button onClick={() => navigate('/myclubs/home')}>
        <MdOutlineAccountBox size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
        내 클럽
      </button>
      <button onClick={() => navigate('/clubsadmin/home')}>
        <MdManageAccounts size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }}/>
        내 클럽 관리하기
      </button>
    </div>
  );
};

export default Sidebar;
