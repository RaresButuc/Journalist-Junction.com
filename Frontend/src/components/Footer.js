import FacebookIcon from "../photos/socialMediaIcons/FacebookIcon.png";
import InstagramIcon from "../photos/socialMediaIcons/InstagramIcon.png";
import TwitterIcon from "../photos/socialMediaIcons/TwitterIcon.png";
import websitelogo from "../photos/websiteLogoSimple.png";

export default function Footer() {
  return (
    <div className="container-xl">
      <footer className="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div className="col-md-4 d-flex align-items-center">
          <a
            href="/"
            className="mb-3 me-2 mb-md-0 text-body-secondary text-decoration-none lh-1"
          >
            <img
              src={websitelogo}
              alt="facebookLogo"
              className="h-auto"
              style={{ width: 35 }}
            />{" "}
          </a>
          <span className="mb-3 mb-md-0 text-body-secondary">
            &copy; 2023 Company, Inc
          </span>
        </div>

        <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
          <li className="ms-3">
            <a className="text-body-secondary" href="#">
              <img
                src={FacebookIcon}
                alt="facebookLogo"
                className="h-auto"
                style={{ width: 35 }}
              />
            </a>
          </li>
          <li className="ms-3">
            <a className="text-body-secondary" href="#">
              <img
                src={InstagramIcon}
                alt="facebookLogo"
                className="h-auto"
                style={{ width: 35 }}
              />
            </a>
          </li>
          <li className="ms-3">
            <a className="text-body-secondary" href="#">
              <img
                src={TwitterIcon}
                alt="facebookLogo"
                className="h-auto"
                style={{ width: 35 }}
              />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
