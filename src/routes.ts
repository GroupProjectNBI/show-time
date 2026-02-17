import type Route from './interfaces/Route.ts';
import { createElement } from 'react';

// page components
import AboutPage from './pages/AboutPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import OurVisionPage from './pages/OurVisionPage.tsx';
import ProductDetailsPage from './pages/ProductDetailsPage.tsx';
import AnimalPage from './pages/Animal.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import ScreeningsPage from './pages/ScreeningsPage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';
//import BookingPanelTestPage from './pages/BookingPanelTestPage.tsx';
import WorkWithUs from "./pages/WorkWithUs.tsx";
import Faq from "./pages/FaqPage.tsx";
import StartPage from './pages/StartPage.tsx';




export default [

  AboutPage,
  NotFoundPage,
  OurVisionPage,
  ProductDetailsPage,
  ProductsPage,
  ScreeningsPage,
  BookingPage,
  AnimalPage,
  ConfirmationPage,
  //BookingPanelTestPage,
  WorkWithUs,
  Faq,
  //BookingPanelTestPage,
  // WorkWithUs,
  StartPage
]
  // map the route property of each page component to a Route
  .map(x => (({ element: createElement(x), ...x.route }) as Route))
  // sort by index (and if an item has no index, sort as index 0)
  .sort((a, b) => (a.index || 0) - (b.index || 0));