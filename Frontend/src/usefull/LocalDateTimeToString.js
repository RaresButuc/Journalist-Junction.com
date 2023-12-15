import { useState, useEffect } from "react";
import axios from "axios";

export default function LocalDateTimeToString(article) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const convertDateToString = async () => {
      const response = await axios.get(
        `http://localhost:8080/article/date/${article?.id}`
      );
      const data = response.data
      setDate(data);
    };
    convertDateToString();
  }, []);

  return date;
}
