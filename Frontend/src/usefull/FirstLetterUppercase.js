export default function FirstLetterUppercase(category) {
  return category
    ? category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()
    : null;
}
