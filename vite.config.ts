import { defineConfig } from 'vite';

export default defineConfig({
  root: './',
  build: {
    target: 'esnext',
    outDir: './dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        ranking: 'src/ranking.html',
      }
    }
  }
});
