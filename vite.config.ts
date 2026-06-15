import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // Relative asset paths make the site work both at username.github.io/repo
  // and at a custom domain.
  base: "./",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
});
