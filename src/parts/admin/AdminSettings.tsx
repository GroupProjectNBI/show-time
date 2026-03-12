import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import SettingsModal from "./SettingsModal.tsx";

interface Settings {
  cinemaName: string;
  theme: string;
  defaultLanguage: string;
  timezone: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadSettings = async () =>: ;
  try {
    const res = await fetchJson("/api/Settings");
    setSettings(res || null);
  } catch (err) {
    console.error("Fel vid hämtning av inställningar:", err);
    setError("Kunde inte ladda inställningar.");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadSettings();
}, []);

return (
  <section className="bg-[#222] p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold text-white mb-4">
      Inställningar
    </h2>

    {loading && <p className="text-gray-400">Laddar inställningar...</p>}
    {error && <p className="text-red-400">{error}</p>}

    {settings && (
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
    )}

    <button
      onClick={() => setIsModalOpen(true)}
      className="mt-6 bg-primary text-black px-4 py-2 rounded font-semibold"
    >
      Redigera inställningar
    </button>

    {isModalOpen && settings && (
      <SettingsModal
        settings={settings}
        onClose={() => setIsModalOpen(false)}
        onSaved={loadSettings}
      />
    )}
  </section>
);
}
