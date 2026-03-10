import { useLocation } from 'react-router-dom'; // Lagt till Outlet om Main inte hanterar det
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';


// 1. IMPORTERA DINA PROVIDERS
// import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { OverlayProvider } from './context/OverlayContext';

import { useState } from "react";
import MembershipOverlay from "./parts/MembershipOverlay";
import LoginOverlay from "./parts/LoginOverlay";
import CookiePopup from './parts/CookiePopup';
export default function App() {

  // Denna hook fungerar eftersom App ligger inuti RouterProvider i main.tsx
  const location = useLocation();
  const isAboutPage = location.pathname.startsWith("/om-oss");


  const [showLogin, setShowLogin] = useState(false);
  const [showMembership, setShowMembership] = useState(false);

  const [showCookies, setShowCookies] = useState(true);



  // Scroll to top vid sidbyte
  if (location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  return (
    // 2. WRAPPA HELA INNEHÅLLET HÄR
    <AuthProvider>
      <BookingProvider>
        <OverlayProvider
          value={{
            openMembership: () => setShowMembership(true),
            openLogin: () => setShowLogin(true),
          }}
        >
          {showMembership && (
            <MembershipOverlay onClose={() => setShowMembership(false)} />
          )}


          {showLogin && (<LoginOverlay onClose={() => setShowLogin(false)}
            openMembership={() => {
              setShowLogin(false);
              setShowMembership(true);
            }} />)}

          {showCookies && (
            <CookiePopup
              onAccept={() => setShowCookies(false)}
              onDecline={() => setShowCookies(false)}
            />
          )}



          <div className="min-h-screen flex flex-col">

            <Header openMembership={() => setShowMembership(true)}
              openLogin={() => setShowLogin(true)}
            />

            {/* Main tar upp allt ledigt utrymme och centrerar innehållet */}
            <main className={`flex-grow ${isAboutPage ? "" : "pb-2"}`}>
              <Main />
            </main>
            <div className={isAboutPage ? "footer-about" : ""}>
              <Footer openMembership={() => setShowMembership(true)} />
            </div>

          </div>
        </OverlayProvider>
      </BookingProvider>
    </AuthProvider >
  );
};