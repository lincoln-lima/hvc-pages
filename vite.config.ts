import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve('./index.html'),
        documentation: resolve('./pages/documentation.html'),
        playground: resolve('./pages/playground.html'),
        card: resolve('./templates/modal/card.html'),
        configs: resolve('./templates/modal/configs.html'),
        error: resolve('./templates/modal/error.html'),
        help: resolve('./templates/modal/help.html'),
        rating: resolve('./templates/modal/rating.html'),
        footer: resolve('./templates/footer.html'),
        table: resolve('./templates/table.html'),
        drawer: resolve('./templates/playground/drawer.html'),
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  }
});