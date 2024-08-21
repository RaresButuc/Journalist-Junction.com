import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const NOTIF_COUNTER = 3;

export default function NotifSkeletonLoader() {
  return (
    <div className="container-xl">
      {Array.from({ length: NOTIF_COUNTER }).map((_, index) => (
        <div className="d-xl-flex align-items-center border-bottom" key={index}>
          <Skeleton count={3} />
        </div>
      ))}
    </div>
  );
}
