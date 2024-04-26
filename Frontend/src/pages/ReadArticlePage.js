import axios from "axios";
import { useState, useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";
import DefaultURL from "../usefull/DefaultURL";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function ReadArticlePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState(null);
  const [article, setArticle] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

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

            const reponseThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-article-thumbnail/${id}`
            );
            const photo = reponseThumbnailArticlePhoto.data;
            const byteString = atob(photo.bytes);
            const byteArray = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
              byteArray[i] = byteString.charCodeAt(i);
            }
            const imageUrl = `data:image/jpeg;base64,${photo.bytes}`;
            setThumbnail(imageUrl);

            const response = await axios.get(
              `${DefaultURL}/article/date/${responseArticle.data.id}`
            );
            setDate(response.data);
          } else {
            navigate("/an-error-has-occured");
          }
        } catch (error) {
          // navigate("/an-error-has-occured");
        }
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="container-xl">
      <div>
        <div className="row">
          <div className="col d-flex justify-content-start me-3">
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

        <h1 style={{ paddingTop: "50px" }} className="article-title mt-5">
          {article?.title}
        </h1>
        <h4 className="article-undertitle col d-flex justify-content-center mt-5">
          {article?.contributors.length ? "Contributors" : "Author"}:
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
          <h4 className="article-undertitle col d-flex justify-content-center ms-5 mt-5">
            Location:
            <b className="ms-2 text-danger">{article?.location.country}</b>
            <img
              className="mx-2"
              data-toggle="tooltip"
              src={`https://flagsapi.com/${article?.location?.cca2}/flat/24.png`}
              alt={article?.location?.cca2}
              title={article?.location?.country}
            />
          </h4>

          <h4 className="article-undertitle col d-flex justify-content-center me-5 mt-5">
            Language:
            <b
              className="ms-2 text-danger"
              // style={{ color: "#9370DB" }}
            >
              {article?.language.languageNameEnglish} /{" "}
              {article?.language.languageNameNative}
            </b>
            <img
              className="mx-2"
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
          maxWidth: "1150px",
          // maxHeight: "1150px",
        }}
      />
      <div
        className="h4 fw-light text-start"
        dangerouslySetInnerHTML={{ __html: article?.body }}
      />
    </div>
  );
}
