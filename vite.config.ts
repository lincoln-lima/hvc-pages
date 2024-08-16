import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve('./index.html'),
        playground: resolve('./pages/playground.html'),
        table: resolve('./templates/table.html'),
        footer: resolve('./templates/footer.html')
      }
    }
  }
});