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
  const [readMore,setReadMore] = useState(false);

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
          className="mb-3 mx-2"
          data-toggle="tooltip"
          src={`https://flagsapi.com/${currentUserCountry}/flat/24.png`}
          alt={currentUserCountry}
          title={currentUser?.country}
        />
        <div>
          {currentUser?.shortAutoDescription.length > 500 ? (
            <>
              <p className="d-inline">
                {currentUser?.shortAutoDescription.substr(0, 500)}
              </p>
              <button
                className="bg-transparent text-danger btn btn-outline-light"
                style={{ outline: "transparent" }}
              >
                ... (Read More)
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
