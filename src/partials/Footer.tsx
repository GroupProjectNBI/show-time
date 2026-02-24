type FooterProps = {
  openMembership: () => void;
};



import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { useEffect } from 'react';

export default function Footer({ openMembership }: FooterProps) {
  const { hash } = useLocation();


  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);
  return (
   // 1. Vi tar bort mx-4 och rounded för att låta bakgrunden gå hela vägen ut (W-FULL)
<footer className="mt-20">
  <div className="mx-auto w-[min(1200px,calc(100%-32px))] bg-[#1a1a1a] text-accent py-12 border-t border-white/5 rounded-2xl">
    
    <div className="px-6 flex flex-col gap-12 md:flex-row md:justify-between md:items-start">
          <h3 className="text-xl font-semibold mb-1">Hitta till oss</h3>

          <p className="mb-6 leading-relaxed">
            Adress:<br />
            Propellergatan 1<br />
            211 15 Malmö
          </p>

          <p className="leading-relaxed">
            <span className="font-semibold">Öppettider:</span><br />
            Mån - Fre 17:30 - 21:15<br />
            Lör - Sön 13:30 - 21:15
          </p>
        </div>

        {/* Övrigt */}
        <div className="w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-1">Övrigt</h3>

          <div className="flex flex-col leading-relaxed">
            <p><Link to="/om-oss" className="hover:text-white transition">Om oss</Link></p>
            <p><Link to="/faq#kontakt" className="hover:text-white transition">Kontakta oss - formulär</Link></p>
            <p><Link to="/jobba-hos-oss" className="hover:text-white transition">Jobba hos oss</Link></p>
            <p><Link to="/faq" className="hover:text-white transition">FAQ</Link></p>
            <p>
              <button
                onClick={openMembership}
                className="hover:text-white transition cursor-pointer"
              >
                Bli medlem
              </button>
            </p>

          </div>
        </div>

        {/* Logotyp + Sociala medier */}
        <div className="w-full md:w-1/3 flex flex-col items-start md:items-start">
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

    </footer >

  );
}
