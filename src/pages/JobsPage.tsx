import JobCard from "../parts/JobCard";

export default function JobsPage() {
  // Här kan du senare byta ut mot API-data
  const jobs = [
    {
      title: "Biografvärd",
      location: "Malmö",
      description:
        "Som biografvärd är du ansiktet utåt och skapar en välkomnande upplevelse för våra gäster.",
      link: "/jobba-hos-oss", // eller en riktig ansökningssida
      buttonLabel: "Läs mer & ansök"
    },
    {
      title: "Kioskpersonal",
      location: "Malmö",
      description:
        "Arbeta i vårt team och servera popcorn, snacks och dryck med ett leende.",
      link: "/jobba-hos-oss",
      buttonLabel: "Läs mer & ansök"
    },
    {
      title: "Maskinist / Tekniker",
      location: "Malmö",
      description:
        "Ansvarar för tekniken i salongerna och säkerställer att varje visning håller högsta kvalitet.",
      link: "/jobba-hos-oss",
      buttonLabel: "Läs mer & ansök"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 text-accent">
      <h1 className="text-4xl font-bold mb-10 text-accent">Lediga jobb</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {jobs.map((job, i) => (
          <JobCard key={i} {...job} />
        ))}
      </div>
    </div>
  );
}

JobsPage.route = {
  path: "/lediga-jobb",
  menuLabel: null // ska inte synas i headern
};
