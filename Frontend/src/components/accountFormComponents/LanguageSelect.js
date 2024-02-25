import axios from "axios";
import Select from "react-select";
import DefaultURL from "../../usefull/DefaultURL";
import { forwardRef, useState, useEffect } from "react";

function CountrySelect({ article }, ref) {
  const [allLanguages, setAllLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${DefaultURL}/language`);
        const dataLanguages = response.data
          .map((language) => ({
            value: language.id,
            label: (
              <div>
                <img
                  className="mx-2 mb-1"
                  src={`https://flagsapi.com/${language.cca2}/flat/32.png`}
                />
                {language.languageNameEnglish} ({language.languageNameNative})
              </div>
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
          <div>
            <img
              className="mx-2 mb-1"
              src={`https://flagsapi.com/${article.language.cca2}/flat/32.png`}
            />
            {article.language.languageNameEnglish} ({article.language.languageNameNative})
          </div>
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
