export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-white mb-8">
        Adminpanel
      </h1>

      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Här lägger du admin-moduler */}
      </div>
    </div>
  );
}

AdminPage.route = { path: "/admin" };
