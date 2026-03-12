// 👇 Lägg detta allra högst upp i filen, utanför komponenten
let cookieShownThisSession = false;

import { useLocation } from 'react-router-dom';

import Header from "./partials/Header";
import Main from './partials/Main';
import Footer from './partials/Footer';

import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import { OverlayProvider } from './context/OverlayContext';

// ⭐ Lägg till useEffect här
import { useState, useEffect } from "react";

import MembershipOverlay from "./parts/MembershipOverlay";
import LoginOverlay from "./parts/LoginOverlay";
import CookiePopup from './parts/CookiePopup';
import AiChatOverlay from "./parts/AiChatOverlay";

export default function App() {

  const location = useLocation();
  const isAboutPage = location.pathname.startsWith("/om-oss");

  const [showLogin, setShowLogin] = useState(false);
  const [showMembership, setShowMembership] = useState(false);

  // ⭐ Cookie-popup visas EN gång per sidladdning
  const [showCookies, setShowCookies] = useState(() => {
    if (cookieShownThisSession) return false;
    cookieShownThisSession = true;
    return true;
  });

  const [showAiChat, setShowAiChat] = useState(false);

  // ⭐ Scroll to top vid sidbyte — FIX som stoppar remount på FAQ
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <AuthProvider>
      <BookingProvider>

        <OverlayProvider
          value={{
            openMembership: () => setShowMembership(true),
            openLogin: () => setShowLogin(true),
            openAiChat: () => setShowAiChat(true),
          }}
        >

          {/* Membership */}
          {showMembership && (
            <MembershipOverlay onClose={() => setShowMembership(false)} />
          )}

          {/* Login */}
          {showLogin && (
            <LoginOverlay
              onClose={() => setShowLogin(false)}
              openMembership={() => {
                setShowLogin(false);
                setShowMembership(true);
              }}
            />
          )}

          {/* AI Chat Overlay */}
          {showAiChat && (
            <AiChatOverlay onClose={() => setShowAiChat(false)} />
          )}

          {/* ⭐ CookiePopup visas bara om showCookies = true */}
          {showCookies && (
            <CookiePopup
              onAccept={() => setShowCookies(false)}
              onDecline={() => setShowCookies(false)}
            />
          )}

          {/* Layout */}
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
