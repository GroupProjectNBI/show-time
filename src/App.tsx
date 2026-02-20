import { useLocation } from 'react-router-dom'; // Lagt till Outlet om Main inte hanterar det
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';


// 1. IMPORTERA DINA PROVIDERS
// import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';

import { useState } from "react";
import MembershipOverlay from "./parts/MembershipOverlay";
import LoginOverlay from "./parts/LoginOverlay";
export default function App() {

  // Denna hook fungerar eftersom App ligger inuti RouterProvider i main.tsx
  const location = useLocation();
  const isAboutPage = location.pathname.startsWith("/om-oss");


  const [showLogin, setShowLogin] = useState(false);
  const [showMembership, setShowMembership] = useState(false);



  // Scroll to top vid sidbyte
  if (location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  return (
    // 2. WRAPPA HELA INNEHÅLLET HÄR
    <AuthProvider>
      <BookingProvider>
        {showMembership && (
          <MembershipOverlay onClose={() => setShowMembership(false)} />
        )}


        {showLogin && (<LoginOverlay onClose={() => setShowLogin(false)}
          openMembership={() => {
            setShowLogin(false);
            setShowMembership(true);
          }} />)}



        <div className="min-h-screen flex flex-col">

          <Header openMembership={() => setShowMembership(true)}
            openLogin={() => setShowLogin(true)}
          />

          <Main />
          <div className={isAboutPage ? "footer-about" : ""}>
            <Footer openMembership={() => setShowMembership(true)} />
          </div>

        </div>

      </BookingProvider>
    </AuthProvider >
  );
};