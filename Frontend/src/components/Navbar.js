import navbarlogo from "../photos/websitelogo.png";

export default function Navbar() {
  return (
    <div className="container">
      <nav
        className="navbar navbar-custom fixed-top  navbar-expand-md navbar-light shadow-5-strong border-bottom border-danger "
        style={{ backgroundColor: "rgba(255, 255, 255)" }}
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

              <li className="nav-item">
                <a
                  className="btn btn-primary font-weight-bold mx-2"
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
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
