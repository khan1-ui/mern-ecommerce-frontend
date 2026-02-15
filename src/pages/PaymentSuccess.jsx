import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    showToast("Payment Successful 🎉", "success");

    const timer = setTimeout(() => {
      navigate("/dashboard/orders");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-xl text-center space-y-4">
        <h2 className="text-3xl font-bold text-green-600">
          Payment Successful 🎉
        </h2>
        <p className="text-gray-500">
          Redirecting to your orders...
        </p>
      </div>
    </div>
  );
}
