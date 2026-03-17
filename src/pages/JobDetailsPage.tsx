import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";
import toast from "react-hot-toast";

export default function JobDetailsPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState<any>(null);

  // Form state (likt LoginOverlay)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    pitch: ""
  });

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
        console.error("Create user failed:", error);
        return false;
      }
    };

    // fetch(`/api/JobPosting/${jobId}`)
    //   .then(res => res.json())
    //   .then(setJob);
    getJob();
  }, [jobId]);

  // Gemensam change-handler (som i LoginOverlay)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Skicka ansökan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(job, "fffffffffffff");
    if (!job) return;

    setLoading(true);
    // await fetchJson("/api/job-application", {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ Slug: formData.email, title: formData.firstName, Location: formData.lastName, Description: formData.pitch })
    // });

    const fd = new FormData();
    fd.append("jobId", job.Id);
    fd.append("jobTitle", job.Title);
    fd.append("firstName", formData.firstName);
    fd.append("lastName", formData.lastName);
    fd.append("email", formData.email);
    fd.append("pitch", formData.pitch);
    if (cv) fd.append("cv", cv);
    if (letter) fd.append("letter", letter);

    await fetch("/api/job-application", {
      method: "POST",
      body: fd
    });

    toast.success("Din ansökan har skickats!");
    setLoading(false);
  };

  if (!job) return <div className="text-white p-10">Laddar...</div>;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-16 text-accent">
      <h1 className="text-4xl font-bold mb-4">{job.Title}</h1>
      <p className="text-accent/70 mb-6">{job.Location}</p>

      <p className="text-accent/80 mb-10 leading-relaxed">{job.Description}</p>


      <h2 className="text-2xl font-semibold mb-4">Ansök till tjänsten</h2>

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
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white"
          />

          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            type="text"
            placeholder="Efternamn"
            required
            className="p-3 rounded-xl bg-white/5 border border-white/10 text-white"
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
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white w-full"
        />

        {/* CV */}
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

        {/* Personligt brev */}
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

        {/* Pitch */}
        <textarea
          name="pitch"
          value={formData.pitch}
          onChange={handleChange}
          placeholder="Pitcha dig själv (max 240 tecken)"
          maxLength={240}
          required
          className="p-3 rounded-xl bg-white/5 border border-white/10 text-white w-full h-32"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition"
        >
          {loading ? "Skickar..." : "Skicka ansökan"}
        </button>
      </form>
    </div>
  );
}

JobDetailsPage.route = {
  path: "/lediga-jobb/:jobId",
  menuLabel: null
};

