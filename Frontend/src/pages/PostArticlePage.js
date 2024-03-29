import axios from "axios";
import { useState, useEffect } from "react";
import { useAuthHeader } from "react-auth-kit";
import { useParams, useNavigate } from "react-router-dom";

import ErrorPage from "./ErrorPage";
import noImgIcon from "../photos/no-img.png";
import DefaultURL from "../usefull/DefaultURL";
import addArticleIcon from "../photos/addArticleIcon.png";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import LoaderCreateArticle from "../components/LoaderCreateArticle";

export default function PostArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();
  const navigate = useNavigate();

  const currentUser = CurrentUserInfos();

  const [showLoader, setShowLoader] = useState(false);
  const [allUserArticles, setAllUserArticles] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const res = await axios.get(`${DefaultURL}/article/user/${id}`);
      setAllUserArticles(res.data);
    };

    getAllArticles();
  }, []);

  const createNewArticle = async () => {
    try {
      const headers = { Authorization: token() };

      const res = await axios.post(
        `${DefaultURL}/article`,
        {
          owner: { id: currentUser?.id },
        },
        { headers }
      );

      setShowLoader(true);
      setTimeout(() => {
        navigate(`/edit-article/${res.data.id}`);
      }, 5000);
    } catch (err) {
      console.error("Request error:", err);
      navigate("/an-error-has-occured");
    }
  };

  return (
    <div className="container-xl">
      {showLoader ? (
        <LoaderCreateArticle />
      ) : (
        <>
          {currentUser?.id == id ? (
            <div className="row">
              {allUserArticles?.map((e) => (
                <div
                  className="card border-danger col-xl-3 col-lg-4 col-md-6 mx-auto mt-4"
                  style={{ width: "18rem" }}
                >
                  <a
                    href={`/edit-article/${e.id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <img
                      src={noImgIcon}
                      className="card-img-top"
                      style={{ padding: "25px", width: "256px" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">
                        {e.title
                          ? e.title?.length > 95
                            ? e.title.substring(0, 45) + "..."
                            : e.title
                          : "No Title was provided for this Article"}
                      </h5>
                      <hr />
                      <p className="card-text">
                        {e.thumbnailDescription
                          ? e.thumbnailDescription?.length > 95
                            ? e.thumbnailDescription.substring(0, 96) + "..."
                            : e.thumbnailDescription
                          : "No Short Description was provided for this Article"}
                      </p>
                    </div>
                  </a>
                </div>
              ))}

              <div
                className="card border-danger col-xl-3 col-lg-4 col-sm-1 mx-auto mt-4"
                style={{ width: "18rem" }}
              >
                <button
                  className="card"
                  onClick={createNewArticle}
                  style={{ border: "none", background: "none", padding: "0" }}
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
                      Start a new Article NOW for FREE and spread your message
                      to the world easier than ever!
                    </p>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <ErrorPage message={"404 Not Found!"} />
          )}
        </>
      )}
    </div>
  );
}
