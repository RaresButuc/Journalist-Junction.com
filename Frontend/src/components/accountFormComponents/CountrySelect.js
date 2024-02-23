import axios from "axios";
import Select from "react-select";
import { forwardRef, useState, useEffect } from "react";

function CountrySelect({ user, article }, ref) {
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const dataCountries = response.data.map((country) => ({
          value: country.name.common,
          label: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                className="mx-2 mb-1"
                src={`https://flagsapi.com/${country.cca2}/flat/32.png`}
              />
              {country.name.common}
            </div>
          ),
        }));

        const sortedCountries = dataCountries.sort((a, b) =>
          a.value.localeCompare(b.value)
        );

        sortedCountries.unshift({
          value: "Global",
          label: (
            <div className="d-flex justify-content-center">
              <img
                className="mx-2 mb-1"
                src={
                  "https://creazilla-store.fra1.digitaloceanspaces.com/emojis/57756/globe-showing-europe-africa-emoji-clipart-md.png"
                }
                style={{ height: "32px", width: "32px" }}
              />
              Global
            </div>
          ),
        });

        setAllCountries(sortedCountries);
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
        label: article
          ? article.location
            ? article.location
            : "Select A Suitable Location For Article"
          : user
          ? user.country
          : "Select Your Residence Country",
        value: article
          ? article.location
            ? article.location
            : "No Location Specified"
          : user
          ? user.country
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
