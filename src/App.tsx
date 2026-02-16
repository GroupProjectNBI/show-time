import { useLocation } from 'react-router-dom'; // Lagt till Outlet om Main inte hanterar det
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';
import TicketSelector from "./Components/TicketSelector"; // Osäker på om denna behövs här, men vi behåller den






// 1. IMPORTERA DINA PROVIDERS
// import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

export default function App() {

  // Denna hook fungerar eftersom App ligger inuti RouterProvider i main.tsx
  const location = useLocation();

  // Scroll to top vid sidbyte
  if (location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  return (
    // 2. WRAPPA HELA INNEHÅLLET HÄR
    // <AuthProvider>
    <BookingProvider>

      <div className="min-h-screen flex flex-col">

        <Header />
        <Main />

        <div>
          <TicketSelector />
        </div>

        <Footer />

      </div>

    </BookingProvider>
    // </AuthProvider >
  );
};