import { useIsAuthenticated, useAuthUser } from "react-auth-kit";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import DefaultURL from "../usefull/DefaultURL";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfilePage() {
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const [profileUser, setProfileUser] = useState(null);
  const [profileUserCountry, setProfileUserCountry] = useState(null);
  const [readMore, setReadMore] = useState(false);

  const [subsCount, setSubsCount] = useState(0);
  const [subButtonContent, setSubButtonContent] = useState([
    "danger",
    "Subscribe",
  ]);

  const currentUser = CurrentUserInfos();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCurrentUser = async () => {
        try {
          // Fetch user
          const responseUser = await axios.get(`${DefaultURL}/user/${id}`);
          setProfileUser(responseUser.data);

          //Fetch Country Abrev
          const responseCountry = await axios.get(
            `https://restcountries.com/v3.1/name/${responseUser?.data.country}`
          );
          setProfileUserCountry(responseCountry.data[0].cca2);
        } catch (err) {
          console.log(err);
        }
      };

      // Fetch Subscribers Count
      const fetchSubsCount = async () => {
        try {
          const responseSubsCount = await axios.get(
            `${DefaultURL}/user/subscount/${id}`
          );
          setSubsCount(responseSubsCount.data);
        } catch (err) {
          console.log(err);
        }
      };

      // Fetch Is Current User Subscribed
      if (currentUser) {
        const fetchIsSubscribed = async () => {
          try {
            const responseIsSubscribed = await axios.get(
              `${DefaultURL}/user/issubscribed/${currentUser?.id}/${id}`,
              {}
            );
            if (responseIsSubscribed.data) {
              setSubButtonContent(["dark", "UnSubscribe"]);
            } else {
              setSubButtonContent(["danger", "Subscribe"]);
            }
          } catch (err) {
            console.log(err);
          }
        };
        fetchIsSubscribed();
      }

      fetchCurrentUser();
      fetchSubsCount();
    }
  }, [auth()?.email, id]);

  function formatNumber(number) {
    if (number < 1000) {
      return number.toString();
    } else if (number < 1000000) {
      const remainder = number % 1000;
      if (remainder === 0) {
        return Math.floor(number / 1000) + "K";
      } else {
        return (number / 1000).toString().substring(0, 3) + "K";
      }
    } else {
      const remainder = number % 1000000;
      if (remainder === 0) {
        return Math.floor(number / 1000000) + "M";
      } else {
        return (number / 1000000).toString().substring(0, 3) + "M";
      }
    }
  }
  const subscribeOrUnsubscribe = async () => {
    if (subButtonContent[1] === "Subscribe") {
      setSubButtonContent(["dark", "UnSubscribe"]);
      await axios.put(`${DefaultURL}/user/subscribe/${currentUser?.id}/${id}`);
    } else if (subButtonContent[1] === "UnSubscribe") {
      setSubButtonContent(["danger", "Subscribe"]);
      await axios.put(
        `${DefaultURL}/user/unsubscribe/${currentUser?.id}/${id}`
      );
    }
  };

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
        <h1>{profileUser?.name}</h1>
        {/* Subscribe Button */}
        <div className="d-flex justify-content-center">
          <span
            data-toggle="tooltip"
            title={
              currentUser?.id == id
                ? "You can't subscribe to your own channel"
                : `Subscribe to ${profileUser?.name}`
            }
          >
            <button
              type="button"
              className={`btn btn-${subButtonContent[0]} mr-md-3 mb-2 mb-md-0`}
              onClick={subscribeOrUnsubscribe}
              disabled={currentUser?.id == id}
            >
              {subButtonContent[1]} - {formatNumber(subsCount)}
            </button>
          </span>
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
              src={`https://flagsapi.com/${profileUserCountry}/flat/24.png`}
              alt={profileUserCountry}
              title={profileUser?.country}
            />
            <p className="d-inline">({profileUser?.country})</p>
            <br />
            <br />
            <p className="d-inline fw-medium">
              {readMore
                ? profileUser?.shortAutoDescription
                : profileUser?.shortAutoDescription.substr(0, 300)}
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
              <em>{profileUser?.email}</em>
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
