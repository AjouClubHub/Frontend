import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Main from '../components/Main/Main'
import Application from '../components/Club/Application';


const MainPage = () => {
    return (
        <div>
            <Routes>
            <Route path="/" element={<Navigate to="/main/home" replace />} />
            <Route path="/home" element={<Main />} />
            <Route path="/:clubId/application" element={< Application/>} />
            </Routes>
            

        </div>
    )
}

export default MainPage;