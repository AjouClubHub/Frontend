import { atom } from 'recoil';

export const notificationPopupState = atom({
  key: 'notificationPopupState',  // 유니크한 키
  default: {
    unread: [],    // 읽지 않은 알림 배열
    highlight: false  // 아이콘 애니메이션 트리거용 플래그
  },
});
