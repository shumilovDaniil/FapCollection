// vite.config.ts (или .js)
import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", ""); // читает .env, .env.production и т.п.

  return {
    // ВАЖНО: укажи точное имя репозитория с учётом регистра
    // например: base: "/FapCollection/"
    base: "/repo-name/",

    plugins: [react()],

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "."),
      },
    },

    // Если хочешь пробросить ключи без префикса VITE_ (не обязателно, но можно):
    define: {
      "process.env.API_KEY": JSON.stringify(env.GEMINI_API_KEY),
      "process.env.GEMINI_API_KEY": JSON.stringify(env.GEMINI_API_KEY),
    },
  };
});
