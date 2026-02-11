import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-footerBg text-goldText py-10">
      <div className="container mx-autopx-4 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/*Hitta till oss*/}
        <div>
          <h3 className="text-lg font-bold mb-2">Hitta till oss</h3>
          <p>Adress:<br />Propellergatan 1<br />211 15 Malmö</p>
          <p className="mt-4">
            <strong>Öppettider:</strong><br />
            Mån - Fre 17:30 - 21:15<br />
            Lör - Sön 13.30 - 21:15
          </p>
        </div>
      </div>

      {/* Övrigt */}
      <div>
        <h3 className="text-lg font-bold mb-2">Övrigt</h3>
        <div className="flex flex-col gap-2">
          <Link to="/om-oss" className="hover:underline">Om oss</Link>
          <Link to="/kontakt" className="hover:underline">Kontakta oss</Link>
          <Link to="/jobba-hos-oss" className="hover:underline">Jobba hos oss</Link>
          <Link to="faq" className="hover:underline">FAQ</Link>
          <Link to="/bli-medlem" className="hover:underline">Bli medlem</Link>
        </div>

        {/* Sociala medier */}
        <div className="flex mt-4 gap-4 text-2x1">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="hhtps://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          </a>
        </div>
      </div>
      {/*Copyright */}
      <div className="mt-10 text-center text-sm">
        © Copyright
      </div>
    </footer>
  );

}