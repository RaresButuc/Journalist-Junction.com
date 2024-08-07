import axios from "axios";
import { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";

import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import NewsMainPage from "../components/NewsMainPage";
import LongArticleSkeletonLoader from "../components/LongArticleSkeletonLoader";

export default function HomePage() {
  const [articles, setArticles] = useState(null);
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const getAllArticles = async () => {
      const responseCategories = await axios.get(`${DefaultURL}/category`);
      setCategories(
        responseCategories.data.map((e) => e.nameOfCategory).sort()
      );

      const response = await axios.get(
        `${DefaultURL}/article/front-page-articles`
      );

      setArticles(response.data);
    };
    getAllArticles();
  }, []);

  return (
    <div className="container-fluid row">
      <h1 className="article-title d-flex justify-content-center">
        Latest Articles
      </h1>
      <div className="col-xl-8 col-sm-12">
        {categories?.map((e) => (
          <>
            <a
              className="article-title h2 d-flex justify-content-center my-5 text-decoration-underline"
              href={`/article/search?category=${e}&pagenumber=1`}
            >
              {e}
            </a>
            {articles != null ? (
              articles
                .filter((i) => i.category === e)
                .map((e) => (
                  <>
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
                ))
            ) : (
              <LongArticleSkeletonLoader counterArticles={3} />
            )}
          </>
        ))}
      </div>
      <div
        className={`col-xl-4 col-sm-12 mt-5 ${
          !useMediaQuery({ query: "(max-width: 1200px)" })
            ? "border-danger border-start"
            : null
        }`}
      >
        <h1 className="article-title mb-3" style={{ fontSize: "3.5vw" }}>
          <u>Recommanded News</u>
        </h1>
        <NewsMainPage />
      </div>
    </div>
  );
}
