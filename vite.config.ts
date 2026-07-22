import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// base is set to relative paths ("./") so the built site works no matter what
// address it is served from, including a GitHub Pages project URL like
// https://username.github.io/repository/ . This avoids the common blank page
// problem without needing to hardcode the repository name.
export default defineConfig({
  plugins: [react()],
  base: "./",
})
