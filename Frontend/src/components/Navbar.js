import { useIsAuthenticated, useSignOut } from "react-auth-kit";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import navbarlogo from "../photos/websitelogo.png";
import { Outlet } from "react-router-dom";

export default function Navbar() {
  const isAuthenticated = useIsAuthenticated();
  const signOut = useSignOut();

  const currentUser = CurrentUserInfos();

  const handleLogOut = () => {
    window.location.href = "/";
    signOut();
  };

  return (
    <div className="container" style={{ paddingBottom: 130 }}>
      <nav
        className="navbar navbar-custom fixed-top navbar-expand-md navbar-light shadow-5-strong border-bottom border-danger "
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
                  className="nav-link fw-bold mx-2 text-danger"
                  aria-current="page"
                  href="/all-ads"
                >
                  Trending
                </a>
              </li>

              <li className="nav-item">
                <a
                  className="nav-link font-weight-bold mx-2 text-dark"
                  aria-current="page"
                  href="/all-ads"
                >
                  Search an Article
                </a>
              </li>

              {isAuthenticated() ? (
                <li className="nav-item">
                  <div className="dropdown">
                    <button
                      className="btn  dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        fill="currentColor"
                        className="bi bi-person-circle"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path
                          fillRule="evenodd"
                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                        />
                      </svg>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
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
                          href={`/post-article/${currentUser?.id}`}
                        >
                          Post New Article
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <a className="dropdown-item" href="/changepassoword">
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
              ) : (
                <>
                  <li className="nav-item">
                    <a
                      className="btn btn-success font-weight-bold mx-2"
                      aria-current="page"
                      href="/register"
                    >
                      Become a member
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link mx-2 text-dark" href="/login">
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
  );
}
