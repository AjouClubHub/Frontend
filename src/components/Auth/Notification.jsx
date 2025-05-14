import React, { useState, useEffect } from "react";
import axios from "axios";


const Notification = () => {
  // 알림 목록을 저장할 상태 변수
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);  // 알림 표시 여부 상태
  const [selectedNotification, setSelectedNotification] = useState(null);  // 선택된 알림 상세 정보

  // 컴포넌트가 마운트될 때 알림 목록을 가져오는 useEffect
  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("accessToken");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/notifications`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );

        console.log("알림 데이터:", response.data); // 응답 데이터 확인

        if (Array.isArray(response.data.data)) {
          setNotifications(response.data.data);  // 알림 목록을 상태에 저장
        } else {
          setError("알림 데이터 형식이 올바르지 않습니다.");
        }
        
        setLoading(false);  // 로딩 상태를 false로 변경
      } catch (err) {
        setError("알림을 가져오는 데 실패했습니다.",err);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []); // 빈 배열을 넣어서 컴포넌트 마운트 시 한 번만 실행

  // 알림 메시지 표시 토글 함수
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  // 알림 클릭 시 상세 정보 팝업
  const showNotificationDetails = (notification) => {
    setSelectedNotification(notification);
  };

  // 팝업 닫기
  const closePopup = () => {
    setSelectedNotification(null);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>알림 설정</h2>

      <button onClick={toggleNotifications}>
        {showNotifications ? "알림 숨기기" : "알림 보기"}
      </button>

      {showNotifications && (
        <div className="notification-dropdown">
          <ul>
            {notifications.length === 0 ? (
              <p>알림이 없습니다.</p>
            ) : (
              notifications.map((notification) => (
                <li key={notification.id} onClick={() => showNotificationDetails(notification)}>
                  <p>{notification.content}</p>
                  <span>{new Date(notification.createdAt).toLocaleString()}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      {/* 상세 팝업 */}
      {selectedNotification && (
        <div className="popup">
          <div className="popup-content">
            <h3>알림 상세</h3>
            <p><strong>메시지:</strong> {selectedNotification.content}</p>
            <p><strong>타입:</strong> {selectedNotification.type}</p>
            <p><strong>생성일:</strong> {new Date(selectedNotification.createdAt).toLocaleString()}</p>
            <button onClick={closePopup}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;
