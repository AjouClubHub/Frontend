import React, { useEffect, useState } from "react";
import { useParams, useOutletContext ,useNavigate} from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/Noti/NoticeDetail.css";
import { IoMdArrowRoundBack } from "react-icons/io";

dayjs.extend(utc);
dayjs.extend(timezone);

const NoticeDetail = () => {
  const { clubId, announcementId } = useParams();
  const { isManager } = useOutletContext(); // 부모에서 전달된 isManager 값 받기
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false); // 수정 모드 상태
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(''); // 카테고리 상태 추가
   const navigate = useNavigate();
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "공지 내용을 입력하세요",
      }),
    ],
    content: "",  // 초기 content는 빈 문자열
    autofocus: true,
  });

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
        setTitle(res.data.data.title);
        setCategory(res.data.data.category); // 기존 카테고리 값 저장

        // 에디터에 기존 공지사항 내용 로드
        if (editor) {
          editor.commands.setContent(res.data.data.content);
        }

      } catch (err) {
        console.error("공지사항 단건 조회 실패:", err);
        setError("공지사항을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [clubId, announcementId, editor]);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("accessToken");
    const content = editor?.getHTML();

    if (!title || !content || content === "<p></p>") {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/announcements/${announcementId}`,
        {
          title,
          content,
          category, // 수정된 카테고리 사용
        },
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
          },
        }
      );
      alert("공지사항이 수정되었습니다.");
      setNotice(response.data.data);
      setEditMode(false);
    } catch (err) {
      console.error("공지사항 수정 실패:", err);
      alert("수정에 실패했습니다.");
    }
  };

  if (loading) return <div>📡 불러오는 중...</div>;
  if (error) return <div>❌ {error}</div>;
  if (!notice) return <div>공지사항이 존재하지 않습니다.</div>;

  return (
    <div className="notice-detail">
         <button onClick={() => navigate(-1)}><IoMdArrowRoundBack /></button>
      <h2>{editMode ? 
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ width: '100%' }} 
        /> 
        : notice.title
      }</h2>
      <div className="notice-info">
        <span>{editMode ? 
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '8px', width: '100%', fontSize: '14px' }}
          >
            <option value="모임">모임</option>
            <option value="스터디">스터디</option>
            <option value="기타">기타</option>
          </select> 
          : notice.category
        }</span>
        <span>{dayjs.utc(notice.createdAt).tz("Asia/Seoul").format("YYYY.MM.DD HH:mm")}</span>
        <span>{notice.authorName}</span>
        <span>{notice.views}</span>
      </div>
      <div className="notice-content">
        {editMode ? 
          <EditorContent editor={editor} className="editor" />
          : <div dangerouslySetInnerHTML={{ __html: notice.content }} />
        }
      </div>
      
      {isManager && !editMode && (
        <button onClick={() => setEditMode(true)} className="edit-btn">
          수정하기
        </button>
      )}

      {editMode && (
        <div>
          <button onClick={handleSaveChanges} className="save-btn">
            저장
          </button>
          <button onClick={() => setEditMode(false)} className="cancel-btn">
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default NoticeDetail;
