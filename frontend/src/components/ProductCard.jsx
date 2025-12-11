import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function ProductCard({ id, name, price, image }) {
  const { addToCart } = useCart();

  // Safely format numbers
  const formatNumber = (num) => {
    const n = typeof num === "number" ? num : Number(num);
    return !isNaN(n) ? n.toLocaleString() : "0";
  };

  const safePrice = typeof price === "number" ? price : Number(price);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden"
    >
      <img
        src={
          image
            ? image
            : "https://via.placeholder.com/300?text=No+Image"
        }
        alt={name || "Product"}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold mb-1">
          {name || "Unnamed Product"}
        </h3>

        <p className="text-gold font-bold mb-3">
          ₦{formatNumber(safePrice)}
        </p>

        <button
          onClick={() =>
            addToCart({
              id,
              name,
              price: !isNaN(safePrice) ? safePrice : 0,
              image,
            })
          }
          className="bg-gold text-dark px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
