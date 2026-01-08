// vite.config.ts (No change needed, this file looks correct for a typical setup)
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; 

// https://vite.dev/config/
export default defineConfig({
  // Add the tailwindcss plugin to the plugins array
  plugins: [react(), tailwindcss()],
});