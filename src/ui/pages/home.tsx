import { PRODUCTS_NAVIGATION } from '#ui/pages/products';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

function Page() {
  return (
    <div>
      <Link to={PRODUCTS_NAVIGATION.toProducts()}>to products</Link>
      home page
      <input />
    </div>
  );
}

export default [<Route key="home-root" path="/" element={<Page />} />];
