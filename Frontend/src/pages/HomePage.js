import axios from "axios";
import { useState, useEffect } from "react";

import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";

export default function HomePage() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const response = await axios.get(
        `${DefaultURL}/article/front-page-articles`
      );

      setArticles(response.data);
    };
    getAllArticles();
  }, []);

  return (
    <div className="row">
      <h1 className="article-title d-flex justify-content-center">
        Latest Articles
      </h1>
      <div className="col-xl-8 col-sm-12">
        {articles?.map((e) => (
          <>
            <a
              className="article-title h2 d-flex justify-content-center my-5 text-decoration-underline"
              href={`/articles-category/${e.category}`}
            >
              {e.category}
            </a>
            {!e.articles.length ? (
              <h2 className="text-danger">
                No Articles Available On This Category Yet!
              </h2>
            ) : (
              <>
                <ArticleBox
                  articles={e.articles}
                  category={e.category}
                  isLongerThan5={e.listLongerThan5}
                />
              </>
            )}
          </>
        ))}
      </div>
      <div className="col-xl-4 col-sm-12">wow</div>
    </div>
  );
}
