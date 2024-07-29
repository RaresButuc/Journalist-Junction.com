import axios from "axios";
import { useState, useEffect } from "react";
import { useIsAuthenticated, useAuthHeader } from "react-auth-kit";

import NewsBox from "./NewsBox";
import NewsSkeleton from "./NewsSkeleton";
import DefaultURL from "../usefull/DefaultURL";
import CurrentUserInfos from "../usefull/CurrentUserInfos";

const API = "1a268ab9a0fd456cb04711827d0cd27c";

export default function NewsMainPage() {
  const token = useAuthHeader();
  const isAuthenticated = useIsAuthenticated();

  const currentUser = CurrentUserInfos();

  const [news, setNews] = useState(null);

  useEffect(() => {
    const getNewsByPreferences = async () => {
      let newsResponse = [];

      if (isAuthenticated()) {
        const headers = { Authorization: token() };

        const res = await axios.get(`${DefaultURL}/user/preferences`, {
          headers,
        });
        let preferences = [
          ...new Set(
            res.data.length
              ? res.data
                  .map((e) => returnNewsCateg(e.category))
                  .filter((f) => f !== null)
              : []
          ),
        ];

        if (!preferences.length) {
          const response = await axios.get(
            `https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=${API}`
          );
          newsResponse = response.data.articles;
        } else if (preferences.length >= 3) {
          const preferencesArr =
            preferences.length === 3 ? preferences : preferences.slice(0, 4);

          const promises = preferencesArr.map((element) =>
            axios.get(
              `https://newsapi.org/v2/top-headlines?category=${element}&language=en&apiKey=${API}`
            )
          );

          const responses = await Promise.all(promises);

          newsResponse = responses
            .flatMap((response) => response.data.articles)
            .slice(0, 44);
        } else if (preferences.length < 3 && preferences.length !== 0) {
          const promises = preferences.map((element) =>
            axios.get(
              `https://newsapi.org/v2/top-headlines?category=${element}&language=en&apiKey=${API}`
            )
          );
          const responses = await Promise.all(promises);

          newsResponse = responses
            .flatMap((response) => response.data.articles)
            .slice(0, 45);
        }

        newsResponse = newsResponse
          .filter((i) => i.author !== null)
          .sort(
            (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
          );
      } else {
        const response = await axios.get(
          `https://newsapi.org/v2/top-headlines?category=general&language=en&apiKey=${API}`
        );

        const news = response.data.articles;
        newsResponse = news
          .slice(0, news.length >= 45 ? 45 : news.length)
          .filter((i) => i.author !== null)
          .sort(
            (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
          );
      }
      setNews(newsResponse);
    };

    getNewsByPreferences();
  }, [currentUser, isAuthenticated()]);

  const returnNewsCateg = (articleCateg) => {
    switch (articleCateg) {
      case ("art", "fashion", "music", "books", "travel"):
        return "entertainment";
      case "health":
        return "health";
      case "tech":
        return "technology";
      case "sports":
        return "sports";
      case ("home", "crafts"):
        return "science";
      default:
        return null;
    }
  };

  return news ? (
    news.map((e) => (
      <NewsBox
        title={e?.title}
        source={e?.source.name}
        text={e?.description}
        href={e?.url}
        datePosted={e?.publishedAt}
      />
    ))
  ) : (
    <NewsSkeleton counterNews={5} />
  );
}
