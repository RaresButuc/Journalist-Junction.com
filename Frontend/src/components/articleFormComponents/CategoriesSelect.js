import DefaultURL from "../../usefull/DefaultURL";
import FirstLetterUppercase from "../../usefull/FirstLetterUppercase";
import Select from "react-select";
import { forwardRef } from "react";
import { useState, useEffect } from "react";

import axios from "axios";

function CategoriesSelect({ action, id }, ref) {
  const [allCategories, setAllCategories] = useState([]);
  //   const [chosenCategories, setChosenCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${DefaultURL}/category`);

      setAllCategories(
        res.data.map((category) => ({
          label: FirstLetterUppercase(category.nameOfCategory),
          value: category.nameOfCategory,
        }))
      );
    };

    fetchCategories();
  }, [allCategories]);

  return (
    <div className="container-xl">
      <Select
        name="categoriesInput"
        id={id}
        ref={ref}
        options={allCategories}
        defaultValue={"Select Categories"}
        menuPortalTarget={document.body}
        onChange={action}
        // disabled={chosenCategories.length === 3}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? "grey" : "red",
          }),
        }}
      />
    </div>
  );
}

export default forwardRef(CategoriesSelect);
