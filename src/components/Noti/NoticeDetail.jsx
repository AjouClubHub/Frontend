import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "../../styles/Noti/NoticeDetail.css";

dayjs.extend(utc);
dayjs.extend(timezone);

const NoticeDetail = () => {
  const { clubId, announcementId } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchNotice = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/announcements/${announcementId}`,
          {
            headers: {
              Authorization: `Bearer Bearer ${token}`,
            },
          }
        );
        setNotice(res.data.data);
      } catch (err) {
        console.error("공지사항 단건 조회 실패:", err);
        setError("공지사항을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [clubId, announcementId]);

  if (loading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (!notice) return <div>공지사항이 존재하지 않습니다.</div>;

  return (
    <div className="notice-detail">
      <h2>{notice.title}</h2>
      <div className="notice-info">
        <span>{notice.category}</span>
        <span>{dayjs.utc(notice.createdAt).tz("Asia/Seoul").format("YYYY.MM.DD HH:mm")}</span>
        <span>{notice.authorName}</span>
        <span>{notice.views}</span>
      </div>
      <div
        className="notice-content"
        dangerouslySetInnerHTML={{ __html: notice.content }}
      />
    </div>
  );
};

export default NoticeDetail;
