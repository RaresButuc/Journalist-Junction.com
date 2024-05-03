import axios from "axios";
import { useState, useEffect } from "react";

import ArticleBox from "../components/ArticleBox";
import DefaultURL from "../usefull/DefaultURL";

export default function HomePage() {
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    const getAllNews = async () => {
      const response = await axios.get(
        `${DefaultURL}/article/front-page-articles`
      );
      const arrayFromObject = Object.entries(response.data).map(
        ([key, value]) => {
          return { key, value };
        }
      );
      arrayFromObject.map((e) => console.log(e));
      setArticles(arrayFromObject);
    };

    getAllNews();
  }, []);

  return (
    <div className="row">
      <h1 className="article-title d-flex justify-content-center">
        Latest Articles
      </h1>
      <div className="col-xl-8 col-sm-12">
        {articles?.map((e) => (
          <>
            <h1 className="article-title d-flex justify-content-center my-5 text-decoration-underline">
              {e.key}
            </h1>
            <ArticleBox articles={e.value} />
          </>
        ))}
      </div>
      <div className="col-xl-4 col-sm-12">wow</div>
    </div>
  );
}
