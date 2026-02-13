import { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function StoreImport() {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [importCount, setImportCount] = useState(null);

  // 🔒 Frontend Guard
  if (user?.role !== "storeOwner") {
    return (
      <div className="p-6 text-center text-red-500">
        Access denied
      </div>
    );
  }

  const handleImport = async () => {
    if (!file) {
      showToast("Select a JSON file first", "error");
      return;
    }

    if (!file.name.endsWith(".json")) {
      showToast("Only JSON files are allowed", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const { data } = await api.post(
        "/api/store-owner/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImportCount(data.count);

      showToast(
        `Imported ${data.count} products successfully ✅`,
        "success"
      );

      setFile(null);

    } catch (err) {
      showToast(
        err?.response?.data?.message || "Import failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Import Products (JSON)
      </h2>

      {/* FILE INPUT */}
      <div className="border-2 border-dashed p-6 rounded text-center mb-4">
        <input
          type="file"
          accept=".json"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full"
        />

        {file && (
          <p className="mt-2 text-sm text-gray-500">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleImport}
        disabled={loading}
        className="w-full py-2 text-white rounded disabled:opacity-50"
        style={{ backgroundColor: "var(--store-color)" }}
      >
        {loading ? "Importing..." : "Import JSON"}
      </button>

      {/* RESULT */}
      {importCount !== null && (
        <div className="mt-4 text-center text-green-600 font-medium">
          Successfully imported {importCount} products 🎉
        </div>
      )}
    </div>
  );
}
