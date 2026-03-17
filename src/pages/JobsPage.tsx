import { useEffect, useState } from "react";
import JobCard from "../parts/JobCard";
import fetchJson from "../utils/fetchJson";
export default function JobsPage() {

  type Job = {
    Id: number;
    Slug: string;
    Title: string;
    Location: string;
    Description: string;
    CreatedAt: string;
  };
  const [Jobs, setJobs] = useState<Job[] | null>(null);


  useEffect(() => {
    const getJobs = async () => {
      try {
        const result = await fetchJson(`/api/JobPosting`);
        setJobs(result);
      }
      catch (error) {
        console.error("Kunde inte hämta några jobb:", error);
      }
    };
    getJobs();
  }, []);


  


  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 text-accent">
      <h1 className="text-4xl font-bold mb-10">Lediga jobb</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {!Jobs ? (
          <div className="text-white p-10">Laddar...</div>
        ) : (
          Jobs.map(job => (
            <JobCard
              key={job.Id}
              title={job.Title}
              location={job.Location}
              description={job.Description}
              link={`/lediga-jobb/${job.Id}`}
              buttonLabel="Läs mer & ansök"
            />
          ))
        )}

      </div>
    </div>
  );
}

JobsPage.route = {
  path: "/lediga-jobb",
  menuLabel: null
};
