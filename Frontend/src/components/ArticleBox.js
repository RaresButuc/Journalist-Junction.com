import axios from "axios";
import { useState, useEffect } from "react";

import DefaultURL from "../usefull/DefaultURL";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";
import LocalDateTimeToString from "../usefull/LocalDateTimeToString";

export default function ArticleBox({ category, articles, isLongerThan5 }) {
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    if (articles) {
      const getThumbnails = async () => {
        const newThumbnails = await Promise.all(
          articles.map(async (article) => {
            const responseThumbnailArticlePhoto = await axios.get(
              `${DefaultURL}/article/get-article-thumbnail/${article.id}`
            );
            const thumbnailImageUrl = `data:image/jpeg;base64,${responseThumbnailArticlePhoto.data.bytes}`;
            return thumbnailImageUrl;
          })
        );

        setThumbnails(newThumbnails);
      };

      getThumbnails();
    }
  }, [articles]);

  return (
    <div className="container-xl">
      {articles &&
        articles.map((article, index) => (
          <div className="container-xl mt-5" key={index}>
            <a
              href={`/article/read/${article.id}`}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <div className="d-xl-flex align-items-center border-bottom border-danger">
                <img
                  className="img-fluid col-xl-6 col-sm-12 mb-3"
                  alt={article.title}
                  src={thumbnails[index]}
                  style={{ borderRadius: 16 }}
                />
                <div className="col-xl-6 col-sm-12">
                  <h3 className="mb-4">{article.title}</h3>
                  <p className="container-xl">{article.thumbnailDescription}</p>
                  <h5>Categories:</h5>
                  {article.categories.map((categ) => (
                    <a
                      href={`/article/search?pagenumber=1&category=${categ.nameOfCategory}`}
                      className="btn btn-outline-success btn-sm ms-2 my-2"
                      style={{
                        borderRadius: 10,
                        fontSize: 15,
                      }}
                    >
                      {FirstLetterUppercase(categ.nameOfCategory)}
                    </a>
                  ))}
                  <div className="d-flex justify-content-between ms-3 mt-3">
                    <h6 className="d-flex justify-content-start">
                      Author:
                      <a
                        className="ms-2"
                        href={`/profile/${article.owner.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {article.owner.name}
                      </a>
                    </h6>
                    <h6 className="d-flex justify-content-end me-3">
                      Posted at: {LocalDateTimeToString(article.id)}
                    </h6>
                  </div>
                </div>
              </div>
            </a>
          </div>
        ))}
      {articles && isLongerThan5 ? (
        <a
          className="btn btn-outline-success mt-4"
          href={`/article/search?category=${category}&pagenumber=1`}
          style={{ fontSize: "25px" }}
        >
          See More {FirstLetterUppercase(category)} Articles..
        </a>
      ) : null}
    </div>
  );
}
