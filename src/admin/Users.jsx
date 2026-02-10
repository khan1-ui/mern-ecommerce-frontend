import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Manage Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-100">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">
                  Name
                </th>
                <th className="border p-2 text-left">
                  Email
                </th>
                <th className="border p-2 text-left">
                  Role
                </th>
                <th className="border p-2 text-left">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50"
                >
                  <td className="border p-2">
                    {user.name}
                  </td>

                  <td className="border p-2">
                    {user.email}
                  </td>

                  <td className="border p-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        user.role === "admin"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="border p-2">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
