import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import AdminJobOverlay from "./AdminJobOverlay";

export default function AdminJobs() {
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [creating, setCreating] = useState(false);

  const loadJobs = async () => {
    const result = await fetchJson("/api/JobPosting");
    setJobs(result);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const deleteJob = async (id: number) => {
    if (!confirm("Är du säker på att du vill ta bort annonsen?")) return;

    await fetchJson(`/api/JobPosting/${id}`, { method: "DELETE" });
    loadJobs();
  };

  if (!jobs) return <div className="text-white">Laddar...</div>;

  return (
    <div className="bg-white/5 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Jobbannonser</h2>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 bg-accent text-primary rounded-lg"
        >
          + Ny annons
        </button>
      </div>

      <div className="space-y-4">
        {jobs.map(job => (
          <div
            key={job.Id}
            className="flex justify-between items-center bg-white/10 p-4 rounded-lg"
          >
            <div>
              <h3 className="text-xl text-white">{job.Title}</h3>
              <p className="text-white/50">{job.Location}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setEditingJob(job)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg"
              >
                Redigera
              </button>
              <button
                onClick={() => deleteJob(job.Id)}
                className="px-3 py-1 bg-red-500 text-white rounded-lg"
              >
                Ta bort
              </button>
            </div>
          </div>
        ))}
      </div>

      {creating && (
        <AdminJobOverlay
          onClose={() => setCreating(false)}
          onSaved={loadJobs}
        />
      )}

      {editingJob && (
        <AdminJobOverlay
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSaved={loadJobs}
        />
      )}
    </div>
  );
}
