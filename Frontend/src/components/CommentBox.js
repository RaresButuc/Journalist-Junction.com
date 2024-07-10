import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import Alert from "./Alert";
import editIcon from "../photos/editIcon.png";
import DefaultURL from "../usefull/DefaultURL";
import LikedIcon from "../photos/LikedIcon.png";
import deleteIcon from "../photos/deleteIcon.png";
import Modal from "./articleFormComponents/Modal";
import NotLikedIcon from "../photos/NotLikedIcon.png";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import defaultProfileImage from "../photos/default-profile-image.png";

export default function CommentBox({ comment, reloadComments }) {
  const currentUser = CurrentUserInfos();

  const navigate = useNavigate();

  const commentContent = useRef(null);

  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const [isLiked, setIsLiked] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [commLikes, setCommLikes] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  useEffect(() => {
    if (comment) {
      setCommLikes(comment?.likes);
    }

    const getProfileImage = async () => {
      if (comment?.user.profilePhoto) {
        const reponseUserProfilePhoto = await axios.get(
          `${DefaultURL}/user/get-profile-photo/${comment?.user?.id}`,
          {
            responseType: "arraybuffer",
          }
        );

        const imageUrl = `data:image/jpeg;base64,
    ${btoa(
      new Uint8Array(reponseUserProfilePhoto.data).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    )}`;

        setProfileImage(imageUrl);
      } else {
        setProfileImage(defaultProfileImage);
      }
    };

    getProfileImage();
  }, [comment]);

  useEffect(() => {
    const isCommentLiked = async () => {
      try {
        if (isAuthenticated()) {
          const headers = { Authorization: token() };

          const responseLiked = await axios.get(
            `${DefaultURL}/comment/is-liked/${comment?.id}`,
            { headers }
          );

          setIsLiked(responseLiked?.data);
        } else {
          setIsLiked(false);
        }
      } catch (error) {
        setShowAlert(true);
        setAlertInfos([
          "Error Occured!",
          error.response.data.message,
          "danger",
        ]);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
    };

    isCommentLiked();
  }, [comment, commLikes]);

  const likeComment = async () => {
    const likeStatus = isLiked;

    if (isAuthenticated()) {
      const headers = { Authorization: token() };

      const responseLiked = await axios.put(
        `${DefaultURL}/comment/action/${comment?.id}`,
        {},
        { headers }
      );

      setCommLikes(likeStatus ? commLikes - 1 : commLikes + 1);
      setIsLiked(responseLiked.data);
    } else {
      navigate("/login");
    }
  };

  const deleteComment = async () => {
    if (isAuthenticated()) {
      const headers = { Authorization: token() };

      await axios.delete(`${DefaultURL}/comment/${comment?.id}`, {
        headers,
      });

      reloadComments((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const editComment = async () => {
    if (isAuthenticated()) {
      const headers = { Authorization: token() };

      await axios.put(
        `${DefaultURL}/comment/edit/${comment?.id}`,
        { content: commentContent.current.value },
        {
          headers,
        }
      );

      setEditMode(false);
      reloadComments((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="d-flex justify-content-center">
      {showAlert ? (
        <Alert
          type={alertInfos[0]}
          message={alertInfos[1]}
          color={alertInfos[2]}
        />
      ) : null}
      <div className="card border-dark mb-3" style={{ width: "600px" }}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <a href={`/profile/${comment?.user?.id}`}>
              <img
                src={profileImage}
                alt="User Avatar"
                className="rounded-circle"
                style={{ width: "45px", height: "45px", marginRight: "10px" }}
              />
            </a>

            <div className="d-flex justify-content-between w-100">
              <div>
                <a
                  href={`/profile/${comment?.user?.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <h5 className="mb-0">{comment?.user?.name}</h5>
                  <small className="text-muted">
                    {comment?.stringPostTime}
                  </small>
                </a>
              </div>
              <div className="d-flex">
                <button
                  style={{ background: "none", border: "none" }}
                  onClick={likeComment}
                >
                  <img
                    className="ms-3 mb-1 me-1"
                    src={isLiked ? LikedIcon : NotLikedIcon}
                    alt="Like Comment"
                    height="25px"
                  />
                  ({commLikes})
                </button>

                {currentUser?.id == comment?.user.id ||
                currentUser?.id == comment?.article.owner.id ? (
                  <>
                    {!editMode && currentUser?.id == comment?.user.id ? (
                      <button
                        style={{ background: "none", border: "none" }}
                        onClick={() => setEditMode(true)}
                      >
                        <img
                          className="ms-2 mb-1"
                          src={editIcon}
                          alt="Edit"
                          height="24px"
                        />
                      </button>
                    ) : null}

                    <button
                      style={{ background: "none", border: "none" }}
                      data-bs-toggle="modal"
                      data-bs-target={`#modalDeleteComm`}
                    >
                      <img
                        className="ms-2 mb-1"
                        src={deleteIcon}
                        alt="Delete"
                        height="25px"
                      />
                    </button>
                    <Modal
                      id={`modalDeleteComm`}
                      title={"Wait A Second!"}
                      message={"Are You Sure You Want To Delete This Comment?"}
                      onAccept={deleteComment}
                    />
                  </>
                ) : null}
              </div>
            </div>
          </div>
          {editMode ? (
            <>
              <textarea
                defaultValue={comment?.content}
                ref={commentContent}
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "12px 20px",
                  boxSizing: "border-box",
                  border: "2px solid #ccc",
                  borderRadius: "4px",
                  backgroundColor: "#f8f8f8",
                  fontSize: "16px",
                  resize: "none",
                }}
              />
              <div className="row">
                <button
                  className="btn btn-outline-success col mt-2 mx-5"
                  onClick={editComment}
                >
                  Edit
                </button>
                <button
                  className="btn btn-outline-secondary col mt-2 mx-5"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <p className="card-text">{comment?.content}</p>
          )}
        </div>
      </div>
    </div>
  );
}
