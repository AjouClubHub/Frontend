import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../styles/Auth/Setting.css';
import { IoArrowBackSharp } from "react-icons/io5";

const Setting = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [applicationStatus, setApplicationStatus] = useState([]);
  const [notifications, setNotifications] = useState([]); // Unread notifications
  const [previousNotifications, setPreviousNotifications] = useState([]); // Read notifications
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('profile');

  const token = localStorage.getItem('accessToken');
  const apiUrl = import.meta.env.VITE_APP_URL;

  const fetchMemberInfoAndNotifications = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/member/mypage`, {
        headers: { Authorization: `Bearer Bearer ${token}` }
      });
      const data = response.data.data;
      setMember(data.member);
      setJoinedClubs(data.joinedClubs || []);
      setApplicationStatus(data.applications || []);

      const notificationsResponse = await axios.get(
        `${apiUrl}/api/notifications`,
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      const allNotes = notificationsResponse.data.data || [];
      // Separate unread and read
      setNotifications(allNotes.filter(n => !n.isRead));
      setPreviousNotifications(allNotes.filter(n => n.isRead));
    } catch (error) {
      console.error('회원 정보를 불러오는 데 실패했습니다:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(
        `${apiUrl}/api/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer Bearer ${token}` } }
      );
      // Move to previousNotifications
      setNotifications(prev => {
        const remaining = prev.filter(n => n.id !== notificationId);
        const marked = prev.find(n => n.id === notificationId);
        if (marked) {
          setPreviousNotifications(prevPrev => [
            { ...marked, isRead: true },
            ...prevPrev
          ]);
        }
        return remaining;
      });
    } catch (error) {
      console.error('알림 읽음 처리에 실패했습니다:', error);
    }
  };

  useEffect(() => {
    fetchMemberInfoAndNotifications();
  }, []);

  if (loading) return <p className="loading">로딩 중...</p>;
  if (!member) return <p className="error">회원 정보가 없습니다.</p>;

  return (
    <div className="mypage-container">
      <button className="back-button" onClick={() => navigate('/main/home')}><IoArrowBackSharp /></button>

      <div className="tab-buttons">
        <button
          className={view === 'profile' ? 'active' : ''}
          onClick={() => setView('profile')}
        >회원 정보</button>
        <button
          className={view === 'applications' ? 'active' : ''}
          onClick={() => setView('applications')}
        >가입 내역 확인</button>
        <button
          className={view === 'notifications' ? 'active' : ''}
          onClick={() => setView('notifications')}
        >알림</button>
      </div>

      {view === 'profile' && (
        <section className="user-info">
          <h3>회원 정보</h3>
          <p><strong>이름:</strong> {member.name}</p>
          <p><strong>이메일:</strong> {member.email}</p>
          <p><strong>전공:</strong> {member.major}</p>
          <p><strong>학번:</strong> {member.studentId}</p>
        </section>
      )}

      {view === 'applications' && (
        <>
          <section className="joined-clubs">
            <h3>가입한 클럽</h3>
            {joinedClubs.length > 0 ? (
              <ul>
                {joinedClubs.map(club => (
                  <li key={club.id}>
                    <p>{club.name}</p>
                    <p>{club.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>가입한 클럽이 없습니다.</p>
            )}
          </section>

          <section className="application-status">
            <h3>가입 신청 현황</h3>
            {applicationStatus.length > 0 ? (
              <ul>
                {applicationStatus.map(app => (
                  <li key={app.id}>
                    <p>{app.clubName}</p>
                    <p>{app.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>가입 신청이 없습니다.</p>
            )}
          </section>
        </>
      )}

      {view === 'notifications' && (
        <section className="notifications">
          <h3>새 알림</h3>
          {notifications.length > 0 ? (
            <ul>
              {notifications.map(notification => (
                <li
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className="unread"
                >
                  <p>{notification.content}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>새 알림이 없습니다.</p>
          )}

          <h3>이전 알림</h3>
          {previousNotifications.length > 0 ? (
            <ul>
              {previousNotifications.map(notification => (
                <li key={notification.id} className="read">
                  <p>{notification.content}</p>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          ) : (
            <p>이전 알림이 없습니다.</p>
          )}
        </section>
      )}

    </div>
  );
};

export default Setting;
