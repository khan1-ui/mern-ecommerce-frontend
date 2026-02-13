import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/dashboard/orders");
    }, 3000);
  }, []);

  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
      <p>Redirecting...</p>
    </div>
  );
}
