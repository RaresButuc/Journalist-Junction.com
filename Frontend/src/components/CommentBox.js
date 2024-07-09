import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import Alert from "./Alert";
import editIcon from "../photos/editIcon.png";
import DefaultURL from "../usefull/DefaultURL";
import deleteIcon from "../photos/deleteIcon.png";
import LikedIcon from "../photos/LikedIcon.png";
import NotLikedIcon from "../photos/NotLikedIcon.png";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import defaultProfileImage from "../photos/default-profile-image.png";

export default function CommentBox(comment) {
  const currentUser = CurrentUserInfos();

  const navigate = useNavigate();

  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();
console.log(token());
  const [commLikes, setCommLikes] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  useEffect(() => {
    if (comment) {
      setCommLikes(comment.comment.likes);
    }

    const getProfileImage = async () => {
      if (comment.comment.user.profilePhoto) {
        const reponseUserProfilePhoto = await axios.get(
          `${DefaultURL}/user/get-profile-photo/${comment.comment.user.id}`,
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
            `${DefaultURL}/comment/is-liked/${comment.comment.id}`,
            { headers }
          );

          setIsLiked(responseLiked.data);
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
    console.log(likeStatus);
    if (isAuthenticated()) {
      const headers = { Authorization: token() };

      const responseLiked = await axios.put(
        `${DefaultURL}/comment/action/${comment.comment.id}`,
        {},
        { headers }
      );

      setCommLikes(likeStatus ? commLikes - 1 : commLikes + 1);
      setIsLiked(responseLiked.data);
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
      <div className="card mb-3" style={{ width: "600px" }}>
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <a href={`/profile/${comment.comment.user.id}`}>
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
                  href={`/profile/${comment.comment.user.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <h5 className="mb-0">{comment?.comment?.user?.name}</h5>
                  <small className="text-muted">
                    {comment?.comment?.stringPostTime}
                  </small>
                </a>
              </div>
              <div className="d-flex">
                {currentUser?.id === comment.comment.user.id ? (
                  <>
                    <button style={{ background: "none", border: "none" }}>
                      <img
                        className="ms-3"
                        src={editIcon}
                        alt="Edit"
                        height="24px"
                      />
                    </button>
                    <button style={{ background: "none", border: "none" }}>
                      <img
                        className="ms-3"
                        src={deleteIcon}
                        alt="Delete"
                        height="25px"
                      />
                    </button>
                  </>
                ) : (
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
                )}
              </div>
            </div>
          </div>
          <p className="card-text">{comment?.comment?.content}</p>
        </div>
      </div>
    </div>
  );
}
