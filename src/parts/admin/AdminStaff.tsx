import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import StaffModal from "./StaffModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadStaff = async () => {
    try {
      const res = await fetchJson("/api/Staff");
      setStaff(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av personal:", err);
      setError("Kunde inte ladda personal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const openCreate = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const openEdit = (member: StaffMember) => {
    setSelectedStaff(member);
    setIsModalOpen(true);
  };

  const openDelete = (member: StaffMember) => {
    setDeleteTarget(member);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Personal</h2>

      {loading && <p className="text-gray-400">Laddar personal...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && staff.length === 0 && (
        <p className="text-gray-400">Ingen personal hittades.</p>
      )}

      {!loading && !error && staff.length > 0 && (
        <ul className="flex flex-col gap-3">
          {staff.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">
                  {s.firstName} {s.lastName}
                </p>

                <p className="text-sm text-gray-400">{s.email}</p>
                <p className="text-sm text-gray-400">Roll: {s.role}</p>

                {s.createdAt && (
                  <p className="text-sm text-gray-500">
                    Anställd sedan:{" "}
                    {new Date(s.createdAt).toLocaleDateString("sv-SE")}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(s)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(s)}
                  className="text-red-400 hover:underline"
                >
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={openCreate}
        className="mt-6 bg-primary text-black px-4 py-2 rounded font-semibold"
      >
        Lägg till personal
      </button>

      {isModalOpen && (
        <StaffModal
          staff={selectedStaff}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadStaff}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/Staff/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadStaff();
          }}
        />
      )}
    </section>
  );
}
