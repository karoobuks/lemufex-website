
export function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")   // spaces → dashes
    .replace(/[^a-z0-9-]/g, ""); // remove special chars
}

export function reverseSlugify(slug) {
  return slug
    .replace(/-/g, " ")     // dashes → spaces
    .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize each word
}
