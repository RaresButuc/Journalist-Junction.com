import DefaultURL from "../../usefull/DefaultURL";
import FirstLetterUppercase from "../../usefull/FirstLetterUppercase";
import Select from "react-select";
import { forwardRef } from "react";
import { useState, useEffect } from "react";

import axios from "axios";

function CategoriesSelect({ action, id, disabled, currentChosenCategs }, ref) {
  const [allCategories, setAllCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(`${DefaultURL}/category`);

      setAllCategories(
        res.data
          .filter(
            (e) => !currentChosenCategs.some((element) => element.id === e.id)
          )
          .map((category) => ({
            label: FirstLetterUppercase(category.nameOfCategory),
            value: category,
          }))
      );
    };

    fetchCategories();
  }, [currentChosenCategs]);

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
        isDisabled={disabled}
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
