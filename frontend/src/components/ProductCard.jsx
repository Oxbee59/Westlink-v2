import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function ProductCard({ id, name, price, image }) {
  const { addToCart } = useCart();

  return (
    <motion.div
      whileHover={{ scale: 1.03, rotateZ: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-1">{name}</h3>
        <p className="text-gold font-bold mb-3">₦{Number(price).toLocaleString()}</p>
        <button
          onClick={() => addToCart({ id, name, price: Number(price), image })}
          className="bg-gold text-dark px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
