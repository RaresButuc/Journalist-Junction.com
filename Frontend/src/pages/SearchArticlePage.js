import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ChangeLink from "../usefull/ChangeLink";
import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import Pagination from "../components/Pagination";

export default function SearchArticlePage() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

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
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <a
          className="btn btn-outline-success"
          type="button"
          id="button-addon2"
          href={`/article/search?pagenumber=1&input=${searchInput}`} // Folosim valoarea din starea locală în link
        >
          Search
        </a>
        <a
          className="btn btn-outline-danger"
          href="/article/search?pagenumber=1"
        >
          Reset Filters
        </a>
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
