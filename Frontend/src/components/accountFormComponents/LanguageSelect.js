import axios from "axios";
import Select from "react-select";
import { forwardRef, useState, useEffect } from "react";

import DefaultURL from "../../usefull/DefaultURL";
import FirstLetterUppercase from "../../usefull/FirstLetterUppercase";
import LanguageLocationOptionLabel from "../articleFormComponents/LanguageLocationOptionLabel";
import ChangeLink from "../../usefull/ChangeLink";

function CountrySelect({ article }, ref) {
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${DefaultURL}/language`);
        const dataLanguages = response.data.map((language) => ({
          value: language.id,
          label: (
            <LanguageLocationOptionLabel
              cca2={language.cca2}
              value={`${FirstLetterUppercase(language.languageNameEnglish)} (${
                language.languageNameNative
              })`}
            />
          ),
        }));

        setAllLanguages(dataLanguages);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <Select
      name="languageInput"
      ref={ref}
      options={allLanguages}
      onChange={(e) =>
        ref
          ? ChangeLink(
              "language",
              e.label.props.value.split(" ")[0].charAt(0).toLowerCase() +
                e.label.props.value.split(" ")[0].slice(1)
            )
          : null
      }
      defaultValue={{
        label:
          article && article.language ? (
            <LanguageLocationOptionLabel
              cca2={article.language.cca2}
              value={`${FirstLetterUppercase(article.language.languageNameEnglish)} (${FirstLetterUppercase(article.language.languageNameNative)})`}
            />
          ) : (
            "Select The Language of The Article"
          ),
        value: article && article.language ? article.language.id : null,
      }}
      menuPortalTarget={document.body}
      styles={{
        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: state.isFocused ? "grey" : "red",
        }),
      }}
    />
  );
}

export default forwardRef(CountrySelect);
