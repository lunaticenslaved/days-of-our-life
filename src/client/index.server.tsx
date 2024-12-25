import { AppServer } from '#/client/app/app-server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

export function render(url: string) {
  return renderToString(
    <StaticRouter location={url}>
      <AppServer />
    </StaticRouter>,
  );
}
