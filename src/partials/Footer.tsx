type FooterProps = {
  openMembership: () => void;
};



import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useEffect } from 'react';
import { useAuth } from "../context/AuthContext";


export default function Footer({ openMembership }: FooterProps) {
  const { hash } = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  return (
    // 1. Rounded container med bakgrund och padding
    // 2. Flexbox med tre kolumner: Hitta till oss, Övrigt, Logotyp + Sociala medier
    // 3. Divider och copyright längst ner
    <footer className="mt-20 pb-10">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))] bg-[#1a1a1a] text-accent py-12 border-t border-white/5 rounded-2xl">
        {/* Huvudcontainer: justify-start och gap drar ihop kolumnerna till vänster */}
        <div className="px-10 flex flex-col md:flex-row justify-start gap-12 md:gap-24 items-start">
          {/* 1: Hitta till oss */}
          <div className="flex-none">
            <h3 className="text-xl font-semibold mb-4 text-[#c6a96a]">Hitta till oss</h3>

            <p className="mb-6 leading-relaxed opacity-90">
              Adress:<br />
              Propellergatan 1<br />
              211 15 Malmö
            </p>

            <p className="leading-relaxed opacity-90">
              <span className="font-semibold">Öppettider:</span><br />
              Mån - Fre 17:30 - 21:15<br />
              Lör - Sön 13:30 - 21:15
            </p>
          </div>


          {/* 2. Övrigt - Minskad bredd */}
          <div className="flex-none">
            <h3 className="text-xl font-semibold mb-4 text-[#c6a96a]">Övrigt</h3>

            <div className="flex flex-col gap-2 leading-relaxed opacity-90">
              <p><Link to="/om-oss" className="hover:text-white transition">Om oss</Link></p>
              <p><Link to="/faq#kontakt" className="hover:text-white transition">Kontakta oss - formulär</Link></p>
              <p><Link to="/jobba-hos-oss" className="hover:text-white transition">Jobba hos oss</Link></p>
              <p><Link to="/faq" className="hover:text-white transition">FAQ</Link></p>
              {!user && <p >
                <button
                  onClick={openMembership}
                  className="hover:text-white transition cursor-pointer"
                >
                  Bli medlem
                </button>
              </p>}

            </div>
          </div>

          {/* 3. Logotyp + Sociala medier */}
          <div className="md:ml-auto flex flex-col items-center md:items-end">
            <img
              src="/images/logos/show-time-circle.png"
              alt="Footer Logo"
              className="h-[220px] object-contain"
            />

            <div className="flex gap-6 text-2xl mt-4 self-center md:self-center">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-all duration-300">
                <FaFacebookF />
              </a>

              <a href="https://x.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-all duration-300">
                <FaXTwitter />
              </a>

              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="hover:text-white hover:scale-110 transition-all duration-300">
                <FaInstagram />
              </a>
            </div>
          </div>


        </div>


        {/* Divider */}
        <div className="border-t border-accent/20 mt-10 pt-6 text-center text-sm opacity-80">
          © Copyright
        </div>
      </div>
    </footer >

  );
}
