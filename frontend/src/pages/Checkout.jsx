import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const total = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  const API = import.meta.env.VITE_API_URL || "https://westlink-backend-b1zf.onrender.com";

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user?.id) return setError("User not logged in");

    const products = cartItems.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
    }));

    try {
      const res = await fetch(`${API}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          fullName,
          phone,
          deliveryAddress: address,
          products,
        }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to place order");

      clearCart(); // clear cart after successful order
      navigate("/contact-staff"); // redirect to contact staff page
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleCheckout} className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Order total: <strong>₦{total.toLocaleString()}</strong>
          </p>
        </div>

        <input
          type="text"
          required
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="text"
          required
          placeholder="Delivery address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />
        <input
          type="tel"
          required
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-3 px-3 py-2 border rounded"
        />

        <button type="submit" className="w-full bg-gold text-dark py-2 rounded-lg font-semibold">
          Place Order
        </button>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
