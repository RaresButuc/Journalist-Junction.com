import { useState, useEffect } from "react";
import { useIsAuthenticated, useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import axios from "axios";
import DefaultURL from "../GlobalVariables";

export default function ProfilePage() {
  // const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const [currentUser, setCurrentUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCurrentUser = async () => {
        try {
          const response = await axios.get(`${DefaultURL}/user/${id}`);
          setCurrentUser(response.data);
          // setShowEditButtonOrNot(data?.email === auth()?.email);
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
      <div className="pcontainer-xl mt-5">
        <h1>{currentUser?.name}</h1>
      </div>
    </div>
  );
}
