import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-yellow-500 py-10">
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
    </footer>
  );

}