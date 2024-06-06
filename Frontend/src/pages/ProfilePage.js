import axios from "axios";
import { useState, useEffect } from "react";
import { useIsAuthenticated } from "react-auth-kit";
import { useParams, useNavigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import ErrorPage from "./ErrorPage";
import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

import noProfileImage from "../photos/default-profile-image.png";
import defaultbackgroundprofile from "../photos/defaultbackgroundprofile.png";

import x from "../photos/socialMediaIcons/TwitterIcon.png";
import facebook from "../photos/socialMediaIcons/FacebookIcon.png";
import instagram from "../photos/socialMediaIcons/InstagramIcon.png";

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = CurrentUserInfos();
  const isAuthenticated = useIsAuthenticated();

  const [hasMore, setHasMore] = useState(true);
  const [articles, setArticles] = useState(null);
  const [readMore, setReadMore] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [scrollDownArticles, setScrollDownArticles] = useState(null);

  const [subsCount, setSubsCount] = useState(0);
  const [subButtonContent, setSubButtonContent] = useState(["", ""]);

  const [showEditButton, setShowEditButton] = useState(null);

  const [socialMedia, setSocialMedia] = useState([]);
  const [hasSocialMedia, setHasSocialMedia] = useState(false);

  const choosePhoto = (platform) => {
    if (platform === "facebook") {
      return facebook;
    } else if (platform === "instagram") {
      return instagram;
    } else if (platform === "x") {
      return x;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (isAuthenticated() && !currentUser?.id) {
      return;
    }

    if (id && !scrollDownArticles) {
      const fetchCurrentUser = async () => {
        try {
          // Fetch user
          const responseUser = await axios.get(`${DefaultURL}/user/${id}`);
          const userData = responseUser.data;

          setShowEditButton(
            isAuthenticated() ? currentUser?.id === Number(id) : false
          );
          setProfileUser(userData);

          setHasSocialMedia(
            socialMedia.socialMedia
              ? userData.socialMedia?.instagram ||
                  userData.socialMedia?.facebook ||
                  userData.socialMedia?.x
              : false
          );

          if (socialMedia.socialMedia) {
            const socialMediaArray = [];

            for (const [key, value] of Object.entries(userData.socialMedia)) {
              if (value) {
                let link;
                switch (key) {
                  case "facebook":
                    link = `https://www.facebook.com/${value}`;
                    break;
                  case "instagram":
                    link = `https://www.instagram.com/${value}/`;
                    break;
                  case "x":
                    link = `https://x.com/${value}/`;
                    break;
                  default:
                    link = "";
                }

                socialMediaArray.push({
                  photo: choosePhoto(key),
                  platform: key,
                  link: link,
                });
              }
            }

            setSocialMedia(socialMediaArray);
          }

          if (responseUser.data.profilePhoto !== null) {
            const reponseUserProfilePhoto = await axios.get(
              `${DefaultURL}/user/get-profile-photo/${userData.id}`,
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

          if (userData.profileBackgroundPhoto !== null) {
            const reponseUserBackgroundPhoto = await axios.get(
              `${DefaultURL}/user/get-background-photo/${userData.id}`,
              {
                responseType: "arraybuffer",
              }
            );

            const imageUrl = `data:image/jpeg;base64,
          ${btoa(
            new Uint8Array(reponseUserBackgroundPhoto.data).reduce(
              (data, byte) => data + String.fromCharCode(byte),
              ""
            )
          )}`;

            setBackgroundImage(imageUrl);
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

      // Fetch user's articles
      const fetchUserArticles = async () => {
        try {
          const responseArticles = await axios.get(
            `${DefaultURL}/article/user/${id}`
          );
          setArticles(responseArticles.data);

          setScrollDownArticles(
            responseArticles.data.length > 3
              ? responseArticles.data.slice(0, 3)
              : responseArticles.data.slice(0)
          );

          setHasMore(responseArticles.data.length > 3);
        } catch (err) {
          console.log(err);
        }
      };

      fetchSubsCount();
      fetchIsSubscribed();
      fetchCurrentUser();
      fetchUserArticles();
    }
  }, [currentUser, id, isAuthenticated()]);

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
        setSubsCount(subsCount + 1);

        await axios.put(
          `${DefaultURL}/user/1/${currentUser?.id}/${id}`
        );
      } else if (subButtonContent[1] === "UnSubscribe") {
        setSubButtonContent(["danger", "Subscribe"]);
        setSubsCount(subsCount - 1);

        await axios.put(
          `${DefaultURL}/user/0/${currentUser?.id}/${id}`
        );
      }
    } else {
      navigate("/login");
    }
  };

  const fetchMoreData = () => {
    const lengthDifference = articles.length - scrollDownArticles.length;

    if (lengthDifference > 3) {
      setTimeout(() => {
        setScrollDownArticles(articles.slice(0, scrollDownArticles.length + 3));
      }, 500);
    } else {
      setTimeout(() => {
        setScrollDownArticles(
          articles.slice(0, scrollDownArticles.length + lengthDifference)
        );
      }, 500);
      setHasMore(false);
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
              style={{ width: "100%" }}
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
                    currentUser
                      ? currentUser.id === Number(id)
                        ? true
                        : false
                      : false
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
                  <strong>
                    {hasSocialMedia ? "Contact & Social Media" : "Contact"}
                  </strong>
                </h3>
                <h5 className="d-inline">Email:</h5>
                <h5 className="d-inline ms-3">
                  <em>{profileUser?.email}</em>
                </h5>

                <br />
                <div className="mt-3">
                  {socialMedia?.map((e) => (
                    <a href={e.link}>
                      <img
                        src={e.photo}
                        alt={`${e.platform} logo`}
                        style={{ width: 35, marginRight: "10px" }}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <hr className="border border-danger" />

            {scrollDownArticles?.length ? (
              <InfiniteScroll
                dataLength={scrollDownArticles?.length}
                next={() => fetchMoreData()}
                hasMore={hasMore}
                loader={<h4 className="mt-4">Loading...</h4>}
              >
                <ArticleBox articles={scrollDownArticles} />
              </InfiniteScroll>
            ) : (
              <h1
                style={{ marginTop: "7%" }}
                className="d-flex justify-content-center"
              >
                {" "}
                No Article Uploaded Yet
              </h1>
            )}
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
