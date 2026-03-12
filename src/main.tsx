import './index.css';
import type { RouteObject } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider }
  from 'react-router-dom';
import routes from './routes';
import App from './App';
import { Toaster } from 'react-hot-toast';
// Create a router using settings/content from 'routes.tsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: routes as RouteObject[],
    HydrateFallback: App
  }
]);

// Create the React root element
createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Toaster position="top-center" reverseOrder={false} />
    <RouterProvider router={router} />
  </StrictMode>
);