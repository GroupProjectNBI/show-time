import JobCard from "../parts/JobCard";

export default function JobsPage() {
  const jobs = [
    {
      id: "biografvard",
      title: "Biografvärd",
      location: "Malmö",
      description: "Som biografvärd är du ansiktet utåt...",
    },
    {
      id: "kioskpersonal",
      title: "Kioskpersonal",
      location: "Malmö",
      description: "Arbeta i vårt team och servera snacks...",
    },
    {
      id: "maskinist",
      title: "Maskinist / Tekniker",
      location: "Malmö",
      description: "Ansvarar för tekniken i salongerna...",
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 text-accent">
      <h1 className="text-4xl font-bold mb-10">Lediga jobb</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            title={job.title}
            location={job.location}
            description={job.description}
            link={`/lediga-jobb/${job.id}`}
            buttonLabel="Läs mer & ansök"
          />
        ))}
      </div>
    </div>
  );
}

JobsPage.route = {
  path: "/lediga-jobb",
  menuLabel: null
};
