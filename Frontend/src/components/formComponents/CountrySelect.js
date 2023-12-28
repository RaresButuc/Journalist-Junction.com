import { forwardRef, useState, useEffect } from "react";
import axios from "axios";

function NameInput({ user }, ref) {
  const [allCountries, setAllCountries] = useState([]);

  useEffect(() => {
    const allCountries = async () => {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const data = response.data.map((e) => e.name.common).sort();

      setAllCountries(data);
    };

    allCountries();
  }, []);

  return (
    <div>
      <select
        ref={ref}
        className="form-control"
        name="countryInput"
        defaultValue={user?.country}
        required
      >
        <option disabled selected value={user ? user?.country : ""}>
          {user ? user?.country : "Select Your Residence Country"}
        </option>
        {allCountries &&
          allCountries.map((country, index) => (
            <option value={country} key={index}>
              {country}
            </option>
          ))}
      </select>
    </div>
  );
}

export default forwardRef(NameInput);
