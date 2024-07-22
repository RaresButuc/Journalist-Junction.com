import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

import Alert from "./Alert";
import DefaultURL from "../usefull/DefaultURL";
import FullCommentComponent from "./FullCommentComponent";

export default function CommentSection({ articleId }) {
  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  const comment = useRef(null);

  const [reload, setReload] = useState(false);
  const [comments, setComments] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  useEffect(() => {
    if (articleId) {
      const getArticleComments = async () => {
        const response = await axios.get(
          `${DefaultURL}/comment/article/${articleId}`
        );

        setComments(response.data);
      };

      getArticleComments();
    }
  }, [articleId, reload]);

  const postComment = async () => {
    try {
      if (!isAuthenticated()) {
        navigate("/login");
      }

      const headers = { Authorization: token() };

      const response = await axios.post(
        `${DefaultURL}/comment/new-comm`,
        {
          article: { id: articleId },
          content: comment.current.value,
        },
        { headers }
      );

      setShowAlert(true);
      setAlertInfos([
        "Success!",
        `Your Comment Was Succesfully Posted!`,
        "success",
      ]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);

      let newCommArray = comments;
      newCommArray.unshift(response.data);

      setComments(newCommArray);
    } catch (error) {
      setShowAlert(true);
      setAlertInfos(["Error Occured!", error.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  return (
    <>
      {showAlert ? (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      ) : null}
      <h1 className="article-title mt-5 mb-5 border-danger border-bottom">
        Comments Section
      </h1>
      <div id="justify-content-center wrapper">
        <div id="margin">
          <textarea
            id="text"
            placeholder="Add Your Comment Here.."
            maxLength={365}
            style={{ height: "281px" }}
            ref={comment}
          />
          <br />
          <button
            className="mt-3 eraser-button"
            style={{ color: "white" }}
            onClick={postComment}
          >
            <b>Comment</b>
          </button>
        </div>
      </div>

      <div className="mt-5">
        {comments?.length ? (
          comments.map((e, index) => (
            <FullCommentComponent
              comment={e}
              key={index}
              reloadComments={setReload}
            />
          ))
        ) : (
          <h2 className="text-danger">
            No Comments Were Posted On This Article Yet!
          </h2>
        )}
      </div>
    </>
  );
}
