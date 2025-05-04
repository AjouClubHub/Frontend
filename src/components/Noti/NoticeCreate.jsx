import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import "../../styles/Noti/NoticeCreate.css";

const NoticeCreate = () => {
  const { clubId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("모임");
  const [error, setError] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "공지 내용을 입력하세요",
      }),
    ],
    content: "",
    autofocus: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editor?.getHTML();
    const token = localStorage.getItem("accessToken");

    if (!title || !content || content === "<p></p>") {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_APP_URL}/api/clubs/${clubId}/announcements`,
        {
          title,
          category,
          content,
        },
        {
          headers: {
            Authorization: `Bearer Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("공지사항이 등록되었습니다.");
      navigate(`/clubsadmin/${clubId}/notice`);
    } catch (err) {
      console.error("공지사항 등록 실패:", err);
      setError("등록에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/clubsadmin/${clubId}/notice`);
  };

  return (
    <div className="notice-create">
      <h2>📢 공지사항 작성</h2>
      <form onSubmit={handleSubmit} className="notice-form">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="공지 제목을 입력하세요"
        />

        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="모임">모임</option>
          <option value="스터디">스터디</option>
          <option value="기타">기타</option>
        </select>

        <label htmlFor="content">내용</label>
        {editor ? (
          <EditorContent editor={editor} className="editor" />
        ) : (
          <div className="loading">에디터 로딩 중...</div>
        )}

        {error && <p className="error-text">{error}</p>}

        <div className="button-row">
          <button type="submit">등록하기</button>
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoticeCreate;
