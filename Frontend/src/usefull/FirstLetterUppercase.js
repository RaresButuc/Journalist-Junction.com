export default function FirstLetterUppercase(category) {
  return category
    ? !category.includes(" ")
      ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
      : category
          .split(" ")
          .map((e) => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
          .join(" ")
    : null;
}
