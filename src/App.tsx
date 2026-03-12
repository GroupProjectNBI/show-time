import { useLocation } from 'react-router-dom';
import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';

import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { OverlayProvider } from './context/OverlayContext';

import { useState } from "react";
import MembershipOverlay from "./parts/MembershipOverlay";
import LoginOverlay from "./parts/LoginOverlay";
import CookiePopup from './parts/CookiePopup';
import AiChatOverlay from "./parts/AiChatOverlay";

export default function App() {

  const location = useLocation();
  const isAboutPage = location.pathname.startsWith("/om-oss");

  const [showLogin, setShowLogin] = useState(false);
  const [showMembership, setShowMembership] = useState(false);
  const [showCookies, setShowCookies] = useState(true);
  const [showAiChat, setShowAiChat] = useState(false); //  Chat state

  // Scroll to top vid sidbyte
  if (location.pathname) {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }

  return (
    <AuthProvider>
      <BookingProvider>

        {/*  OverlayProvider med AI-chat */}
        <OverlayProvider
          value={{
            openMembership: () => setShowMembership(true),
            openLogin: () => setShowLogin(true),
            openAiChat: () => setShowAiChat(true),
          }}
        >

          {/*  Membership */}
          {showMembership && (
            <MembershipOverlay onClose={() => setShowMembership(false)} />
          )}

          {/*  Login */}
          {showLogin && (
            <LoginOverlay
              onClose={() => setShowLogin(false)}
              openMembership={() => {
                setShowLogin(false);
                setShowMembership(true);
              }}
            />
          )}

          {/*  Cookies */}
          {showCookies && (
            <CookiePopup
              onAccept={() => setShowCookies(false)}
              onDecline={() => setShowCookies(false)}
            />
          )}

          {/* AI Chat Overlay (måste ligga UTANFÖR CookiePopup) */}
          {showAiChat && (
            <AiChatOverlay onClose={() => setShowAiChat(false)} />
          )}

          {/*  Hela sidlayouten */}
          <div className="min-h-screen flex flex-col">

            <Header
              openMembership={() => setShowMembership(true)}
              openLogin={() => setShowLogin(true)}
            />

            <main className={`flex-grow ${isAboutPage ? "" : "pb-2"}`}>
              <Main />
            </main>

            <div className={isAboutPage ? "footer-about" : ""}>
              <Footer openMembership={() => setShowMembership(true)} />
            </div>

          </div>

        </OverlayProvider>
      </BookingProvider>
    </AuthProvider>
  );
};
