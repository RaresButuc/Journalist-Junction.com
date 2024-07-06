import axios from "axios";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import ArticleComments from "./ArticleComments";

export default function CommentSection({ articleId }) {
  return (
    <>
      <h1 className="article-title mt-5 mb-5">Comments Section</h1>
      <div id="justify-content-center wrapper">
        <div id="margin">
          <textarea
            id="text"
            placeholder="Add Your Comment Here.."
            maxLength={360}
            style={{ height: "260px" }}
          />
          <br />
          <button className="mt-3 eraser-button" style={{ color: "white" }}>
            <b>Comment</b>
          </button>
        </div>
      </div>

      <ArticleComments articleId={articleId} />
    </>
  );
}
