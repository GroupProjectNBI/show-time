type JobCardProps = {
  title: string;
  location?: string;
  description: string;
  link?: string;
};

export default function JobCard({ title, location, description, link }: JobCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:bg-white/10 transition">
      <h3 className="text-2xl font-semibold text-accent mb-2">{title}</h3>

      {location && (
        <p className="text-accent/70 text-sm mb-3">{location}</p>
      )}

      <p className="text-accent/80 mb-4 leading-relaxed">
        {description}
      </p>

      {link && (
        <a
          href={link}
          className="inline-block px-5 py-2 rounded-xl bg-accent text-primary font-semibold hover:bg-accent/90 transition"
        >
          Läs mer & ansök
        </a>
      )}
    </div>
  );
}
