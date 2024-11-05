import { Suspense } from 'react';
import { Route, Routes } from 'react-router';

import HomeRouter from './pages/home';
import FoodRouter, { FOOD_NAVIGATION } from './pages/food';
import { Link } from 'react-router-dom';

export function AppRouter() {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '100px', display: 'flex', flexDirection: 'column' }}>
        <Link to={FOOD_NAVIGATION.toProducts()}>Продукты</Link>
        <Link to={FOOD_NAVIGATION.toRecipes()}>Рецепты</Link>
      </aside>
      <main>
        <Suspense>
          <Routes>
            {HomeRouter}
            {FoodRouter}
            {/* TODO add not found page */}
            <Route path="*" element={<div>not found</div>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
