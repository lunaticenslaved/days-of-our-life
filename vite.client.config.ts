import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgLoader from '@andylacko/vite-svg-react-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgLoader(), react()],
  mode: process.env.NODE_ENV,
  build: {
    outDir: 'dist/client/spa',
  },
  resolve: {
    alias: {
      '#': resolve(__dirname, './src'),
    },
  },
  root: './',
  publicDir: 'src/public',
});
