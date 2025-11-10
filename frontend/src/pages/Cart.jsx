import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // ✅ Use environment API base for images
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  if (cartItems.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">
          Your cart is empty 🛒
        </h2>
        <Link
          to="/"
          className="text-yellow-600 hover:text-yellow-700 font-medium"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Your Shopping Cart
      </h2>

      <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center space-x-4">
              <img
                src={
                  item.image?.startsWith("http")
                    ? item.image
                    : `${API}${item.image}`
                }
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />

              <div>
                <h3 className="font-semibold text-gray-700">{item.name}</h3>
                <p className="text-gray-600">
                  ₦{item.price.toLocaleString()} × {item.qty}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <h3 className="text-lg font-bold text-gray-800">
            Total: ₦{total.toLocaleString()}
          </h3>
          <div className="space-x-4">
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              Clear Cart
            </button>
            <button
              onClick={() => navigate("/checkout")}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
