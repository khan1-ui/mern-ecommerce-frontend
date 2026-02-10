import logo from "../assets/logo.png";

const InvoicePreview = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded space-y-4 relative">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-sm"
        >
          ✕
        </button>

        {/* HEADER */}
        <div className="text-center space-y-2">
             <img
                    src={logo} 
                    alt="Company Logo"
                    className="h-12 mx-auto"
                />
          <h2 className="text-xl font-bold">INVOICE</h2>
          <p className="text-sm text-gray-500">
            Order ID: {order._id}
          </p>
          <p className="text-sm">
            Date: {new Date(order.createdAt).toDateString()}
          </p>
        </div>

        <hr />

        {/* CUSTOMER */}
        <div>
          <p className="font-medium">Bill To</p>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.phone}</p>
          <p>{order.shippingAddress.address}</p>
        </div>

        <hr />

        {/* ITEMS */}
        <div>
          <p className="font-medium mb-1">Items</p>
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>৳ {item.price}</span>
            </div>
          ))}
        </div>

        <hr />

        {/* TOTAL */}
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>৳ {order.totalAmount}</span>
        </div>

        {/* PAYMENT */}
        <div className="text-sm">
          <p>Payment Method: Cash on Delivery</p>
          <p>
            Payment Status:{" "}
            <span className="font-medium">
              {order.paymentStatus === "paid"
                ? "Paid"
                : "Pay on Delivery"}
            </span>
          </p>
        </div>

        {/* ACTION */}
        <a
            href={`${import.meta.env.VITE_API_URL}/orders/${order._id}/invoice`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center bg-black text-white py-2 rounded"
            >
            Download PDF Invoice
            </a>

      </div>
    </div>
  );
};

export default InvoicePreview;
