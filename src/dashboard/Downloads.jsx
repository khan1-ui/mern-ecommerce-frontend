import { useEffect, useState } from "react";
import api from "../services/api";

const Downloads = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchDownloads = async () => {
      const { data } = await api.get("/orders/my-digital-products");
      setProducts(data);
    };
    fetchDownloads();
  }, []);

  const downloadFile = (id) => {
    window.location.href =
      `http://localhost:5000/api/download/${id}`;
  };

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">My Downloads</h2>

      {products.map((p) => (
        <div key={p._id} className="border p-3 mb-3">
          <p>{p.title}</p>
          <button
            className="bg-black text-white px-3 py-1 mt-2"
            onClick={() => downloadFile(p._id)}
          >
            Download
          </button>
        </div>
      ))}
    </div>
  );
};

export default Downloads;
