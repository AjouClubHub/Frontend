import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import SseComponent from '../src/components/SSE/SseComponent';
import NotificationPopup from '../src/components/store/NotificationPopup';
import './index.css';
import 'react-toastify/dist/ReactToastify.css';

function Root() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('accessToken');
    setToken(t);
  }, []);

  return (
    <>
      {token && <SseComponent />}
      <NotificationPopup />
      <App />
    </>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RecoilRoot>
      <BrowserRouter>
          <Root />
      </BrowserRouter>
    </RecoilRoot>
  </React.StrictMode>
);
