import fs from 'fs';
import path from 'path';
import express from 'express';

import { PORT, ROOT_PATH } from '#/server/constants';

import { addSSRRoute, configureApp } from './utils';

const ASSETS_PATH = path.resolve(ROOT_PATH, 'dist/client/spa/assets');
const HTML_FILE_PATH = path.resolve(ROOT_PATH, 'dist/client/spa/index.html');
const RENDER_FILE_PATH = path.resolve(ROOT_PATH, 'dist/client/ssr/index.js');

export async function createApp() {
  const app = express();

  await configureApp(app);

  addSSRRoute({
    app,
    assetsFolder: ASSETS_PATH,
    getContent: () => fs.readFileSync(HTML_FILE_PATH, 'utf-8'),
    renderFn: (await import(RENDER_FILE_PATH)).render,
  });

  app.listen(PORT, () => {
    console.log(
      `  ➜ 🎸 [PROD] Server is listening on port: ${PORT}. Use this server: http://localhost:${PORT}`,
    );
  });
}
