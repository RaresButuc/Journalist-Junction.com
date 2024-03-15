import { useIsAuthenticated } from "react-auth-kit";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import { useParams, useNavigate } from "react-router-dom";
import DefaultURL from "../usefull/DefaultURL";
import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage";
import axios from "axios";
import noProfileImage from "../photos/default-profile-image.png";

export default function ProfilePage() {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  const [readMore, setReadMore] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const [subsCount, setSubsCount] = useState(0);
  const [subButtonContent, setSubButtonContent] = useState(["", ""]);
  // Used to change the Subs Count automatically
  const [subAction, setSubAction] = useState(0);

  const currentUser = CurrentUserInfos();

  const { id } = useParams();

  useEffect(() => {
    if (!currentUser) return;
    if (id) {
      const fetchCurrentUser = async () => {
        try {
          // Fetch user
          const responseUser = await axios.get(`${DefaultURL}/user/${id}`);

          setProfileUser(responseUser.data);

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
            setProfileImage(noProfileImage)
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
          const responseIsSubscribed = await axios.get(
            `${DefaultURL}/user/issubscribed/${currentUser?.id}/${id}`,
            {}
          );
          if (responseIsSubscribed.data) {
            setSubButtonContent(["dark", "UnSubscribe"]);
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
  }, [subAction, currentUser, id]);

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
              src="https://wallpapercave.com/wp/wp7500280.jpg"
              className="img-fluid"
              style={{ width: "100%" }} // Aici pana cand voi avea optiunea de crop,cu 423px height
              alt="BackgroundImage"
            />
            <div className="position-absolute top-100 start-50 translate-middle">
              <div className="profile">
                <img
                  src={profileImage}
                  className="img-fluid rounded-circle border border-4"
                  style={{ borderColor: "white", width: "115px",height:"115px" }}
                  alt="ProfileImage"
                />
              </div>
            </div>
          </div>
          <div className="container-xl" style={{ marginTop: "55px" }}>
            <h1>{profileUser?.name}</h1>
            {/* Subscribe Button */}
            <div className="d-flex justify-content-center">
              <span
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
                  className={`btn btn-${subButtonContent[0]} mr-md-3 mb-2 mb-md-0`}
                  onClick={subscribeOrUnsubscribe}
                  disabled={currentUser?.id == id}
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
                  title={profileUser?.location?.country}
                />
                <p className="d-inline">({profileUser?.location?.country})</p>
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
