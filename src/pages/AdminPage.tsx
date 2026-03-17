import AdminDashboard from "../parts/admin/AdminDashboard";
import AdminMovies from "../parts/admin/AdminMovies";
import AdminBookings from "../parts/admin/AdminBookings";
import AdminScreenings from "../parts/admin/AdminScreenings";
import AdminTheaters from "../parts/admin/AdminTheaters";
import AdminUsers from "../parts/admin/AdminUsers";
import AdminSettings from "../parts/admin/AdminSettings";
import AdminStaff from "../parts/admin/AdminStaff";
import AdminSnackMenu from "../parts/admin/AdminSnackMenu";
import AdminJobs from "../parts/admin/AdminJobs";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const { user, loading } = useAuth();

  // Vänta tills AuthContext laddat klart
  if (loading) {
    return null; // eller en spinner om du vill
  }

  // Inte inloggad → skicka till login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Inloggad men inte admin → skicka till startsidan
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin → visa adminpanelen
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">
        Adminpanel
      </h1>

      <div className="w-full max-w-4xl flex flex-col gap-10">
        <AdminDashboard />
        <AdminMovies />
        <AdminBookings />
        <AdminScreenings />
        <AdminTheaters />
        <AdminJobs />
        <AdminUsers />
        <AdminSettings />
        <AdminStaff />
        <AdminSnackMenu />
      </div>
    </div>
  );
}

AdminPage.route = { path: "/admin" };
