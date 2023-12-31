import { forwardRef, useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";

function CountrySelect({ user }, ref) {
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
                src={`https://flagsapi.com/${country.cca2}/flat/16.png`}
              />
              {country.name.common}
            </div>
          ),
        }));

        const sortedCountries = dataCountries.sort((a, b) =>
          a.value.localeCompare(b.value)
        );
        setAllCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  return (
    <Select
      name="countryInput"
      ref={ref}
      options={allCountries}
      defaultValue={{
        label: user ? user.country : "Select Your Residence Country",
        value: user ? user.country : "",
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
