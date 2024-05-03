import axios from "axios";
import { useState, useEffect } from "react";

import DefaultURL from "../usefull/DefaultURL";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";
import LocalDateTimeToString from "../usefull/LocalDateTimeToString";

export default function ArticleBox({ articles }) {
  const [thumbnails, setThumbnails] = useState(null);

  useEffect(() => {
    if (articles) {
      const getThumbnails = async () => {
        // const reponseThumbnailArticlePhoto = await axios.get(
        //   `${DefaultURL}/article/get-article-thumbnail/${id}`
        // );

        // const thumbnail = reponseThumbnailArticlePhoto.data;
        // const thumbnailImageUrl = `data:image/jpeg;base64,${thumbnail.bytes}`;
        // setThumbnails(thumbnailImageUrl);
      };
      
      getThumbnails()
    }
  }, [articles]);
  return (
    <div className="container-xl">
      {articles &&
        articles.map((article, index) => (
          <div className="container-xl mt-3" key={index}>
            <a
              href={`/read-article/${article.id}`}
              style={{
                textDecoration: "none",
                color: "black",
              }}
            >
              <div className="d-xl-flex align-items-center border-bottom border-danger">
                <img
                  className="img-fluid col-xl-5 col-sm-12 mb-3"
                  src="https://www.state.gov/wp-content/uploads/2022/01/shutterstock_248799484-scaled.jpg"
                  style={{ borderRadius: 16 }}
                />
                <div className="col-xl-7 col-sm-12">
                  <h3 className="mb-4">{article.title}</h3>
                  <p className="container-xl">{article.thumbnailDescription}</p>
                  <h5>Categories:</h5>
                  {article.categories.map((categ) => (
                    <a
                      href={`/articles-category/${categ.nameOfCategory}`}
                      className="btn btn-outline-success btn-sm ms-2 my-2"
                      style={{
                        borderRadius: 10,
                        fontSize: 15,
                      }}
                    >
                      {FirstLetterUppercase(categ.nameOfCategory)}
                    </a>
                  ))}
                  <div className="d-flex justify-content-between mt-5">
                    <h6 className="d-flex justify-content-start ms-3">
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
    </div>
  );
}
