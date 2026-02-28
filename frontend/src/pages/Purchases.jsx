import { useEffect, useState } from "react";

export default function Purchases() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  const API = import.meta.env.VITE_API_URL || "https://westlink-backend-b1zf.onrender.com";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetch(`${API}/api/orders/user/${parsed.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
          else if (Array.isArray(data.orders)) setOrders(data.orders);
          else setOrders([]);
        })
        .catch((err) => {
          console.error("Error fetching orders:", err);
          setOrders([]);
        });
    }
  }, [API]);

  // Safe formatting
  const formatNumber = (num) => {
    const n = Number(num);
    return !isNaN(n) ? n.toLocaleString() : "0";
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Please log in to view purchases.</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-yellow-600">My Purchases</h2>

      {orders.length === 0 ? (
        <p>No purchases found.</p>
      ) : (
        <ul className="divide-y">
          {orders.map((order) => (
            <li key={order.id} className="py-3">
              <p>
                <strong>Order Date:</strong>{" "}
                {order.created_at
                  ? new Date(order.created_at).toLocaleDateString()
                  : "N/A"}
              </p>

              <p>
                <strong>Total:</strong> ₦{formatNumber(order.total_price)}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`font-semibold ${
                    order.status === "completed"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <p>
                <strong>Items:</strong>{" "}
                {Array.isArray(order.products) && order.products.length > 0
                  ? order.products.map((i) => `${i.name} × ${i.quantity}`).join(", ")
                  : "No items"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
