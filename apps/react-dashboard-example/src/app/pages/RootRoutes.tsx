import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import Layout from '../../components/Layout';

const useElementBuilder = (
  Component: React.LazyExoticComponent<() => JSX.Element>,
  options?: {
    isProtected: boolean;
  }
) => {
  // TODO: connect to global state
  const isAuthenticated = true;
  const location = useLocation();

  if (options?.isProtected && !isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
  return (
    <React.Suspense fallback={<>...</>}>
      <Component />
    </React.Suspense>
  );
};

const Home = React.lazy(() => import('../pages/home'));

const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={useElementBuilder(Home)} />
        <Route path="*" element={<>No page</>} />
      </Route>
    </Routes>
  );
};

export default RootRoutes;