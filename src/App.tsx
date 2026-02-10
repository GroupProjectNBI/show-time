import { useLocation } from 'react-router-dom';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';


export default function App() {

  // scroll to top when the route changes
  useLocation();
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

  return <>
    <div className='min-h-screen flex flex-col bg-slate-900 text-slate-100'>
      <div className='m-4 rounded-xl bg-green-500 p-6 text-black text-xl font-bold'>
        Test tailwind
      </div>
      <Header />
      <Main />
      <Footer />
    </div>
  </>;
};