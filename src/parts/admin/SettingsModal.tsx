import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function SettingsModal({ settings, onClose, onSaved }: any) {
  const [cinemaName, setCinemaName] = useState(settings.cinemaName);
  const [theme, setTheme] = useState(settings.theme);
  const [defaultLanguage, setDefaultLanguage] = useState(settings.defaultLanguage);
  const [timezone, setTimezone] = useState(settings.timezone);

  const handleSubmit = async () => {
    const payload = {
      cinemaName,
      theme,
      defaultLanguage,
      timezone,
    };

    await fetchJson("/api/Settings", {
      method: "PUT",
      body: JSON.stringify(payload),
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl text-white font-semibold mb-4">
          Redigera inställningar
        </h3>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Biografnamn"
            value={cinemaName}
            onChange={(e) => setCinemaName(e.target.value)}
          />

          <select
            className="p-2 rounded bg-[#333] text-white"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="Dark">Dark</option>
            <option value="Light">Light</option>
          </select>

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Språk"
            value={defaultLanguage}
            onChange={(e) => setDefaultLanguage(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Tidszon"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-gray-300 hover:underline"
          >
            Avbryt
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-black px-4 py-2 rounded font-semibold"
          >
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}
