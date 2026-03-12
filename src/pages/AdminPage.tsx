import AdminDashboard from "../parts/admin/AdminDashboard";
import AdminMovies from "../parts/admin/AdminMovies";
import AdminBookings from "../parts/admin/AdminBookings";
import AdminScreenings from "../parts/admin/AdminScreenings";
import AdminTheaters from "../parts/admin/AdminTheaters";
import AdminUsers from "../parts/admin/AdminUsers";
import AdminSettings from "../parts/admin/AdminSettings";
import AdminStaff from "../parts/admin/AdminStaff";
import AdminSnackMenu from "../parts/admin/AdminSnackMenu";



export default function AdminPage() {
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
        <AdminUsers />
        <AdminSettings />
        <AdminStaff />
        <AdminSnackMenu />
      </div>
    </div>
  );
}


AdminPage.route = { path: "/admin" };
