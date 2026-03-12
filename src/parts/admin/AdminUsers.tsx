import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import UserModal from "./UserModal.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await fetchJson("/api/User");
      setUsers(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av användare:", err);
      setError("Kunde inte ladda användare.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openDelete = (user: User) => {
    setDeleteTarget(user);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Användare</h2>

      {loading && <p className="text-gray-400">Laddar användare...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && users.length === 0 && (
        <p className="text-gray-400">Inga användare hittades.</p>
      )}

      {!loading && !error && users.length > 0 && (
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">
                  {u.firstName} {u.lastName}
                </p>

                <p className="text-sm text-gray-400">{u.email}</p>
                <p className="text-sm text-gray-400">Roll: {u.role}</p>

                {u.createdAt && (
                  <p className="text-sm text-gray-500">
                    Medlem sedan:{" "}
                    {new Date(u.createdAt).toLocaleDateString("sv-SE")}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(u)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(u)}
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
        Lägg till användare
      </button>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadUsers}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/User/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadUsers();
          }}
        />
      )}
    </section>
  );
}
