import axios from "axios";
import { useState, useEffect } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import { useParams, useNavigate } from "react-router-dom";

import ErrorPage from "./ErrorPage";
import DefaultURL from "../usefull/DefaultURL";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import noProfileImage from "../photos/default-profile-image.png";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

import defaultbackgroundprofile from "../photos/defaultbackgroundprofile.png";

export default function ProfilePage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [readMore, setReadMore] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);

  const [subsCount, setSubsCount] = useState(0);
  const [subButtonContent, setSubButtonContent] = useState(["", ""]);

  const [showEditButton, setShowEditButton] = useState(null);
  // Used to change the Subs Count automatically
  const [subAction, setSubAction] = useState(0);

  const currentUser = CurrentUserInfos();

  const { id } = useParams();

  useEffect(() => {
    // if (!currentUser) return;
    if (id) {
      const fetchCurrentUser = async () => {
        try {
          // Fetch user
          const responseUser = await axios.get(`${DefaultURL}/user/${id}`);

          setProfileUser(responseUser.data);

          setShowEditButton(
            isAuthenticated() && responseUser.data.id === Number(id)
          );

          if (responseUser.data.profilePhoto !== null) {
            const reponseUserProfilePhoto = await axios.get(
              `${DefaultURL}/user/get-profile-photo/${responseUser.data.id}`,
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
            setProfileImage(noProfileImage);
          }

          if (responseUser.data.profileBackgroundPhoto !== null) {
          } else {
            setBackgroundImage(defaultbackgroundprofile);
          }
        } catch (err) {
          console.log(err);
        }
      };

      // Fetch Subscribers Count
      const fetchSubsCount = async () => {
        try {
          const responseSubsCount = await axios.get(
            `${DefaultURL}/user/subscount/${id}`
          );
          setSubsCount(responseSubsCount.data);
        } catch (err) {
          console.log(err);
        }
      };

      // Fetch Is Current User Subscribed
      const fetchIsSubscribed = async () => {
        try {
          if (currentUser) {
            const responseIsSubscribed = await axios.get(
              `${DefaultURL}/user/issubscribed/${currentUser?.id}/${id}`,
              {}
            );
            if (responseIsSubscribed.data) {
              setSubButtonContent(["dark", "UnSubscribe"]);
            } else {
              setSubButtonContent(["danger", "Subscribe"]);
            }
          } else {
            setSubButtonContent(["danger", "Subscribe"]);
          }
        } catch (err) {
          console.log(err);
        }
      };

      fetchSubsCount();
      fetchIsSubscribed();
      fetchCurrentUser();
    }
  }, [subAction, currentUser, id, isAuthenticated()]);

  function formatNumber(number) {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1000000) {
      const remainder = number % 1000;
      if (remainder === 0) {
        return Math.floor(number / 1000) + "K";
      } else {
        return (number / 1000).toString().substring(0, 3) + "K";
      }
    } else {
      const remainder = number % 1000000;
      if (remainder === 0) {
        return Math.floor(number / 1000000) + "M";
      } else {
        return (number / 1000000).toString().substring(0, 3) + "M";
      }
    }
  }
  const subscribeOrUnsubscribe = async () => {
    if (isAuthenticated()) {
      if (subButtonContent[1] === "Subscribe") {
        setSubButtonContent(["dark", "UnSubscribe"]);
        await axios.put(
          `${DefaultURL}/user/subscribe/${currentUser?.id}/${id}`
        );
        setSubAction(subAction + 1);
      } else if (subButtonContent[1] === "UnSubscribe") {
        setSubButtonContent(["danger", "Subscribe"]);
        await axios.put(
          `${DefaultURL}/user/unsubscribe/${currentUser?.id}/${id}`
        );
        setSubAction(subAction + 1);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {profileUser ? (
        <div className="container-xl">
          <div className="position-relative">
            <img
              src={backgroundImage}
              className="img-fluid"
              style={{ width: "100%" }} // Aici pana cand voi avea optiunea de crop,cu 423px height
              alt="BackgroundImage"
            />
            <div className="position-absolute top-100 start-50 translate-middle">
              <div className="profile">
                <img
                  src={profileImage}
                  className="img-fluid rounded-circle border border-4 border-white"
                  style={{ width: "120px", height: "120px" }}
                  alt="ProfileImage"
                />
              </div>
            </div>
          </div>
          <div className="container-xl" style={{ marginTop: "55px" }}>
            <div className="d-flex justify-content-center"></div>
            <h1>{profileUser?.name}</h1>

            {/* Subscribe Button */}

            <div className="d-flex justify-content-center mb-3 mb-md-0">
              {showEditButton ? (
                <a
                  type="button"
                  className="btn btn-success"
                  href={`/profile/edit/${id}`}
                >
                  Edit Profile
                </a>
              ) : null}
              <span
                className={`${
                  showEditButton ? "ms-3" : null
                } d-flex justify-content-center`}
                data-toggle="tooltip"
                title={
                  currentUser?.id == id
                    ? "You can't subscribe to your own channel"
                    : subButtonContent[1] === "Subscribe"
                    ? `Subscribe to ${profileUser?.name}`
                    : `UnSubscribe from ${profileUser?.name}`
                }
              >
                <button
                  type="button"
                  className={`btn btn-${subButtonContent[0]} mr-md-3`}
                  onClick={subscribeOrUnsubscribe}
                  disabled={
                    currentUser ? (currentUser.id == id ? true : false) : false
                  }
                >
                  {subButtonContent[1]} - {formatNumber(subsCount)}
                </button>
              </span>
            </div>

            <div className="row mt-4">
              <div className="col-xl-6 col-md-12">
                <h3>
                  <strong>About</strong>
                </h3>
                <h5 className="d-inline">Country: </h5>
                <img
                  className="mx-2 mb-1"
                  data-toggle="tooltip"
                  src={`https://flagsapi.com/${profileUser?.location?.cca2}/flat/24.png`}
                  alt={profileUser?.location?.cca2}
                  title={FirstLetterUppercase(profileUser?.location?.country)}
                />
                <p className="d-inline">
                  ({FirstLetterUppercase(profileUser?.location?.country)})
                </p>
                <br />
                <br />
                <p className="d-inline fw-medium text-break text-start text-end">
                  {profileUser?.shortAutoDescription?.length < 300
                    ? profileUser?.shortAutoDescription
                    : readMore
                    ? profileUser?.shortAutoDescription
                    : profileUser?.shortAutoDescription?.substr(0, 300)}
                </p>

                {profileUser?.shortAutoDescription?.length > 300 ? (
                  <button
                    className="bg-transparent text-danger btn btn-outline-light"
                    style={{ outline: "transparent" }}
                    onClick={() => {
                      readMore ? setReadMore(false) : setReadMore(true);
                    }}
                  >
                    {readMore ? "(Show Less)" : "... (Read More)"}
                  </button>
                ) : null}
              </div>

              <div className="col-xl-6 col-md-12">
                <h3>
                  <strong>Links</strong>
                </h3>
                <h5 className="d-inline">Email:</h5>
                <h5 className="d-inline ms-3">
                  <em>{profileUser?.email}</em>
                </h5>
                <br />
                <br />
              </div>
            </div>
            <hr />
          </div>
        </div>
      ) : (
        <ErrorPage
          message={"User is Loading!"}
          message2={
            "If it takes too long,press here to escape to the Home Page!"
          }
        />
      )}
    </>
  );
}
