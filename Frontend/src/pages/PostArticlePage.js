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
import CardPostArticlePage from "../components/CardPostArticlePage";
import PostArticleSkeletonLoader from "../components/PostArticleSkeletonLoader";

export default function PostArticlePage() {
  const { id } = useParams();
  const token = useAuthHeader();
  const navigate = useNavigate();

  const currentUser = CurrentUserInfos();

  const [showLoader, setShowLoader] = useState(false);
  const [allOwnedArticles, setAllOwnedArticles] = useState(null);
  const [allContributedArticles, setAllContributedArticles] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const responseOwned = await axios.get(
        `${DefaultURL}/article/user/owned/${id}`
      );

      const ownedArticlesAndPhotos = await Promise.all(
        responseOwned.data.map(async (article) => {
          const responseThumbnailArticlePhoto = await axios.get(
            `${DefaultURL}/article/get-article-thumbnail/${article.article.id}`
          );
          const thumbnailImageUrl = `data:image/jpeg;base64,${responseThumbnailArticlePhoto.data.bytes}`;

          return { thumbnail: thumbnailImageUrl, data: article.article };
        })
      );
      setAllOwnedArticles(ownedArticlesAndPhotos);

      const responseContributed = await axios.get(
        `${DefaultURL}/article/user/contributor/${id}`
      );

      const contributedArticlesAndPhotos = await Promise.all(
        responseContributed.data.map(async (article) => {
          const responseThumbnailArticlePhoto = await axios.get(
            `${DefaultURL}/article/get-article-thumbnail/${article.article.id}`
          );
          const thumbnailImageUrl = `data:image/jpeg;base64,${responseThumbnailArticlePhoto.data.bytes}`;

          return { thumbnail: thumbnailImageUrl, data: article.article };
        })
      );
      setAllContributedArticles(contributedArticlesAndPhotos);
    };

    getAllArticles();
  }, [id]);

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
        navigate(`/article/edit/${res.data.id}`);
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
              <h1 className="article-title d-flex justify-content-center">
                Owned Articles
              </h1>
              {allOwnedArticles != null ? (
                allOwnedArticles.map((e) => (
                  <CardPostArticlePage
                    article={e.data}
                    image={e.thumbnail ? e.thumbnail : noImgIcon}
                  />
                ))
              ) : (
                <PostArticleSkeletonLoader />
              )}

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

              <>
                <h1
                  className="article-title d-flex justify-content-center"
                  style={{ marginTop: "75px" }}
                >
                  Contributed Articles
                </h1>
                {allContributedArticles != null ? (
                  allContributedArticles.length ? (
                    allContributedArticles.map((i) => (
                      <CardPostArticlePage
                        article={i.data}
                        image={i.thumbnail ? i.thumbnail : noImgIcon}
                      />
                    ))
                  ) : (
                    <h2 className="text-danger my-5">
                      You Are Not A Contributor To Any Article Yet!
                    </h2>
                  )
                ) : (
                  <PostArticleSkeletonLoader />
                )}
              </>
            </div>
          ) : (
            <ErrorPage
              message={"Page is Loading!"}
              message2={
                "If it takes too long,press here to escape to the Home Page!"
              }
            />
          )}
        </>
      )}
    </div>
  );
}
