import { defineConfig } from 'astro/config';
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    sitemap(),
  ],
  vite: {
    define: {
      'process.env.MEDUSA_BACKEND_URL': JSON.stringify(process.env.PUBLIC_MEDUSA_BACKEND_URL)
    }
  }
});