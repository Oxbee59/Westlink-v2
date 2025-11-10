import { useEffect, useState } from "react";

function Purchases() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      fetch(`http://localhost:5000/orders/${parsed.id}`)
        .then((res) => res.json())
        .then((data) => setOrders(data))
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
                {new Date(order.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Total:</strong> ₦{order.total}
              </p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items.map((i) => i.name).join(", ")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Purchases;
