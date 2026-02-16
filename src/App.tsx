import { useLocation } from 'react-router-dom';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';


import TicketSelector from "./Components/TicketSelector";







export default function App() {

  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  return <>
    <div className="min-h-screen flex flex-col">
      <Header />
      <Main />
      <div>
        <TicketSelector />
      </div>
      <Footer />
    </div>
  </>;
};