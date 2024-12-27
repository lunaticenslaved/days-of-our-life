import { AppRouter } from '#/client/router';
import { Helmet } from 'react-helmet';
import FavIcon from '#/public/favicon.ico';

export function App() {
  return (
    <>
      <Helmet>
        <link rel="icon" type="image/svg+xml" href={FavIcon} />
      </Helmet>
      <AppRouter />
    </>
  );
}
