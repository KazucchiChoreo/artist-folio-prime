import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rollupOptions: {
        input: {
          main: "src/client.tsx",
        },
      },
    },
  },
});
