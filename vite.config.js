import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// リポジトリ名に合わせて変更してください
// 例: https://username.github.io/outdoor_event_check/ なら "/outdoor_event_check/"
const REPO_NAME = "/outdoor_event_check/";

export default defineConfig({
  plugins: [react()],
  base: REPO_NAME,
});
