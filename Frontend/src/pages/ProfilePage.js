import { useState, useEffect } from "react";
import { useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import DefaultURL from "../usefull/DefaultURL";

export default function ProfilePage() {
  // const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserCountry, setCurrentUserCountry] = useState(null);
  const [readMore, setReadMore] = useState(false);

  const [subsCount, setSubsCount] = useState(0);
  const [subButtonContent, setSubButtonContent] = useState([
    "subscribe",
    "Subscribe",
  ]);

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCurrentUser = async () => {
        try {
          // Fetch user
          const responseUser = await axios.get(`${DefaultURL}/user/${id}`);
          setCurrentUser(responseUser.data);

          //Fetch Country Abrev
          const responseCountry = await axios.get(
            `https://restcountries.com/v3.1/name/${responseUser.data.country}`
          );
          setCurrentUserCountry(responseCountry.data[0].cca2);

          // Fetch Subscribers Count
          const responseSubsCount = await axios.get(
            `${DefaultURL}/subscount/${id}`
          );
          setSubsCount(responseSubsCount.data);

          // Fetch Is Current User Subscribed
          const responseIsSubscribed = await axios.get(
            `${DefaultURL}/isSubscribed//${id}`
          );
          setSubsCount(responseSubsCount.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchCurrentUser();
    }
  }, [auth()?.email, id, subsCount]);

  const subscribeOrUnsubscribe = () => {};

  return (
    <div className="container-xl">
      <div className="position-relative">
        <img
          src="https://wallpapercave.com/wp/wp7500280.jpg"
          className="img-fluid"
          style={{ width: "100%" }} // Aici pana cand voi avea optiunea de crop,cu 423px height
          alt="BackgroundImage"
        />
        <div className="position-absolute top-100 start-50 translate-middle">
          <div className="profile">
            <img
              src="https://i.imgur.com/JgYD2nQ.jpg"
              className="img-fluid rounded-circle border border-4"
              style={{ borderColor: "white" }} //250 cand e mare,140 cand e mic. 250 va fi default
              alt="ProfileImage"
            />
          </div>
        </div>
      </div>
      <div className="container-xl mt-5">
        <h1>{currentUser?.name}</h1>
        {/* Subscribe Button */}
        <div className="d-flex justify-content-center">
          <button className="Btn">
            <span className="leftContainer">
              <svg
                fill="white"
                viewBox="0 0 512 512"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"></path>
              </svg>
              <span className="like">Like</span>
            </span>
            <span className="likeCount">{subsCount}</span>
          </button>
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
              src={`https://flagsapi.com/${currentUserCountry}/flat/24.png`}
              alt={currentUserCountry}
              title={currentUser?.country}
            />
            <p className="d-inline">({currentUser?.country})</p>
            <br />
            <br />
            <p className="d-inline fw-medium">
              {readMore
                ? currentUser?.shortAutoDescription
                : currentUser?.shortAutoDescription.substr(0, 300)}
            </p>
            <button
              className="bg-transparent text-danger btn btn-outline-light"
              style={{ outline: "transparent" }}
              onClick={() => {
                readMore ? setReadMore(false) : setReadMore(true);
              }}
            >
              {readMore ? "(Show Less)" : "... (Read More)"}
            </button>
          </div>
          <div className="col-xl-6 col-md-12">
            <h3>
              <strong>Links</strong>
            </h3>
            <h5 className="d-inline">Email:</h5>
            <h5 className="d-inline ms-3">
              <em>{currentUser?.email}</em>
            </h5>
            <br />
            <br />
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}
