import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState<any>(null);

  // Initialt läge för formuläret (för att lätt kunna rensa det)
  const initialForm = {
    firstName: "",
    lastName: "",
    email: "",
    pitch: ""
  };

  const [formData, setFormData] = useState(initialForm);
  const [cv, setCv] = useState<File | null>(null);
  const [letter, setLetter] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Hämta jobbannons
  useEffect(() => {
    const getJob = async () => {
      try {
        const getCurrentJob = await fetchJson(`/api/JobPosting/${jobId}`);
        setJob(getCurrentJob);
      } catch (error) {
        console.error("Kunde inte hämta jobbet:", error);
      }
    };
    getJob();
  }, [jobId]);

  // Hantera textändringar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Skicka ansökan
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job) return;

    // --- FIX: Spara referensen till formuläret direkt ---
    // Detta förhindrar att e.currentTarget blir null efter "await"
    const form = e.currentTarget;

    // --- SÄKERHETSKOLL FRONTEND ---
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    if (cv && (cv.type !== "application/pdf" || cv.size > MAX_FILE_SIZE)) {
      toast.error("CV måste vara en PDF och under 5MB.");
      return;
    }

    if (letter && (letter.type !== "application/pdf" || letter.size > MAX_FILE_SIZE)) {
      toast.error("Personligt brev måste vara en PDF och under 5MB.");
      return;
    }

    setLoading(true);

    const fd = new FormData();
    fd.append("jobId", job.Id);
    fd.append("jobTitle", job.Title);
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("email", formData.email);
    fd.append("pitch", formData.pitch);
    if (cv) fd.append("cv", cv);
    if (letter) fd.append("letter", letter);

    try {
      const response = await fetch("/api/job-application", {
        method: "POST",
        body: fd
      });

      if (response.ok) {
        toast.success("Din ansökan har skickats!");

        // --- RENSA ALLT ---
        setFormData(initialForm); // Rensar textfält
        setCv(null);              // Rensar state
        setLetter(null);          // Rensar state
        form.reset();             // Rensar de faktiska fil-inputsen i HTML
      } else {
        toast.error("Något gick fel i servern. Försök igen.");
      }
    } catch (err) {
      console.error("Nätverksfel:", err);
      toast.error("Kunde inte kontakta servern.");
    } finally {
      setLoading(false);
    }
  };

  if (!job) return <div className="text-white p-10">Laddar...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 text-accent">

      {/* TILLBAKA-KNAPP */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent/60 hover:text-accent mb-8 transition group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span>Tillbaka till lediga jobb</span>
      </button>

      <h1 className="text-4xl font-bold mb-4">{job.Title}</h1>
      <p className="text-accent/70 mb-6">{job.Location}</p>
      <p className="text-accent/80 mb-10 leading-relaxed whitespace-pre-line">
        {job.Description}
      </p>

      <hr className="border-white/10 mb-10" />

      <h2 className="text-2xl font-semibold mb-6">Ansök till tjänsten</h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Förnamn + Efternamn */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            type="text"
            placeholder="Förnamn"
            required
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent/40"
          />

          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            placeholder="Efternamn"
            required
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-accent/40"
          />
        </div>

        {/* Email */}
        <input
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Email"
          required
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white w-full outline-none focus:border-accent/40"
        />

        {/* CV & Personligt brev (Grid för snyggare layout på desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-accent/70 block mb-2 text-sm">CV (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setCv(e.target.files?.[0] || null)}
              className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent file:text-primary file:font-bold hover:file:bg-accent/80 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-accent/70 block mb-2 text-sm">Personligt brev (PDF)</label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={(e) => setLetter(e.target.files?.[0] || null)}
              className="text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent file:text-primary file:font-bold hover:file:bg-accent/80 cursor-pointer"
            />
          </div>
        </div>

        {/* Pitch */}
        <div className="space-y-2">
          <textarea
            name="pitch"
            value={formData.pitch}
            onChange={handleChange}
            placeholder="Pitcha dig själv (max 240 tecken)"
            maxLength={240}
            required
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white w-full h-32 outline-none focus:border-accent/40 resize-none"
          />
          <p className="text-right text-xs text-accent/40">
            {formData.pitch.length} / 240
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-10 py-4 rounded-xl bg-accent text-primary font-bold hover:bg-accent/90 transition disabled:opacity-50"
        >
          {loading ? "Skickar din ansökan..." : "Skicka ansökan"}
        </button>
      </form>
    </div>
  );
}

JobDetailsPage.route = {
  path: "/lediga-jobb/:jobId",
  menuLabel: null
};