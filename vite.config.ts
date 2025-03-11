import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    target: "esnext",
    rollupOptions: {
      input: {
        main: resolve('./index.html'),
        playground: resolve('./pages/playground.html'),
        documentation: resolve('./pages/documentation.html'),
        help: resolve('./templates/modal/help.html'),
        card: resolve('./templates/modal/card.html'),
        error: resolve('./templates/modal/error.html'),
        rating: resolve('./templates/modal/rating.html'),
        configs: resolve('./templates/modal/configs.html'),
        table: resolve('./templates/table.html'),
        footer: resolve('./templates/footer.html'),
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