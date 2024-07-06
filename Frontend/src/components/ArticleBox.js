import axios from "axios";
import { useState, useEffect } from "react";

import DefaultURL from "../usefull/DefaultURL";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";

export default function ArticleBox({ category, articles, isLongerThan5 }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (articles) {
      const getThumbnailsAndDates = async () => {
        const thumbsAndDates = await Promise.all(
          articles.map(async (article) => {
            const thumbnailImageUrl = `data:image/jpeg;base64,${article.thumbnail}`;

            const responseDate = await axios.get(
              `${DefaultURL}/article/date/${article.article.id}`
            );

            return {
              data: article.article,
              thumbnail: thumbnailImageUrl,
              date: responseDate.data,
            };
          })
        );

        setData(thumbsAndDates);
      };

      getThumbnailsAndDates();
    }
  }, [articles]);

  return (
    <div className="container-xl">
      {data &&
        data.map((article, index) => (
          <div className="container-xl mt-5" key={index}>
            <a
              href={`/article/read/${article.data.id}`}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <div className="d-xl-flex align-items-center border-bottom border-danger">
                <img
                  className="img-fluid col-xl-6 col-sm-12 mb-3"
                  alt={article.data.title}
                  src={article.thumbnail}
                  style={{ borderRadius: 16 }}
                />
                <div className="col-xl-6 col-sm-12">
                  <h3 className="mb-4">{article.data.title}</h3>
                  <p className="container-xl">{article.data.thumbnailDescription}</p>
                  <h5>Categories:</h5>
                  {article.data.categories.map((categ) => (
                    <a
                      href={`/article/search?pagenumber=1&category=${categ.nameOfCategory}`}
                      className="btn btn-outline-success btn-sm ms-2 my-2"
                      style={{
                        borderRadius: 10,
                        fontSize: 15,
                      }}
                      key={categ.nameOfCategory}
                    >
                      {FirstLetterUppercase(categ.nameOfCategory)}
                    </a>
                  ))}
                  <div className="d-flex justify-content-between ms-3 mt-3">
                    <h6 className="d-flex justify-content-start">
                      Author:
                      <a
                        className="ms-2"
                        href={`/profile/${article.data.owner.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        {article.data.owner.name}
                      </a>
                    </h6>
                    <h6 className="d-flex justify-content-end me-3">
                      Posted at: {article.date}
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
