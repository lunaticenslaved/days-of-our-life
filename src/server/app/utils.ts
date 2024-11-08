import { Express, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import fs from 'fs';
import { resolve } from 'path';
import { prisma } from '../prisma';
import { CORS_ORIGIN_WHITELIST, ROOT_PATH } from '#server/constants';
import { addHeaders, addUserFromCookie } from '#server/middlewares';
import { LC } from '#shared/types';
import { APP_ENV } from '#server/constants';

import { RequestContext } from '#server/utils/RequestContext';
import express from 'express';
import { Controller } from '#server/utils/Controller';
import path from 'path';
import { ApiError } from '#shared/errors';
import { ApiResponse } from '#shared/api/types/shared';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadControllers(): Promise<Controller<any>[]> {
  const paths = fs.readdirSync(path.resolve(ROOT_PATH, 'src/server/controllers'));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Controller<any>[] = [];

  while (paths.length) {
    const item = paths.pop();

    if (!item) {
      continue;
    }

    const currentPath = path.resolve(ROOT_PATH, 'src/server/controllers', item);
    const stat = fs.lstatSync(currentPath);

    if (stat.isDirectory()) {
      fs.readdirSync(currentPath).forEach(i => {
        paths.push(`${item}/${i}`);
      });
    } else {
      const { default: controller } = await import(currentPath);

      if (controller instanceof Controller) {
        result.push(controller);
      }
    }
  }

  return result;
}

export async function configureApp(app: Express) {
  try {
    await prisma.$connect();
    console.log('Соединение с БД было успешно установлено');
  } catch (e) {
    console.log('Невозможно выполнить подключение к БД: ', e);
  }

  app.disable('x-powered-by');
  app.disable('via');

  app.use(fileUpload());
  app.use(cookieParser());
  app.use(
    cors({
      credentials: true,
      origin: CORS_ORIGIN_WHITELIST,
    }),
  );
  app.use(express.json());
  app.use(addHeaders);

  const controllers = await loadControllers();

  for (const { data } of controllers) {
    for (const key of Object.keys(data)) {
      const config = data[key as keyof typeof data];

      if (!config) continue;

      const { parse, handler } = config;
      const [method, route] = key.split(' ');

      console.log(method, route);

      // @ts-ignore
      app[method.toLowerCase()](`/api${route}`, async (req: Request, res: Response) => {
        const data = parse(req);

        const requestContext: RequestContext = {
          prisma: prisma,
        };

        res.setHeader('content-type', 'application/json');

        try {
          const resData = await handler(data, requestContext);

          res
            .status(200)
            .send({
              type: 'success',
              data: resData,
            } satisfies ApiResponse<unknown>)
            .end();
        } catch (error) {
          let status = 500;
          let message = (error as Error)?.message || 'Unknown error';

          if (error instanceof ApiError) {
            message = error.message;
            status = error.status;
          }

          console.error(error);

          res
            .status(status)
            .send({
              type: 'error',
              message: message,
            } satisfies ApiResponse<unknown>)
            .end();
        }
      });
    }
  }

  const unknownApiUrl = (req: Request, res: Response) => {
    return res.status(400).send('Unknown api path - ' + req.url);
  };

  app.use('/api/*', unknownApiUrl);
}

type RenderHTMLProps = {
  app: Express;
  renderFn: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  getContent(url: string): Promise<string> | string;
  onError?(error: Error): void;
  assetsFolder?: string;
};

export function addSSRRoute({
  app,
  getContent,
  onError,
  renderFn,
  assetsFolder,
}: RenderHTMLProps) {
  let staticFiles: string[] = [];

  if (assetsFolder) {
    fs.readdir(assetsFolder, (err, files) => {
      if (!err) {
        staticFiles = files;
      } else {
        console.error('Ошибка при чтении папки:', err);
      }
    });
  }

  app.use('*', addUserFromCookie, async (req: Request, res, next) => {
    try {
      const filePath = staticFiles.find(file => req.baseUrl.endsWith(file));

      if (filePath && assetsFolder) {
        res.sendFile(resolve(assetsFolder, filePath));
        return;
      }

      const url = req.originalUrl;
      // const userId = req.user?.id;
      const user = undefined;

      const initialState: LC = {
        user: user || undefined,
        appEnv: APP_ENV,
      };

      const appHtml = await renderFn(url, initialState);
      const content = await getContent(url);

      const storeIncrementHtml = `
        <script>
          window.__IS_SSR__ = true;
          window.LC = ${JSON.stringify(initialState)}
        </script>`;
      const html = content
        .replace(`<!-- ssr-outlet -->`, appHtml)
        .replace(`<!-- store-outlet -->`, storeIncrementHtml);

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      if (onError) {
        onError(e as Error);
      }

      next(e);
    }
  });
}
