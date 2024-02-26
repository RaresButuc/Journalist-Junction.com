import axios from "axios";
import Select from "react-select";
import DefaultURL from "../../usefull/DefaultURL";
import { forwardRef, useState, useEffect } from "react";
import LanguageLocationOptionLabel from "../articleFormComponents/LanguageLocationOptionLabel";

function CountrySelect({ article }, ref) {
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${DefaultURL}/location`);
        const dataLanguages = response.data.map((language) => ({
          value: language.id,
          label: (
            <LanguageLocationOptionLabel
              cca2={language.cca2}
              value={`${language.languageNameEnglish} (${language.languageNameNative})`}
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
      defaultValue={{
        label: article.language ? (
          <LanguageLocationOptionLabel
            cca2={article.language.cca2}
            value={`${article.language.languageNameEnglish} (${article.language.languageNameNative})`}
          />
        ) : (
          "Select The Language of Your Article"
        ),
        value: article.language ? article.language.id : null,
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
