import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function EditArticleSkeletonLoader() {
  return Array.from({ length: 5 }).map((_, index) => (
    <div
      className="col-xl-6 col-md-12 mx-auto mt-4 "
      key={index}
      style={{ backgroundColor:"rgba(255, 255, 255, 0.7)",padding:"17px",borderRadius:16 }}
    >
      <div className="d-flex justify-content-center">
        <Skeleton width={"120px"} height={"20px"} />
      </div>

      <Skeleton height={"130px"} width={"230px"} />
    </div>
  ));
}
