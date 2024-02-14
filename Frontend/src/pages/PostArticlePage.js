import CurrentUserInfos from "../usefull/CurrentUserInfos";
import addArticleIcon from "../photos/addArticleIcon.png";
import { useAuthHeader } from "react-auth-kit";
import DefaultURL from "../usefull/DefaultURL";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ErrorPage from "./ErrorPage";
import axios from "axios";

export default function PostArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();
  const currentUser = CurrentUserInfos();

  const [allUserArticles, setAllUserArticles] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const res = await axios.get(`${DefaultURL}/article/user/${id}`);
      console.log(res.data);
      setAllUserArticles(res.data);
    };

    getAllArticles();
  }, []);

  const createNewArticle = async () => {
    const headers = { Authorization: token() };

    const res = await axios.post(
      `${DefaultURL}/article`,
      {
        owner: { id: CurrentUserInfos?.id },
      },
      { headers }
    );
    
    
  };

  return (
    <div className="container-xl">
      {currentUser?.id == id ? (
        <div className="row">
          {allUserArticles?.map((e) => (
            <div
              className="card border-danger col-xl-3 col-lg-4 col-md-6 mx-auto mt-4"
              style={{ width: "18rem" }}
            >
              <img
                src={addArticleIcon}
                className="card-img-top"
                style={{ padding: "25px", width: "256px" }}
              />
              <div className="card-body">
                <h5 className="card-title">{e.title}</h5>
                <hr />
                <p className="card-text">
                  {e.thumbnailDescription?.length > 95
                    ? e.thumbnailDescription.substring(0, 96) + "..."
                    : e.thumbnailDescription}
                </p>
              </div>
            </div>
          ))}

          <div
            className="card border-danger col-xl-3 col-lg-4 col-sm-1 mx-auto mt-4"
            style={{ width: "18rem" }}
          >
            <a
              onClick={() => createNewArticle()}
              style={{ textDecoration: "none", color: "black" }}
            >
              <img
                src={addArticleIcon}
                className="card-img-top"
                style={{ padding: "25px" }}
              />

              <div className="card-body">
                <h5 className="card-title">Start a New Article</h5>
                <hr />
                <p className="card-text">
                  Start a new Article NOW for FREE and spread your message to
                  the world easier than ever!
                </p>
              </div>
            </a>
          </div>
        </div>
      ) : (
        <ErrorPage />
      )}
    </div>
  );
}
