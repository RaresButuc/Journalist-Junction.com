import axios from "axios";
import { useEffect, useState } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import DefaultURL from "../usefull/DefaultURL";

export default function ArticleComments({ articleId }) {
  const token = useAuthHeader();

  const [comments, setComments] = useState(null);

  useEffect(() => {
    const getArticleComments = () => {
      const response = axios.get(`${DefaultURL}/comment/article/${articleId}`);
      setComments(response.data);
    };

    getArticleComments();
  }, []);
  return (
    <div className="mt-5 mb-5">
      {comments?.length ? (
        <div></div>
      ) : (
        <h2 className="text-danger">
          No Comments Were Posted On This Article Yet!
        </h2>
      )}
    </div>
  );
}
