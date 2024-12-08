import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgLoader from '@andylacko/vite-svg-react-loader';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgLoader()],
  mode: process.env.NODE_ENV,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/ui/index.server.tsx'),
      name: 'UI',
      fileName: 'index',
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        format: 'cjs',
        dir: 'dist/ui/ssr',
      },
    },
  },
  resolve: {
    alias: {
      '#': resolve(__dirname, './src'),
      '#ui': resolve(__dirname, './src/ui'),
      '#libs': resolve(__dirname, './src/libs'),
      '#shared': resolve(__dirname, './src/shared'),
    },
  },
});
