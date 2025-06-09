import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "../../styles/Noti/NoticeList.css";

dayjs.extend(utc);
dayjs.extend(timezone);

const NoticeList = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isManager } = useOutletContext();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const fetchNotices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/announcements`,
          { headers: { Authorization: `Bearer Bearer ${token}` } }
        );
        setNotices(res.data?.data || []);
      } catch (err) {
        console.error("공지사항 조회 실패:", err);
        setError("공지사항을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [clubId]);

  const handleWrite = () => {
    const basePath = isManager ? "/clubsadmin" : "/myclubs";
    navigate(`${basePath}/${clubId}/noticecreate`);
  };

  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>📡 공지사항을 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;

  return (
    <div className="notice-list">
      <div className="notice-header">
        <h2>📢 공지사항 목록</h2>
        {isManager && (
          <button onClick={handleWrite} className="write-btn">
            ✍️ 글쓰기
          </button>
        )}
      </div>

      <div className="search-box">
        <input
          className="search-input"
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredNotices.length === 0 ? (
        <p>공지사항이 없습니다.</p>
      ) : (
        <ul>
          {filteredNotices.map((notice) => {
            const basePath = isManager ? "/clubsadmin" : "/myclubs";
            return (
              <li
                key={notice.id}
                className="notice-item"
                onClick={() => navigate(`${basePath}/${clubId}/notice/${notice.id}`)}
                style={{ cursor: "pointer" }}
              >
                <h3>{notice.title}</h3>
                <p>
                  {notice.content.replace(/<[^>]+>/g, "").slice(0, 100)}...
                </p>
                <div className="notice-category">{notice.category}</div>
                <div className="notice-meta">
                  <span>{notice.authorName}</span>
                  <span>
                    {dayjs
                      .utc(notice.createdAt)
                      .tz("Asia/Seoul")
                      .format("YYYY.MM.DD HH:mm")}
                  </span>
                </div>
                <div className="notice-views">
                  조회수: {notice.views}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default NoticeList;
