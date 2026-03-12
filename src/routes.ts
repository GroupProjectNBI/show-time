import type Route from './interfaces/Route.ts';
import { createElement } from 'react';

// page components
import AboutPage from './pages/AboutPage.tsx';
import NotFoundPage from './pages/NotFoundPage.tsx';
import ScreeningsPage from './pages/ScreeningsPage.tsx';
import BookingPage from './pages/BookingPage.tsx';
import ConfirmationPage from './pages/ConfirmationPage.tsx';
import WorkWithUs from "./pages/WorkWithUs.tsx";
import WorkApplication from './pages/WorkApplicationPage.tsx';
import FaqPage from "./pages/FaqPage.tsx";   //  korrekt import
import StartPage from './pages/StartPage.tsx';
import MovieInfo from './pages/MovieInfo.tsx';
import VisitInfoLink from './pages/VisitInfo.tsx';
import MyPage from './pages/MyPage.tsx';


//  Alla dynamiska routes UTOM FAQ
const dynamicPages = [
  AboutPage,
  VisitInfoLink,
  NotFoundPage,
  ScreeningsPage,
  BookingPage,
  ConfirmationPage,
  WorkWithUs,
  WorkApplication,
  StartPage,
  MovieInfo,
  MyPage
].map(x => (({ element: createElement(x), ...x.route }) as Route));


//  FAQ som statisk route — men med createElement (viktigt!)
const faqRoute: Route = {
  path: "/faq",
  menuLabel: "FAQ",
  index: 3,
  element: createElement(FaqPage)   // FIXEN
};


// Exportera allt
export default [...dynamicPages, faqRoute]
  .sort((a, b) => (a.index || 0) - (b.index || 0));
