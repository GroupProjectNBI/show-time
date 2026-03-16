import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../routes";
import { useAuth } from "../context/AuthContext";
import { useOverlay } from "../context/OverlayContext";


// Header 
type HeaderProps = {
  openMembership: () => void;
  openLogin: () => void;
};


export default function Header({ openMembership, openLogin }: HeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const { logout, user } = useAuth();
  const { openAiChat } = useOverlay(); 
  const pathName = useLocation().pathname;

  // 1. HITTA AKTIV RUTT (För att veta vilken länk som ska lysa i guld)
  const currentRoute = routes
    .filter((x) => x.path)
    .sort((a, b) => b.path.length - a.path.length)
    .find((x) => pathName.startsWith(x.path.split(":")[0]));

  const isActive = (path: string) =>
    path === currentRoute?.path || path === currentRoute?.parent;

  const closeMenu = () => setTimeout(() => setExpanded(false), 150);

  // 2. FIGMA-ORDNING & STÄDNING (Tar bort Products + sorterar rätt) Skapat Figma "karta"
  const figmaOrder: Record<string, number> = {
    "Gå på bio": 1,
    "Inför besöket": 2,
    "Bli medlem": 3,
  };
  //// FILTRERING (tar bort Products) OCH SORTERING (enligt figmaOrder) av rutter som ska visas i menyn
  //Tidigare tog koden alla rutter som hade en menuLabel. 
  // Genom att lägga till && x.menuLabel !== "Products" säger vi till koden: 
  // "Hämta alla länkar som ska ligga i menyn, UTOM den som heter Products". 
  // På så sätt slipper vi radera filer eller ändra i databasen – vi bara döljer den från användaren.
  const menuRoutes = routes
    .filter((x) => x.menuLabel && x.menuLabel !== "Products" &&
      x.menuLabel !== "Confirmation")
    .sort((a, b) => (figmaOrder[a.menuLabel!] || 99) - (figmaOrder[b.menuLabel!] || 99));
  return (
    <header>
      <div className="fixed inset-x-0 top-0 z-50">
        {/* keep a wrapper so the mobile dropdown lines up with the pill */}
        <div className="mx-auto mt-4 w-[min(1200px,calc(100%-32px))]">
          {/* TOP PILL */}
          <div className="rounded-full bg-primary shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
            <div className="flex h-16 items-center px-6">
              {/* LEFT: logo + nav close together, */}
              <div className="flex items-center gap-6">

                <Link to="/" onClick={() => setExpanded(false)} className="shrink-0">
                  <img
                    src="/images/logos/show-time.png"
                    alt="Show-Time"
                    className="h-48 w-auto mt-2 transition-transform duration-300 hover:scale-105"
                    draggable={false}
                  />
                </Link>

                {/* DESKTOP NAV */}
                <nav className="hidden md:flex items-center gap-4" aria-label="Huvudmeny">
                  {menuRoutes.map(({ menuLabel, path }, i) => {
                    const active = isActive(path);

                    return (
                      <Link
                        key={i}
                        to={path}
                        aria-current={active ? "page" : undefined}
                        className={[
                          // FONT & SPACING
"rounded-full px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.15em] transition-all duration-300",
          active 
            ? "text-accent drop-shadow-[0_0_8px_rgba(192,160,96,0.4)]" 
            : "text-accent/70 hover:text-white hover:bg-white/5"// Inaktiv är ljusare guld som blir vit vid hover
                        ].join(" ")}
                        onClick={() => setExpanded(false)}
                      >
                        {menuLabel}
                      </Link>
                    );
                  })}

                  {/* --- NY PLACERING: Bli medlem / Min sida --- */}
                  {!user && (
                    <button
                      onClick={openMembership}
className="rounded-full px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.15em] text-accent/70 hover:text-white hover:bg-white/5 transition-all duration-300"                    >
                      Bli medlem
                    </button>
                  )}

                  {user && (
                    <Link
                      to="/min-sida"
className="rounded-full px-4 py-1.5 text-[13px] font-bold uppercase tracking-[0.15em] text-accent/70 hover:text-white hover:bg-white/5 transition-all duration-300"                    >
                      Min sida
                    </Link>
                  )}
                </nav>

              </div>

              {/* RIGHT: login/logout only */}
<div className="ml-auto hidden md:flex items-center gap-6">
                {/* INLOGGAD */}
                {user && (
                  <>
                    <button
                      onClick={logout}
className="rounded-full border border-accent/30 px-6 py-1.5 text-[12px] font-bold uppercase tracking-[0.1em] text-accent/80 transition-all duration-300 hover:bg-accent hover:text-primary hover:border-accent"                    >
                      Logga ut
                    </button>

                    <img
                      src={user.avatar}
className="w-10 h-10 rounded-full border-2 border-accent/20 shadow-[0_0_15px_rgba(192,160,96,0.2)] object-cover"                      alt="avatar"
                    />
                  </>
                )}

                {/* UTLOGGAD */}
                {!user && (
                  <button
                    onClick={openLogin}
className="rounded-full border border-accent/50 px-8 py-2 text-[12px] font-black uppercase tracking-[0.2em] text-accent transition-all duration-300 hover:bg-accent hover:text-primary shadow-[0_0_20px_rgba(192,160,96,0.1)] active:scale-95"                  >
                    Logga in
                  </button>
                )}

              </div>




              {/* MOBILE TOGGLE pinned right */}
              <button
                className="ml-auto md:hidden inline-flex items-center justify-center rounded-full p-2 text-accent hover:bg-white/10"
                onClick={() => setExpanded((v) => !v)}
                aria-controls="mobile-nav"
                aria-expanded={expanded}
              >
                <span className="sr-only">Öppna meny</span>
                <div className="space-y-1.5">
                  <span className="block h-0.5 w-6 bg-accent" />
                  <span className="block h-0.5 w-6 bg-accent" />
                  <span className="block h-0.5 w-6 bg-accent" />
                </div>
              </button>
            </div>
          </div>

          {/* MOBILE MENU: separate dropdown panel */}
          <div id="mobile-nav" className={expanded ? "block md:hidden" : "hidden"}>
            <div className="mt-3 rounded-2xl bg-primary shadow-[0_18px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
              <nav className="space-y-1 p-3 text-center" aria-label="Huvudmeny mobil">

                {/* MENY-LÄNKAR (centrerade) */}
                {menuRoutes.map(({ menuLabel, path }, i) => {
                  const active = isActive(path);

                  return (
                    <Link
                      key={i}
                      to={path}
                      onClick={closeMenu}
                      className={[
"block w-full rounded-xl px-4 py-3 text-[13px] font-bold uppercase tracking-[0.2em] transition-all",                        "hover:bg-white/10",
                        active ? "text-accentbg-white/5" : "text-accent/70 hover:text-white",
                        active ? "bg-transparent shadow-none drop-shadow-[0_12px_16px_rgba(0,0,0,0.55)]" : "",
                        "text-center"
                      ].join(" ")}
                    >
                      {menuLabel}
                    </Link>
                  );
                })}

                {/* --- INTE INLOGGAD --- */}
                {!user && (
                  <>
                    <button
                      onClick={() => { openMembership(); closeMenu(); }}
                      className="block w-full text-center rounded-xl px-4 py-3 text-[13px] font-bold uppercase tracking-[0.2em] text-accent/70 hover:text-white transition"
                    >
                      Bli medlem
                    </button>

                    <button
                      onClick={() => { openLogin(); closeMenu(); }}
                      className="mt-2 block w-full text-center rounded-xl bg-accent py-3 text-[13px] font-black uppercase tracking-[0.2em] text-primary transition active:scale-95"
          
                    >
                      Logga in
                    </button>
                  </>
                )}

                {/* --- INLOGGAD --- */}
                {user && (
                  <>
                    <Link
                      to="/min-sida"
                      onClick={closeMenu}
className="block w-full text-center rounded-xl px-4 py-3 text-[13px] font-bold uppercase tracking-[0.2em] text-accent/70 hover:text-white transition"                    >
                      Min sida
                    </Link>

                    <button
                      onClick={() => { logout(); closeMenu(); }}
className="mt-2 block w-full text-center rounded-xl border border-accent/30 py-3 text-[13px] font-bold uppercase tracking-[0.2em] text-accent/70 transition"                    >
                      Logga ut
                    </button>
                  </>
                )}
                {/* --- NYTT: AI CHAT LÄNGST NER I MOBILMENYN --- */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <button
                    onClick={() => { openAiChat(); closeMenu(); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-4 text-[13px] font-black uppercase tracking-[0.2em] text-[#c0a060] bg-white/5 hover:bg-white/10 transition"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c0a060] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c0a060]"></span>
                    </span>
                    Chatta med oss
                  </button>
                </div>

              </nav>
            </div>
          </div>

        </div>
      </div >
      {/* --- NYTT: FLYTANDE CHATT-IKON --- */}
      <button
        onClick={openAiChat}
        className="fixed bottom-8 right-8 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95 group"
        aria-label="Öppna AI Chat"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white border-2 border-accent"></span>
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
        </svg>
      </button>
    </header >
  );
}
