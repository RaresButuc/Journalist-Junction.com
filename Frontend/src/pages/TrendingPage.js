import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import ChangeLink from "../usefull/ChangeLink";
import DefaultURL from "../usefull/DefaultURL";
import ArticleBox from "../components/ArticleBox";
import FirstLetterUppercase from "../usefull/FirstLetterUppercase";
import LongArticleSkeletonLoader from "../components/LongArticleSkeletonLoader";

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

const TRENDINGTIMES = [
  { btn: "Last 24 Hours", value: 1 },
  { btn: "Last Week", value: 7 },
  { btn: "Last Month", value: 30 },
];

export default function TrendingPage() {
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
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const categoryParam = new URLSearchParams(window.location.search).get(
          "category"
        );
        const timeParam = new URLSearchParams(window.location.search).get(
          "time"
        );

        const responseCategories = await axios.get(`${DefaultURL}/category`);
        setCategories(
          responseCategories.data.map((e) => e.nameOfCategory).sort()
        );

        const responseArticles = await axios.get(
          `${DefaultURL}/article/trending?category=${categoryParam}&time=${timeParam}`
        );
        const dataArticles = responseArticles.data;

        console.log(dataArticles);
        setArticles(dataArticles);
        setCurrentTime(timeParam);
        setCurrentCategory(categoryParam);
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
        Trending Articles
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
                  ChangeLink(
                    false,
                    "category",
                    currentCategory === e ? null : e
                  )
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

          <div className="container-xl">
            <a
              href="/article/trending?time=1"
              className="btn btn-lsm btn-outline-danger"
            >
              Reset All Filters
            </a>
          </div>

          <h2 className="mt-3 article-title" style={{ fontSize: "50px" }}>
            Filter By Posting Time:
          </h2>

          <div className="row justify-content-center">
            {TRENDINGTIMES?.map((e) => {
              return (
                <button
                  key={e.value}
                  className={`mx-3 col-2 btn btn-outline-${
                    currentTime == e.value ? "info" : "success"
                  } border-${currentTime == e.value ? "4" : "1"}`}
                  onClick={() => ChangeLink(false, "time", e.value)}
                >
                  <b>{e.btn}</b>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-top border-danger">
        {allArticles != null ? (
          allArticles.length ? (
            <div>
              <ArticleBox articles={allArticles} />
            </div>
          ) : (
            <h1 style={{ marginTop: 180 }}>
              <strong>No Article Found</strong>
            </h1>
          )
        ) : (
          <LongArticleSkeletonLoader counterArticles={3} />
        )}
      </div>
    </div>
  );
}
