import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import grayBackground from "../photos/grayBackground.jpg";

const CATEGORIES = 3;

export default function LongArticleSkeletonLoader({ counterArticles }) {
  return (
    <div
      className="container-xl mt-5"
      style={{ backgroundColor: "white", borderRadius: 14, padding: 14 }}
    >
      {Array.from({ length: counterArticles }).map((_, index) => (
        <div
          className="d-xl-flex align-items-center border-bottom border-danger mb-4"
          key={index}
        >
          <img
            className="img-fluid col-xl-6 col-sm-12 mb-3"
            src={grayBackground}
            style={{ borderRadius: 16 }}
          />
          <div className="col-xl-6 col-sm-12" style={{ padding: 15 }}>
            <h3 className="mb-4">
              <Skeleton />
            </h3>
            <p className="container-xl">
              <Skeleton count={3} />
            </p>
            <h5>
              <Skeleton />
            </h5>
            <div className="row">
              {Array.from({ length: CATEGORIES }).map((_, index) => (
                <a
                  className="col ms-2 my-2"
                  style={{
                    borderRadius: 10,
                  }}
                  key={index}
                >
                  <Skeleton length={"5px"} />
                </a>
              ))}
            </div>
            <div className="d-flex justify-content-between ms-3 mt-3">
              <h6 className="d-flex justify-content-start">
                <Skeleton />
                <a className="ms-2" style={{ textDecoration: "none" }}>
                  <Skeleton width={100} />
                </a>
              </h6>
              <h6 className="d-flex justify-content-end me-3">
                <Skeleton width={60} />
              </h6>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
