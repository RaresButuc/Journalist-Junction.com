export default function FirstLetterUppercase( category ) {
console.log(category)
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
}
