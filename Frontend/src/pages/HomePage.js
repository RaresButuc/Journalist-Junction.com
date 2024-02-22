import { useState, useEffect } from "react";
import News from "../components/News";
import axios from "axios";

export default function HomePage() {
  const [news, setNews] = useState(null);

  // useEffect(() => {
  //   const getAllNews = async () => {
  //     const response = await axios.get(`http://localhost:8080/article`);
  //     const data = response.data;
  //     setNews(data);
  //   };
  //   getAllNews();
  // }, []);
  return (
    <div className="row">
      <div className="col-xl-8 col-sm-12">
        <News news={news} />
      </div>

      <div className="col-xl-4 col-sm-12">wow</div>
    </div>
  );
}
