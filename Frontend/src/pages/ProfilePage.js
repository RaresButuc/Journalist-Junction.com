import { useState, useEffect } from "react";
import { useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import DefaultURL from "../GlobalVariables";

export default function ProfilePage() {
  // const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserCountry, setCurrentUserCountry] = useState(null);
  const [readMore, setReadMore] = useState(false);

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
        } catch (err) {
          console.log(err);
        }
      };

      fetchCurrentUser();
    }
  }, [auth()?.email, id]);

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
        <img
          className="mx-2"
          data-toggle="tooltip"
          src={`https://flagsapi.com/${currentUserCountry}/flat/24.png`}
          alt={currentUserCountry}
          title={currentUser?.country}
        />
        {/* <div className="mt-4">
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
        </div> */}
        <div className="row mt-4">
          <div className="col-xl-6 col-md-12">
            <h3>About</h3>
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
            <h3>Links</h3>
          </div>
        </div>
        <hr/>
      </div>
    </div>
  );
}
