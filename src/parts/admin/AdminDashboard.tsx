import { useState, useEffect } from "react";

interface DashboardStats {
  totalBookings: number;
  totalMovies: number;
  totalScreenings: number;
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    totalMovies: 0,
    totalScreenings: 0,
    totalUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      // Här kan du senare ersätta med riktiga API-anrop:
      

      setStats({
        totalBookings: 128,
        totalMovies: 24,
        totalScreenings: 56,
        totalUsers: 312,
      });

      setLoading(false);
    };

    loadStats();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">Dashboard</h2>

      {loading && <p className="text-gray-400">Laddar statistik...</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DashboardCard label="Totala bokningar" value={stats.totalBookings} />
          <DashboardCard label="Filmer i systemet" value={stats.totalMovies} />
          <DashboardCard label="Planerade visningar" value={stats.totalScreenings} />
          <DashboardCard label="Registrerade användare" value={stats.totalUsers} />
        </div>
      )}
    </section>
  );
}

function DashboardCard({ label, value }: { label: string; value: number; }) {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded flex flex-col">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className="text-white text-2xl font-bold">{value}</span>
    </div>
  );
}
