import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";
import { useToast } from "../../context/ToastContext";

export default function SuperAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/superadmin/users");
        setUsers(data);
      } catch (err) {
        showToast("Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [showToast]);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        All Platform Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white dark:bg-gray-800 rounded shadow text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Store</th>
                <th className="p-3 text-left">Joined</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="p-3">{u.name}</td>

                  <td className="p-3">{u.email}</td>

                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.role === "superadmin"
                          ? "bg-red-100 text-red-700"
                          : u.role === "storeOwner"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3">
                    {u.store ? u.store.name : "—"}
                  </td>

                  <td className="p-3">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
