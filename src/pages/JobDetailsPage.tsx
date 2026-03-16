import { useParams } from "react-router-dom";
import { useState } from "react";

export default function JobDetailsPage() {
  const { jobId } = useParams();

  // Här kan du senare hämta från backend
  const jobs: Record<string, { title: string; location: string; description: string; }> = {
    biografvard: {
      title: "Biografvärd",
      location: "Malmö",
      description: "Som biografvärd är du ansiktet utåt..."
    },
    kioskpersonal: {
      title: "Kioskpersonal",
      location: "Malmö",
      description: "Arbeta i vårt team och servera snacks..."
    },
    maskinist: {
      title: "Maskinist / Tekniker",
      location: "Malmö",
      description: "Ansvarar för tekniken i salongerna..."
    }
  };


  const job = jobs[jobId!];

  if (!job) {
    return <div className="text-white p-10">Jobbannonsen kunde inte hittas.</div>;
  }

  // FORM STATE
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pitch: ""
  });

  const [cv, setCv] = useState<File | null>(null);
  const [letter, setLetter] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    console.log("Ansökan skickad:", {
      ...form,
      cv,
      letter
    });

    alert("Din ansökan har skickats!");
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 text-accent">
      <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
      <p className="text-accent/70 mb-6">{job.location}</p>

      <p className="text-accent/80 mb-10 leading-relaxed">
        {job.description}
      </p>

      <h2 className="text-2xl font-semibold mb-4">Ansök till tjänsten</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            placeholder="Förnamn"
            required
            className="p-3 rounded-xl bg-white/10 text-white"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          />

          <input
            type="text"
            placeholder="Efternamn"
            required
            className="p-3 rounded-xl bg-white/10 text-white"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          required
          className="p-3 rounded-xl bg-white/10 text-white w-full"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <div>
          <label className="text-accent/70 block mb-1">CV (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            required
            className="text-white"
            onChange={(e) => setCv(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label className="text-accent/70 block mb-1">Personligt brev (PDF)</label>
          <input
            type="file"
            accept=".pdf"
            required
            className="text-white"
            onChange={(e) => setLetter(e.target.files?.[0] || null)}
          />
        </div>

        <textarea
          placeholder="Pitcha dig själv (max 240 tecken)"
          maxLength={240}
          required
          className="p-3 rounded-xl bg-white/10 text-white w-full h-32"
          value={form.pitch}
          onChange={(e) => setForm({ ...form, pitch: e.target.value })}
        />

        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition"
        >
          Skicka ansökan
        </button>
      </form>
    </div>
  );
}

JobDetailsPage.route = {
  path: "/lediga-jobb/:jobId",
  menuLabel: null
};
