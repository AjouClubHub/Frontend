import React from 'react';
import { useRecoilValue } from 'recoil';
import { notificationPopupState } from './notificationPopupState';

export default function NotificationPopup() {
  const { notification, isOpen } = useRecoilValue(notificationPopupState);
  if (!isOpen || !notification) return null;

  return (
    <div className="notification-popup">
      <p>{notification.content}</p>
    </div>
  );
}
