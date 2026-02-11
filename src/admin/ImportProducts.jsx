import axios from "axios";
import { useState } from "react";

export default function ImportProducts() {
  const [file, setFile] = useState(null);

  const handleImport = async () => {
    if (!file) return alert("Select a JSON file first!");

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/import-products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Products Imported Successfully!");
    } catch (error) {
      alert("❌ Import Failed");
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Import Products</h2>
      <input
        type="file"
        accept=".json"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <br /><br />
      <button onClick={handleImport}>
        Import Products
      </button>
    </div>
  );
}
