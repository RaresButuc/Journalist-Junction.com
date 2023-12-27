import { useState, useEffect } from "react";
import DefaultURL from "./DefaultURL";

export default function UserExistsCheck({ id }) {
  const [exists, setExists] = useState(null);

  useEffect(() => {
    const fetchUserExists = async () => {
      try {
        const userExists = await axios.get(
          `${DefaultURL}/user/available/${id}`
        );
        setExists(userExists.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUserExists();
  }, []);

  return exists;
}
