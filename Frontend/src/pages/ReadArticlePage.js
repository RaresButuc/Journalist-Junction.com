import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthHeader, useIsAuthenticated } from "react-auth-kit";

import DefaultURL from "../usefull/DefaultURL";
import PhotosPreview from "../components/PhotosPreview";
import CommentSection from "../components/CommentSection";
import CurrentUserInfos from "../usefull/CurrentUserInfos";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function ReadArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const currentUser = CurrentUserInfos();

  const [date, setDate] = useState(null);
  const [article, setArticle] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [nonThumbnail, setNonThumbnail] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      if (id) {
        try {
          const responseIsPublished = await axios.get(
            `${DefaultURL}/article/ispublished/${id}`
          );
          if (responseIsPublished.data) {
            const responseArticle = await axios.get(
              `${DefaultURL}/article/${id}`
            );
            setArticle(responseArticle.data);

            // Get Article Date
            const responseDate = await axios.get(
              `${DefaultURL}/article/date/${responseArticle.data.id}`
            );
            setDate(responseDate.data);

            // Set Viewed and Preferences
            if (currentUser?.id !== responseArticle.data.owner.id) {
              await axios.put(
                `${DefaultURL}/article/add-view/${responseArticle.data.id}`
              );
              if (isAuthenticated()) {
                const headers = { Authorization: token() };

                await axios.put(
                  `${DefaultURL}/user/update-preferences/${responseArticle.data.id}`,
                  {},
                  { headers }
                );
              }
            }

            // Get Article Thumbnail
            const reponseThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-article-thumbnail/${id}`
            );

            const thumbnail = reponseThumbnailArticlePhoto.data;
            const thumbnailImageUrl = `data:image/jpeg;base64,${thumbnail.bytes}`;
            setThumbnail(thumbnailImageUrl);

            // Get Article Non-Thumbnail Photos

            const reponseNonThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-nonThumbnail-article-photos/${id}`
            );

            setNonThumbnail(reponseNonThumbnailArticlePhoto.data);
          } else {
            navigate("/an-error-has-occured");
          }
        } catch (error) {
          navigate("/an-error-has-occured");
        }
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="container-xl">
      <div className="container-xl">
        <div className="row">
          <div className="col container-xl d-flex justify-content-start me-3">
            {article?.categories.map((categ) => (
              <a
                key={categ.id}
                href={`/news/category/${categ.nameOfCategory}`}
                className="btn btn-outline-success btn-sm ms-2 my-2"
                style={{
                  borderRadius: 10,
                  fontSize: 20,
                }}
              >
                {FirstLetterUppercase(categ.nameOfCategory)}
              </a>
            ))}
          </div>

          <h6 className="article-undertitle col d-flex justify-content-end me-3">
            Posted at:
            <b className="ms-2">{date}</b>
          </h6>
        </div>

        <h6 className="article-undertitle col d-flex justify-content-end me-3">
          Views:
          <b className="ms-2">{article?.views}</b>
        </h6>

        <h1 className="article-title mt-4">{article?.title}</h1>
        <h4 className="article-undertitle col d-flex justify-content-center mt-3">
          {article?.contributors?.length ? "Contributors" : "Author"}:
          <a
            className="ms-2 text-danger"
            href={`/profile/${article?.owner.id}`}
            style={{ textDecoration: "none" }}
          >
            <b>
              <u>{article?.owner.name}</u>
            </b>
          </a>
        </h4>
        <div className="row mb-4">
          <h4 className="article-undertitle col d-flex justify-content-center ms-5 mt-3">
            Location:
            <b className="ms-2 text-danger">
              {FirstLetterUppercase(article?.location.country)}
            </b>
            <img
              className="mx-2 img-fluid"
              data-toggle="tooltip"
              src={`https://flagsapi.com/${article?.location?.cca2}/flat/24.png`}
              alt={article?.location?.cca2}
              title={article?.location?.country}
            />
          </h4>

          <h4 className="article-undertitle col d-flex justify-content-center me-5 mt-3">
            Language:
            <b className="ms-2 text-danger">
              {FirstLetterUppercase(article?.language.languageNameEnglish)} /{" "}
              {article?.language.languageNameNative}
            </b>
            <img
              className="mx-2 img-fluid"
              data-toggle="tooltip"
              src={`https://flagsapi.com/${article?.language?.cca2}/flat/24.png`}
              alt={article?.language?.cca2}
              title={article?.language?.country}
            />
          </h4>
        </div>
      </div>
      <hr className="border border-danger" />

      <br />

      <img
        src={thumbnail}
        className="img-fluid mb-5"
        style={{
          width: "100%",
          maxWidth: "1150px",
        }}
      />

      <div
        className="h4 fw-light text-start"
        dangerouslySetInnerHTML={{ __html: article?.body }}
      />
      <PhotosPreview articleId={article?.id} articlePhotos={nonThumbnail} />

      <br />

      <CommentSection articleId={id} />
    </div>
  );
}
