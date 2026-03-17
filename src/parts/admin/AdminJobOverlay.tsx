import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

type AdminJobOverlayProps = {
  job?: any;                // <-- optional
  onClose: () => void;
  onSaved: () => void;
};

export default function AdminJobOverlay({ job, onClose, onSaved }: AdminJobOverlayProps) {
  const [form, setForm] = useState({
    Title: job?.Title ?? "",
    Slug: job?.Slug ?? "",
    Location: job?.Location ?? "",
    Description: job?.Description ?? ""
  });

  const handleSave = async () => {
    const method = job ? "PUT" : "POST";
    const url = job ? `/api/JobPosting/${job.Id}` : "/api/JobPosting";

    await fetchJson(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div className="bg-[#1a1a1a] p-8 rounded-xl w-full max-w-lg text-white space-y-4">

        <h2 className="text-2xl font-bold">
          {job ? "Redigera jobbannons" : "Ny jobbannons"}
        </h2>

        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="Titel"
          value={form.Title}
          onChange={e => setForm({ ...form, Title: e.target.value })}
        />

        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="Slug"
          value={form.Slug}
          onChange={e => setForm({ ...form, Slug: e.target.value })}
        />

        <input
          className="w-full p-3 rounded bg-white/10"
          placeholder="Plats"
          value={form.Location}
          onChange={e => setForm({ ...form, Location: e.target.value })}
        />

        <textarea
          className="w-full p-3 rounded bg-white/10 h-32"
          placeholder="Beskrivning"
          value={form.Description}
          onChange={e => setForm({ ...form, Description: e.target.value })}
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-white/20 rounded-lg">
            Avbryt
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-accent text-primary rounded-lg">
            Spara
          </button>
        </div>

      </div>
    </div>
  );
}
