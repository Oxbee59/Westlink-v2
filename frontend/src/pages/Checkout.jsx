import React from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce((s, i) => s + Number(i.price) * i.qty, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    // TODO: integrate payment API
    alert(`Order placed. Total: ₦${total.toLocaleString()}`);
    clearCart();
    navigate("/");
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <form onSubmit={handleCheckout} className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Order total: <strong>₦{total.toLocaleString()}</strong></p>
        </div>

        <input type="text" required placeholder="Full name" className="w-full mb-3 px-3 py-2 border rounded" />
        <input type="text" required placeholder="Delivery address" className="w-full mb-3 px-3 py-2 border rounded" />
        <input type="tel" required placeholder="Phone number" className="w-full mb-3 px-3 py-2 border rounded" />

        <button type="submit" className="w-full bg-gold text-dark py-2 rounded-lg font-semibold">Place Order</button>
      </form>
    </div>
  );
}
