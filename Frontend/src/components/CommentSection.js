import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";
import { useNavigate } from "react-router-dom";

import Alert from "./Alert";
import CommentBox from "./CommentBox";
import DefaultURL from "../usefull/DefaultURL";

export default function CommentSection({ articleId }) {
  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const navigate = useNavigate();

  const comment = useRef(null);

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
  }, [articleId]);

  const postComment = async () => {
    console.log(comment.current.value);

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
      console.log(newCommArray);
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
            maxLength={360}
            style={{ height: "260px" }}
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

      <div className="mt-5 mb-5">
        {comments?.length ? (
          comments.map((e, index) => <CommentBox comment={e} key={index} />)
        ) : (
          <h2 className="text-danger">
            No Comments Were Posted On This Article Yet!
          </h2>
        )}
      </div>
    </>
  );
}
