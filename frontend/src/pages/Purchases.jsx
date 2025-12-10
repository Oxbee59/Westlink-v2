import { useEffect, useState } from "react";

function Purchases() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      fetch(`http://localhost:5000/api/orders/user/${parsed.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data.orders || []))
        .catch((err) => console.error(err));
    }
  }, []);

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
                {new Date(order.id).toLocaleDateString()}{" "}
                <span className={`ml-2 px-2 py-1 rounded text-white text-sm ${
                  order.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                }`}>
                  {order.status === "completed" ? "Completed ✅" : "Pending ⏳"}
                </span>
              </p>

              <p>
                <strong>Total:</strong> ₦{Number(order.totalPrice).toLocaleString()}
              </p>

              <p>
                <strong>Items:</strong>{" "}
                {order.products.map((i) => `${i.name} × ${i.quantity || 1}`).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Purchases;
