import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import Pagination from "../components/Pagination";

export default function SearchArticlePage() {
  const navigate = useNavigate();

  const [allArticles, setArticles] = useState(null);
  const [paginationDetails, setPaginationDetails] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const categoryParam = new URLSearchParams(window.location.search).get(
          "category"
        );
        const inputParam = new URLSearchParams(window.location.search).get(
          "input"
        );
        const pageNumberParam = new URLSearchParams(window.location.search).get(
          "pagenumber"
        );

        const response = await axios.get(
          `${DefaultURL}/article/posted?category=${categoryParam}&input=${inputParam}&currentpage=${
            pageNumberParam - 1
          }&itemsperpage=10`
        );
        const data = response.data;

        setPaginationDetails(data);
        setArticles(data.content.length > 0 ? data.content : null);
      } catch (err) {
        navigate("/an-error-has-occurred");
      }
    };

    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-xl">
      <h1 className="article-title d-flex justify-content-center mb-5">
        Search An Article
      </h1>
      <div className="input-group input-group-lg">
        <input
          type="text"
          className="form-control"
          placeholder="What Are You Looking For?"
        />
        <button
          className="btn btn-outline-success"
          type="button"
          id="button-addon2"
        >
          Search
        </button>
      </div>

      {allArticles ? (
        <div>
          <ArticleBox articles={allArticles} />
          <Pagination elements={paginationDetails} />
        </div>
      ) : (
        <h1 style={{ marginTop: 180 }}>
          <strong>No Article Found</strong>
        </h1>
      )}
    </div>
  );
}
