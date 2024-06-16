import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuthHeader,useSignOut } from "react-auth-kit";

import DefaultURL from "../usefull/DefaultURL";

export default function AcceptContribInvitePage() {
  const { uuid } = useParams(null);

  const signOut = useSignOut();
  const token = useAuthHeader();

  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (uuid) {
      const acceptInvite = async () => {
        const headers = { Authorization: token() };

        try {
          const response = await axios.put(
            `${DefaultURL}/article/user/add-contributor/${uuid}`,{},{headers}
          );

          setMessage(response.data);
        } catch (err) {
          signOut();
          setMessage(err.response.data.message);
        }
      };

      acceptInvite();
    }
  }, [uuid]);

  return (
    message && (
      <h1 className="article-title container-xl" style={{ whiteSpace: 'pre-wrap',fontSize:"35px" }}>
        {message}
      </h1>
    )
  );
}
