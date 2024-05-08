import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import ChangeLink from "../usefull/ChangeLink";
import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import Pagination from "../components/Pagination";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";
import CountrySelect from "../components/accountFormComponents/CountrySelect";
import LanguageSelect from "../components/accountFormComponents/LanguageSelect";

import art from "../photos/CategoriesIcons/art.png";
import books from "../photos/CategoriesIcons/books.png";
import crafts from "../photos/CategoriesIcons/crafts.png";
import fashion from "../photos/CategoriesIcons/fashion.png";
import health from "../photos/CategoriesIcons/health.png";
import home from "../photos/CategoriesIcons/home.png";
import music from "../photos/CategoriesIcons/music.png";
import sports from "../photos/CategoriesIcons/sports.png";
import tech from "../photos/CategoriesIcons/tech.png";
import travel from "../photos/CategoriesIcons/travel.png";

export default function SearchArticlePage() {
  const navigate = useNavigate();

  const [allArticles, setArticles] = useState(null);

  const [categories, setCategories] = useState(null);
  const categoriesPhotos = [
    art,
    books,
    crafts,
    fashion,
    health,
    home,
    music,
    sports,
    tech,
    travel,
  ];
  const [currentCategory, setCurrentCategory] = useState(null);

  const [searchInput, setSearchInput] = useState("");
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

        const responseArticles = await axios.get(
          `${DefaultURL}/article/posted?category=${categoryParam}&input=${inputParam}&currentpage=${
            pageNumberParam - 1
          }&itemsperpage=10`
        );
        const dataArticles = responseArticles.data;

        setPaginationDetails(dataArticles);
        setArticles(
          dataArticles.content.length > 0 ? dataArticles.content : null
        );
        setCurrentCategory(categoryParam);

        const responseCategories = await axios.get(`${DefaultURL}/category`);
        setCategories(
          responseCategories.data.map((e) => e.nameOfCategory).sort()
        );
      } catch (err) {
        navigate("/an-error-has-occurred");
      }
    };

    fetchArticles();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container-xl">
      <h1 className="article-title d-flex justify-content-center mb-5">
        Search An Article
      </h1>

      <div className="container-xl">
        <div
          className="row d-flex justify-content-center"
          style={{ marginTop: 60, marginBottom: 30 }}
        >
          {categories &&
            categories.map((e, index) => (
              <button
                key={index}
                onClick={() =>
                  ChangeLink("category", currentCategory === e ? null : e)
                }
                className={`card border-${
                  currentCategory === e ? "success" : "danger"
                } border-${currentCategory === e ? "4" : "1"} ms-3 mb-3`}
                style={{
                  maxWidth: "7rem",
                  backgroundColor: currentCategory === e ? "#90EE90" : null,
                }}
              >
                <div
                  className={`card-title text-${
                    currentCategory === e ? "success" : "danger"
                  }`}
                >
                  <h5> {FirstLetterUppercase(e)}</h5>
                </div>
                <img
                  className="img-fluid mb-2"
                  alt={e}
                  src={categoriesPhotos[index]}
                />
              </button>
            ))}
        </div>
      </div>

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
          href={`/article/search?pagenumber=1&input=${searchInput}`}
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

      <div className="row mt-5 d-flex justify-content-center border-bottom border-danger">
        <h2 className="article-title" style={{ fontSize: "50px" }}>
          Filter By:
        </h2>
        <div className="col-xl-4 mb-5">
          <CountrySelect />
        </div>
        <div className="col-xl-4">
          <LanguageSelect />
        </div>
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
