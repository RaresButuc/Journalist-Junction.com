import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NewsSkeleton({ counterNews }) {
  return (
    <div className="container-xl mt-5">
      {Array.from({ length: counterNews }).map((_, index) => (
        <div className="d-flex justify-content-center my-3" key={index}>
          <div className="card border-dark" style={{ width: "600px" }}>
            <div className="card-body">
              <div>
                <div className="row">
                  <h5 className="justify-content-start col-6 mb-0 text-primary">
                    <Skeleton />
                  </h5>
                  <h5 className="justify-content-end col-6 text-muted">
                    <Skeleton />
                  </h5>
                </div>
              </div>
              <h4 className="my-2">
                <Skeleton />
              </h4>
              <p className="card-text">
                <Skeleton count={3} />
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
