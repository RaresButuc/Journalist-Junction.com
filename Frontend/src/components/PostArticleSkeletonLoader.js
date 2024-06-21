import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function PostArticleSkeletonLoader() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          className="card border-danger col-xl-3 col-lg-4 col-md-6 mx-auto mt-4"
          style={{ width: "18rem" }}
          key={index}
        >
          <div style={{ padding: "20px" }}>
            <Skeleton height={"150px"} />
          </div>

          <div className="card-body">
            <h5>
              <Skeleton width={"100%"} />
              <Skeleton width={"75%"} />
            </h5>
            <hr />
            <p>
              <Skeleton count={4} />
            </p>
          </div>
        </div>
      ))}
    </>
  );
}
