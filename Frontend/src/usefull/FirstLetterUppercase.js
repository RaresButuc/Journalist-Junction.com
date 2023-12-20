export default function FirstLetterUppercase( category ) {
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}
