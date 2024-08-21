import axios from "axios";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useIsAuthenticated, useSignOut, useAuthHeader } from "react-auth-kit";

import Alert from "./Alert";
import DefaultURL from "../usefull/DefaultURL";
import navbarlogo from "../photos/websitelogo.png";
import NotifSkeletonLoader from "./NotifSkeletonLoader";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import noProfileImage from "../photos/default-profile-image.png";
import notificationBell from "../photos/notificationsBell/notificationBell.png";

export default function Navbar() {
  const signOut = useSignOut();
  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const currentUser = CurrentUserInfos();

  const [profilePhoto, setProfilePhoto] = useState(null);

  const [hasMore, setHasMore] = useState(true);
  const [notifCounter, setNotifCounter] = useState(0);
  const [notifications, setNotifications] = useState(null);
  const [scrollDownNotifications, setScrollDownNotifications] = useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfos, setAlertInfos] = useState(["", "", ""]);

  useEffect(() => {
    if (currentUser?.profilePhoto) {
      const fetchCurrentUserProfile = async () => {
        try {
          const reponseUserProfilePhoto = await axios.get(
            `${DefaultURL}/user/get-profile-photo/${currentUser.id}`,
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
          setProfilePhoto(imageUrl);
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentUserProfile();
    }

    if (isAuthenticated()) {
      const getNotificationCounterAndData = async () => {
        const headers = { Authorization: token() };

        const responseNotifCounter = await axios.get(
          `${DefaultURL}/notification/seen-counter`,
          {
            headers,
          }
        );

        setNotifCounter(responseNotifCounter.data);

        const responseNotifications = await axios.get(
          `${DefaultURL}/notification/user`,
          {
            headers,
          }
        );
        const responseNotifs = responseNotifications.data;

        setNotifications(responseNotifs.toReversed());
        setScrollDownNotifications(
          responseNotifs.length > 3
            ? responseNotifs.toReversed().slice(0, 3)
            : responseNotifs.toReversed().slice(0)
        );
        setHasMore(responseNotifs.length > 0);
      };

      getNotificationCounterAndData();
    }
  }, [currentUser]);

  const clickNotification = async (notific) => {
    const headers = { Authorization: token() };

    try {
      if (!notific.read) {
        await axios.put(
          `${DefaultURL}/notification/set-seen/${notific.id}`,
          {},
          {
            headers,
          }
        );
      }

      window.location.href = `/article/read/${notific.articleId}`;
    } catch (error) {
      setShowAlert(true);
      setAlertInfos(["Error Occured!", error.response.data.message, "danger"]);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
  };

  const fetchMoreData = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const lengthDifference =
      notifications.length - scrollDownNotifications.length;

    if (lengthDifference > 3) {
      setTimeout(() => {
        setScrollDownNotifications(
          notifications.slice(0, scrollDownNotifications.length + 3)
        );
      }, 500);
    } else {
      setTimeout(() => {
        setScrollDownNotifications(
          notifications.slice(
            0,
            scrollDownNotifications.length + lengthDifference
          )
        );
      }, 500);
      setHasMore(false);
    }
  };

  const handleLogOut = () => {
    setTimeout(() => {
      signOut();
    }, 500);
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

      <div className="container" style={{ paddingBottom: 130 }}>
        <nav
          className="navbar navbar-custom fixed-top navbar-expand-md navbar-light shadow-5-strong border-bottom border-danger"
          style={{ backgroundColor: "rgba(255, 255, 255,0.9)" }}
        >
          <div className="container-xl">
            <a className="navbar-brand" href="/">
              <img
                src={navbarlogo}
                alt="ourLogo"
                className="h-auto"
                style={{ maxWidth: 175 }}
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="true"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse "
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ms-auto  mb-2 mb-lg-0">
                <li className="nav-item">
                  <a
                    className="nav-link fw-bold mx-2 mt-2 text-danger"
                    aria-current="page"
                    href="/article/trending?time=1"
                  >
                    <b>Trending</b>
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link font-weight-bold mx-2 mt-2 text-dark"
                    aria-current="page"
                    href="/article/search?pagenumber=1"
                  >
                    Search an Article
                  </a>
                </li>

                {isAuthenticated() ? (
                  <>
                    <li className="nav-item">
                      <div className="dropdown">
                        <button
                          className="btn dropdown-toggle custom-dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img
                            src={notificationBell}
                            style={{
                              height: "40px",
                              marginBottom: "0px",
                            }}
                          />
                          {notifCounter > 0 ? (
                            <p className="notification-badge">
                              <b>{notifCounter > 100 ? "99+" : notifCounter}</b>
                            </p>
                          ) : null}
                        </button>

                        <ul
                          className="dropdown-menu dropdown-menu-end border border-danger"
                          style={{
                            overflowY: "auto",
                            overflowX: "hidden",
                            maxHeight: "170px",
                            maxWidth: "650px",
                          }}
                        >
                          {scrollDownNotifications?.length ? (
                            <div className="container-xl ">
                              {scrollDownNotifications.map((e, index) => (
                                <div>
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      style={{ backgroundColor: "none" }}
                                      onClick={() => clickNotification(e)}
                                    >
                                      {e.read ? (
                                        e.message.length > 80 ? (
                                          e.message.slice(0, 80) + "..."
                                        ) : (
                                          e.message
                                        )
                                      ) : (
                                        <b>
                                          {e.message.length > 80
                                            ? e.message.slice(0, 80) + "..."
                                            : e.message}
                                        </b>
                                      )}
                                    </button>
                                  </li>
                                  {typeof notifications[index + 1] ===
                                  "undefined" ? null : (
                                    <li>
                                      <hr class="dropdown-divider" />
                                    </li>
                                  )}
                                </div>
                              ))}

                              {hasMore ? (
                                <div
                                  className="dropdown-item d-flex justify-content-center mt-2"
                                  style={{ backgroundColor: "transparent" }}
                                >
                                  <button
                                    className="btn btn-outline-danger"
                                    style={{ textDecoration: "none" }}
                                    onClick={fetchMoreData}
                                  >
                                    <b> Show Older Notifications</b>
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <h5 className="px-5 text-center">
                              No Notifications Available
                            </h5>
                          )}
                        </ul>
                      </div>
                    </li>

                    <li className="nav-item">
                      <div className="dropdown">
                        <button
                          className="btn dropdown-toggle custom-dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {currentUser?.profilePhoto ? (
                            <img
                              src={profilePhoto}
                              className="img-fluid rounded-circle"
                              style={{
                                borderColor: "black",
                                width: "40px",
                                height: "40px",
                              }}
                              alt={null}
                            />
                          ) : (
                            <img
                              src={noProfileImage}
                              style={{
                                width: "40px",
                                height: "40px",
                                marginBottom: "0px",
                              }}
                            />
                          )}
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border border-danger">
                          <li>
                            <a
                              className="dropdown-item"
                              href={`/profile/${currentUser?.id}`}
                            >
                              Profile
                            </a>
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href={`/article/post/${currentUser?.id}`}
                            >
                              Post New Article
                            </a>
                          </li>
                          <li>
                            <hr className="border border-danger" />
                          </li>
                          <li>
                            <a
                              className="dropdown-item"
                              href="/profile/change-password"
                            >
                              Change Password
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" onClick={handleLogOut}>
                              Logout
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <a
                        className="btn btn-success font-weight-bold mx-2 mt-2"
                        aria-current="page"
                        href="/register"
                      >
                        <b>Become a Member</b>
                      </a>
                    </li>

                    <li className="nav-item">
                      <a className="nav-link mx-2 mt-2 text-dark" href="/login">
                        Log In
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}
