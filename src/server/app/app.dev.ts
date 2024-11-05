import fs from 'fs';
import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';

import { PORT, ROOT_PATH } from '#server/constants';

import { addSSRRoute, configureApp } from './utils';

const HTML_FILE_PATH = path.resolve(ROOT_PATH, 'index.html');
const UI_RENDER_FILE_PATH = path.resolve(ROOT_PATH, 'src/ui/index.server');

export async function createApp() {
  const app = express();
  const vite = await createViteServer({
    server: { middlewareMode: true },
    root: ROOT_PATH,
    appType: 'custom',
    configFile: 'vite.client.config.ts',
  });

  app.use(vite.middlewares);

  await configureApp(app);

  addSSRRoute({
    app,
    getContent: async url =>
      vite.transformIndexHtml(url, fs.readFileSync(HTML_FILE_PATH, 'utf-8')),
    renderFn: (await vite.ssrLoadModule(UI_RENDER_FILE_PATH)).render,
    onError: vite.ssrFixStacktrace,
  });

  app.listen(PORT, () => {
    console.log(
      `  ➜ 🎸 [DEV] Server is listening on port: ${PORT}. Use this server: http://localhost:${PORT}`,
    );
  });
}
