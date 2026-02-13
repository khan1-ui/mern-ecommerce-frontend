import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function SuperAdminStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/superadmin/stores");
      setStores(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const toggleStoreStatus = async (storeId, currentStatus) => {
    try {
      await api.put(`/api/stores/${storeId}/status`, {
        isActive: !currentStatus,
      });

      fetchStores(); // refresh list
    } catch (err) {
      alert("Failed to update store status");
    }
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className="p-6 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Manage Stores
      </h1>

      {stores.length === 0 ? (
        <div className="text-gray-500">
          No stores available.
        </div>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">Store</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {stores.map((store) => (
                <tr
                  key={store._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-3">
                    <div className="font-semibold">
                      {store.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      /store/{store.slug}
                    </div>
                  </td>

                  <td className="p-3">
                    {store.owner?.name || "N/A"}
                    <div className="text-xs text-gray-500">
                      {store.owner?.email}
                    </div>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        store.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {store.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-3 flex gap-2 flex-wrap">
                    <Link
                      to={`/store/${store.slug}`}
                      target="_blank"
                      className="px-3 py-1 border rounded text-xs"
                    >
                      View
                    </Link>

                    <button
                      onClick={() =>
                        toggleStoreStatus(
                          store._id,
                          store.isActive
                        )
                      }
                      className={`px-3 py-1 text-xs rounded ${
                        store.isActive
                          ? "bg-red-600 text-white"
                          : "bg-green-600 text-white"
                      }`}
                    >
                      {store.isActive
                        ? "Suspend"
                        : "Activate"}
                    </button>
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
