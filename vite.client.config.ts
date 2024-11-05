import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgLoader from '@andylacko/vite-svg-react-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgLoader(), react()],
  mode: process.env.NODE_ENV,
  build: {
    outDir: 'dist/ui/spa',
  },
  resolve: {
    alias: {
      '#ui': resolve(__dirname, './src/ui'),
      '#libs': resolve(__dirname, './src/libs'),
      '#shared': resolve(__dirname, './src/shared'),
    },
  },
});
