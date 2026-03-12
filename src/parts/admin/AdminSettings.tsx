import { useState } from "react";

export default function AdminSettings() {
  const [settings] = useState({
    cinemaName: "Bio Edvin",
    theme: "Dark",
    defaultLanguage: "sv-SE",
    timezone: "Europe/Stockholm",
  });

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Inställningar
      </h2>

      <ul className="flex flex-col gap-3">
        <li className="bg-[#1a1a1a] p-3 rounded text-white">
          <p className="font-semibold">Biografnamn</p>
          <p className="text-gray-400">{settings.cinemaName}</p>
        </li>

        <li className="bg-[#1a1a1a] p-3 rounded text-white">
          <p className="font-semibold">Tema</p>
          <p className="text-gray-400">{settings.theme}</p>
        </li>

        <li className="bg-[#1a1a1a] p-3 rounded text-white">
          <p className="font-semibold">Språk</p>
          <p className="text-gray-400">{settings.defaultLanguage}</p>
        </li>

        <li className="bg-[#1a1a1a] p-3 rounded text-white">
          <p className="font-semibold">Tidszon</p>
          <p className="text-gray-400">{settings.timezone}</p>
        </li>
      </ul>

      <button className="mt-6 bg-primary text-black px-4 py-2 rounded font-semibold">
        Redigera inställningar
      </button>
    </section>
  );
}
