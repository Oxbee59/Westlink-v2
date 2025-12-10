import { useEffect, useState } from "react";

export default function Purchases() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  // Define API base URL (same as in Home.jsx)
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // Fetch orders for this user
      fetch(`${API}/api/orders/user/${parsed.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [API]);

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
                {new Date(order.date || order.id).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₦{Number(order.totalPrice).toLocaleString()}
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
                {order.products.map((i) => i.name).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
