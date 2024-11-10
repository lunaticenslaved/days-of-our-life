import { FOOD_NAVIGATION } from '#ui/pages/food';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

function Page() {
  return (
    <div>
      <Link to={FOOD_NAVIGATION.toRoot()}>to products</Link>
      home page
      <input />
    </div>
  );
}

export default [<Route key="home-root" path="/" element={<Page />} />];
