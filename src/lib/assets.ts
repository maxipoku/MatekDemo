// Builds a URL to a file inside public/assets. Using import.meta.env.BASE_URL
// keeps the path correct no matter what address the site is served from.
const base = import.meta.env.BASE_URL

export function imageUrl(file: string): string {
  return `${base}assets/images/${file}`
}

export function audioUrl(file: string): string {
  return `${base}assets/audio/${file}`
}
