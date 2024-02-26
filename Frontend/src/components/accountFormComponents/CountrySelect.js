import axios from "axios";
import Select from "react-select";
import DefaultURL from "../../usefull/DefaultURL";
import { forwardRef, useState, useEffect } from "react";
import LanguageLocationOptionLabel from "../articleFormComponents/LanguageLocationOptionLabel";

function CountrySelect({ user, article }, ref) {
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${DefaultURL}/location`);
        const dataCountries = response.data.map((location) => ({
          value: location.id,
          label: (
            <LanguageLocationOptionLabel
              cca2={location.cca2}
              value={location.country}
            />
          ),
        }));

        setAllCountries(dataCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, [article]);

  return (
    <Select
      name="countryInput"
      ref={ref}
      options={allCountries}
      defaultValue={{
        label: article ? (
          article.location ? (
            <LanguageLocationOptionLabel
              cca2={article.location.cca2}
              value={article.location.country}
            />
          ) : (
            "Select A Suitable Location For Article"
          )
        ) : user ? (
          <LanguageLocationOptionLabel
            cca2={user.location.cca2}
            value={user.location.country}
          />
        ) : (
          "Select Your Residence Country"
        ),
        value: article
          ? article.location
            ? article.location.id
            : "No Location Specified"
          : user
          ? user.location.id
          : null,
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
