import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import routes from "../routes";
import { useAuth } from "../context/AuthContext";

type HeaderProps = {
  openMembership: () => void;
  openLogin: () => void;
};


export default function Header({ openMembership, openLogin }: HeaderProps) {
  const [expanded, setExpanded] = useState(false);
  const { logout, login, user } = useAuth();
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
                <nav className="hidden md:flex items-center gap-3" aria-label="Huvudmeny">
                  {menuRoutes.map(({ menuLabel, path }, i) => {
                    const active = isActive(path);

                    return (
                      <Link
                        key={i}
                        to={path}
                        aria-current={active ? "page" : undefined}
                        className={[
                          // hover with a ''pill'' look
                          "rounded-full px-4 py-1.5 text-base font-semibold transition duration-200",
                          "hover:bg-white/5",

                          // colors: active full accent, others dim
                          active ? "text-accent" : "text-accent/60 hover:text-accent/90",

                          // active indicator: ONLY shadow under (no bg, no pill highlight)
                          active ? "bg-transparent shadow-none drop-shadow-[0_12px_16px_rgba(0,0,0,0.55)]" : "",
                        ].join(" ")}
                        onClick={() => setExpanded(false)}
                      >
                        {menuLabel}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* RIGHT: login pinned right */}
              {
                user ? <div className="ml-auto hidden md:block">
                  <Link to="#" onClick={() => logout()} className="shrink-0"><p> <img src={user.avatar} className="w-10 h-10" alt="" /> Logout: {user.userName}</p></Link>

                </div> : <div className="ml-auto hidden md:block">
                  <button onClick={openLogin} className="rounded-full border-accent/80 px-5 py-1.5 text-base font-semibold text-accent/70 transition duration-200 hover:bg-accent hover:text-primary" >
                    Logga in
                  </button>
                  <button
                    onClick={openMembership}
                    className="rounded-full border-accent/80 px-5 py-1.5 text-base font-semibold text-accent/70 transition duration-200 hover:bg-accent hover:text-primary ml-4"
                  >
                    Bli medlem
                  </button>

                </div>

              }


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
              <nav className="space-y-1 p-3" aria-label="Huvudmeny mobil">
                {menuRoutes.map(({ menuLabel, path }, i) => {
                  const active = isActive(path);

                  return (
                    <Link
                      key={i}
                      to={path}
                      onClick={closeMenu}
                      className={[
                        "block w-full rounded-xl px-4 py-3 text-base font-semibold transition",

                        // hover can have a soft background
                        "hover:bg-white/10",

                        // dim others, keep active full accent
                        active ? "text-accent" : "text-accent/70 hover:text-accent",

                        // active: shadow under
                        active ? "bg-transparent shadow-none drop-shadow-[0_12px_16px_rgba(0,0,0,0.55)]" : "",
                      ].join(" ")}
                    >
                      {menuLabel}
                    </Link>
                  );
                })}


                {!user ? (
                  <>
                    <button
                      onClick={() => { openLogin(); closeMenu(); }}
                      className="block w-full rounded-xl px-4 py-3 text-base font-semibold text-accent/70 transition hover:bg-white/10"
                    >
                      Logga in
                    </button>

                    <button
                      onClick={() => { openMembership(); closeMenu(); }}
                      className="block w-full rounded-xl px-4 py-3 text-base font-semibold text-accent/70 transition hover:bg-white/10"
                    >
                      Bli medlem
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => { logout(); closeMenu(); }}
                    className="block w-full rounded-xl px-4 py-3 text-base font-semibold text-accent/70 transition hover:bg-white/10"
                  >
                    Logout: {user.userName}
                  </button>
                )}


              </nav>
            </div>
          </div>
        </div>
      </div >
    </header >
  );
}
