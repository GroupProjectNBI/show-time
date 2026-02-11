import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-footerBg text-goldText py-12">

      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-12">

        {/* Hitta till oss */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Hitta till oss</h3>

          <p className="mb-6">
            Adress:<br />
            Propellergatan 1<br />
            211 15 Malmö
          </p>

          <p>
            <span className="font-semibold">Öppettider:</span><br />
            Mån - Fre 17:30 - 22:00<br />
            Lör - Sön 13:30 - 21:15
          </p>
        </div>

        {/* Övrigt */}
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Övrigt</h3>

          <div className="flex flex-col space-y-2">
            <Link to="/om-oss" className="hover:text-white transition">
              Om oss
            </Link>
            <Link to="/kontakt" className="hover:text-white transition">
              Kontakta oss - formulär
            </Link>
            <Link to="/jobba" className="hover:text-white transition">
              Jobba hos oss
            </Link>
            <Link to="/faq" className="hover:text-white transition">
              FAQ
            </Link>
            <Link to="/bli-medlem" className="hover:text-white transition">
              Bli medlem
            </Link>
          </div>

          {/* Sociala medier */}
          <div className="falx mt-6 gap-6 text-2xl">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-all duration-300">

              <FaFacebookF />
            </a>

            <a href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-all duration-300">

              <FaTwitter />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:scale-110 transition-all duration-300">

              <FaInstagram />
            </a>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center mt-12 text-sm opacity-80">
        © Copyright
      </div>

    </footer>
  );
}
