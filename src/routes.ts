import type Route from './interfaces/Route.ts';
import { createElement } from 'react';

// page components
import AboutPage from './pages/AboutPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ScreeningsPage from './pages/ScreeningsPage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';
import WorkWithUs from "./pages/WorkWithUs.tsx";
import Faq from "./pages/FaqPage.tsx";
import StartPage from './pages/StartPage.tsx';
import MovieInfo from './pages/MovieInfo.tsx';
import VisitInfoLink from './pages/VisitInfo.tsx';
import MyPage from './pages/MyPage.tsx';
import CancelBookingPage from './pages/CancelBookingPage.tsx';




export default [

  AboutPage,
  VisitInfoLink,
  ScreeningsPage,
  BookingPage,
  ConfirmationPage,
  CancelBookingPage,
  WorkWithUs,
  StartPage,
  MovieInfo,
  Faq,
  MyPage,
  NotFoundPage
]
  // map the route property of each page component to a Route
  .map(x => {
    const route = (x as any).route || {};
    return { element: createElement(x), ...route } as Route;
  });


