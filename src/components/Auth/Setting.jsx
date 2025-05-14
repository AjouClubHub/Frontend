import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Auth/Setting.css'

const Setting = () => {
  const [member, setMember] = useState(null);
  const [joinedClubs, setJoinedClubs] = useState([]); // 빈 배열로 초기화
  const [applicationStatus, setApplicationStatus] = useState([]); // 빈 배열로 초기화
  const [notifications, setNotifications] = useState([]); // 빈 배열로 초기화
  const [loading, setLoading] = useState(true);

  // Authorization 토큰 가져오기
  const token = localStorage.getItem('accessToken'); // 또는 sessionStorage.getItem('accessToken')

  // API URL 환경 변수
  const apiUrl = import.meta.env.VITE_APP_URL;

  // 회원 정보와 알림 목록 불러오기
  const fetchMemberInfoAndNotifications = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/member/mypage`, {
        headers: {
          Authorization: `Bearer Bearer ${token}`, // 헤더에 토큰 추가
        }
      });
      console.log('API Response:', response.data); // API 응답 로그 추가
      setMember(response.data.data.member); // data 안에 member가 있음
      setJoinedClubs(response.data.data.joinedClubs || []); // 가입한 클럽 정보가 없을 경우 빈 배열로 설정
      setApplicationStatus(response.data.data.applications || []); // 신청 현황 정보가 없을 경우 빈 배열로 설정

      // 알림 목록 불러오기
      const notificationsResponse = await axios.get(`${apiUrl}/api/notifications`, {
        headers: {
          Authorization: `Bearer Bearer ${token}`, // 헤더에 토큰 추가
        }
      });
      setNotifications(notificationsResponse.data.data || []); // 알림 정보가 없을 경우 빈 배열로 설정
      setLoading(false);
    } catch (error) {
      console.error("회원 정보를 불러오는 데 실패했습니다:", error);
      setLoading(false);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId) => {
    try {
      await axios.patch(`${apiUrl}/api/notifications/${notificationId}/read`, {}, {
        headers: {
          Authorization: `Bearer Bearer ${token}`, // 헤더에 토큰 추가
        }
      });
      setNotifications(notifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error("알림 읽음 처리에 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchMemberInfoAndNotifications();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  if (!member) {
    return <p>회원 정보가 없습니다.</p>; // member가 없을 경우 로딩 중이나 에러 메시지 출력
  }

  return (
    <div className="mypage-container">

      <section className="user-info">
        <h3>회원 정보</h3>
        <p><strong>이름:</strong> {member.name}</p>
        <p><strong>이메일:</strong> {member.email}</p>
        <p><strong>전공:</strong> {member.major}</p>
        <p><strong>학번:</strong> {member.studentId}</p>
      </section>

      <section className="joined-clubs">
        <h3>가입한 클럽</h3>
        {/* joinedClubs 배열이 비어있지 않은 경우에만 렌더링 */}
        <ul>
          {joinedClubs.length > 0 ? (
            joinedClubs.map(club => (
              <li key={club.id}>
                <p>{club.name}</p>
                <p>{club.status}</p>
               
              </li>
            ))
          ) : (
            <p>가입한 클럽이 없습니다.</p> // 클럽이 없을 경우 메시지 표시
          )}
        </ul>
      </section>

      <section className="application-status">
        <h3>가입 신청 현황</h3>
        {/* applicationStatus 배열이 비어있지 않은 경우에만 렌더링 */}
        <ul>
          {applicationStatus.length > 0 ? (
            applicationStatus.map(app => (
              <li key={app.id}>
                <p>{app.clubName}</p>
                <p>{app.status}</p>
         
              </li>
            ))
          ) : (
            <p>가입 신청이 없습니다.</p> // 신청이 없을 경우 메시지 표시
          )}
        </ul>
      </section>

      <section className="notifications">
        <h3>알림</h3>
        {/* notifications 배열이 비어있지 않은 경우에만 렌더링 */}
        <ul>
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <li
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                style={{
                  fontWeight: notification.read ? 'normal' : 'bold',
                  color: notification.read ? 'gray' : 'black'
                }}
              >
                {notification.message}
              </li>
            ))
          ) : (
            <p>알림이 없습니다.</p> // 알림이 없을 경우 메시지 표시
          )}
        </ul>
      </section>
    </div>
  );
};

export default Setting;
