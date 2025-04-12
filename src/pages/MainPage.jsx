import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Main from '../components/Main/Main'
import Application from '../components/Main/Application'


const MainPage = () => {
    return (
        <div>
            <Routes>
            <Route path="/" element={<Navigate to="/main/home" replace />} />
            <Route path="/home" element={<Main />} />
            <Route path="/:id/application" element={<Application />} />
            </Routes>
            

        </div>
    )
}

export default MainPage;