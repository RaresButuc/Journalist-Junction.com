import { useAuthUser } from "react-auth-kit";
import { useState, useEffect } from "react";
import DefaultURL from "./DefaultURL";
import axios from "axios";

export default function CurrentUserInfos() {
  const [user, setUser] = useState(null);
  const auth = useAuthUser();

  useEffect(() => {
    const getUserByEmail = async () => {
      try {
        const response = await axios.get(
          `${DefaultURL}/user/email/${auth()?.email}`
        );
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUserByEmail();
  }, [auth()?.email]);

  return user;
}
