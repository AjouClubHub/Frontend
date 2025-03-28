import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Main from '../components/Main/Main'
import Clubs from '../components/Main/Clubs'
import Society from '../components/Main/Society'
import Application from '../components/Main/Application'
import MainDetail from '../components/Main/MainDetail'

const MainPage = () => {
    return (
        <div>
            <Routes>
            <Route path="/" element={<Navigate to="/main/home" replace />} />
            <Route path="/home" element={<Main />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/scoiety" element={<Society />} />
            <Route path="/application" element={<Application />} />
            <Route path="/maindetail" element={<MainDetail />} />
            </Routes>
            

        </div>
    )
}

export default MainPage;