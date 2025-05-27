'use client';
import React, { useEffect, useRef } from 'react';
import { useRecoilState } from 'recoil';
import { notificationPopupState } from '../store/notificationPopupState';
import { EventSourcePolyfill } from 'event-source-polyfill';

export default function SseComponent() {
  const [, setPopup] = useRecoilState(notificationPopupState);
  const esRef = useRef(null);
  const isActive = useRef(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    const connect = () => {
      if (!isActive.current) return;
      // 기존 연결 닫기
      if (esRef.current) {
        esRef.current.close();
      }

      const es = new EventSourcePolyfill(
        `${import.meta.env.VITE_APP_URL}/api/notifications/subscribe`,
        {
          headers: { Authorization: `Bearer Bearer ${token}` },
          withCredentials: true,
          heartbeatTimeout: 120_000,
        }
      );
      esRef.current = es;

      es.onopen = () => {
        console.log('🔗 SSE 연결 OPEN');
      };
      es.addEventListener('connect', () => {
        console.log('✅ SSE 커넥트 이벤트 수신');
      });
      es.addEventListener('notification', e => {
        console.log('🔔 notification 이벤트:', e.data);
        let payload;
        try {
          payload = JSON.parse(e.data);
        } catch {
          payload = { content: e.data };
        }
        setPopup({ notification: payload, isOpen: true });
        // 1분 후 자동 닫기
        setTimeout(() => setPopup({ notification: null, isOpen: false }), 60000);
      });
      es.onerror = err => {
        console.error('🔴 SSE 에러 발생, 재연결 시도…', err);
        es.close();
        // 3초 후 재연결
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      // 언마운트 시 재연결 멈추기
      isActive.current = false;
      if (esRef.current) {
        esRef.current.close();
      }
    };
  }, [setPopup]);

  return null;
}
