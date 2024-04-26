import { useState, useEffect } from "react";
import DefaultURL from "./DefaultURL";
import axios from "axios";

export default function LocalDateTimeToString(articleId) {
  const [date, setDate] = useState(null);

  useEffect(() => {
    const convertDateToString = async () => {
      if (articleId) {
        const response = await axios.get(
          `${DefaultURL}/article/date/${articleId}`
        );

        setDate(response.data);
      }
    };

    convertDateToString();
  }, [articleId]);

  return date;
}
