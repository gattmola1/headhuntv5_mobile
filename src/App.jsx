import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './config/routes';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import PageLoader from './components/layout/PageLoader';

// Lazy-loaded pages — only fetched when navigated to
const Explore = lazy(() => import('./pages/Explore'));
const Jobs = lazy(() => import('./pages/Jobs'));
const About = lazy(() => import('./pages/About'));
const Legal = lazy(() => import('./pages/Legal'));
const Network = lazy(() => import('./pages/Network'));
const Events = lazy(() => import('./pages/Events'));
const Sitemap = lazy(() => import('./pages/Sitemap'));

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Layout />}>
            <Route index element={<Home />} />
            <Route path={ROUTES.EXPLORE.slice(1)} element={<Explore />} />
            <Route path={ROUTES.JOBS.slice(1)} element={<Jobs />} />
            <Route path={ROUTES.ABOUT.slice(1)} element={<About />} />
            <Route path={ROUTES.LEGAL.slice(1)} element={<Legal />} />
            <Route path={ROUTES.NETWORK.slice(1)} element={<Network />} />
            <Route path={ROUTES.EVENTS.slice(1)} element={<Events />} />
            <Route path={ROUTES.SITEMAP.slice(1)} element={<Sitemap />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
export default App;
