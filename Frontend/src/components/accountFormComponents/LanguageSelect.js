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
          .sort((a, b) =>
            a.languageNameEnglish.localeCompare(b.languageNameEnglish)
          )
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

        dataLanguages.push({
          value: "Other",
          label: (
            <div>
              <img
                className="mx-2 mb-1"
                src={
                  "https://creazilla-store.fra1.digitaloceanspaces.com/emojis/57756/globe-showing-europe-africa-emoji-clipart-md.png"
                }
                style={{ height: "32px", width: "32px" }}
              />
              Other
            </div>
          ),
        });

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
        label: article.language
          ? article.language
          : "Select The Language of Your Article",
        value: article ? article.language : null,
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
