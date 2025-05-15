import { useEffect } from "react";

const usePageTitle = (title) => {
  useEffect(() => {
    // document.title로 페이지 제목을 설정
    document.title = title;
  }, [title]);
};

export default usePageTitle;
