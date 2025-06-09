import { Routes, Route, Navigate } from "react-router-dom";
import Layout from '../src/components/Layout/Layout';
import MainPage from "../src/pages/MainPage";
import GuestMain from "../src/components/Main/GuestMain";
import ClubsAdminPage from "../src/pages/ClubsAdminPage"
import MyClubsPage from "../src/pages/MyClubsPage";
import AuthPage from "../src/pages/AuthPage";
import SharePage from "../src/pages/SharePage";
import SseComponent from "../src/components/SSE/SseComponent";


function App() {
  const token = localStorage.getItem('accessToken');

  return (
    <>
      {token && <SseComponent />}

      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="main/home" replace />} />
          <Route
            path="main/*"
            element={token ? <MainPage /> : <GuestMain />}
          />
          <Route
            path="clubsadmin/*"
            element={
              token
                ? <ClubsAdminPage />
                : <Navigate to="/" replace />
            }
          />
          <Route
            path="myclubs/*"
            element={
              token
                ? <MyClubsPage />
                : <Navigate to="/" replace />
            }
          />
          <Route path="share" element={<SharePage />} />
        </Route>
        <Route path="auth/*" element={<AuthPage />} />  
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
