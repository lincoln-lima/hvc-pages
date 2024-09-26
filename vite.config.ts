import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('./index.html'),
        documentation: resolve('./pages/documentation.html'),
        playground: resolve('./pages/playground.html')
      }
    }
  }
});