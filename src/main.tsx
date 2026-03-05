import './index.css';
import type { RouteObject } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider }
  from 'react-router-dom';
import routes from './routes';
import App from './App';
// Kolla om vi är i produktion (Vite sköter detta via import.meta.env.PROD)
const basename = import.meta.env.PROD ? '/showtime' : '/';
// Create a router using settings/content from 'routes.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes as RouteObject[],
    HydrateFallback: App
  }
], {
  // Här lägger vi till basename!
  basename: basename
});

// Create the React root element
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);