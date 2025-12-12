import React from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function ProductCard({ id, name, price, image }) {
  const { addToCart } = useCart();

  const formatNumber = (num) => {
    const n = typeof num === "number" ? num : Number(num);
    return !isNaN(n) ? n.toLocaleString() : "0";
  };

  const safePrice = typeof price === "number" ? price : Number(price);

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.35)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full"
    >
      <div className="w-full bg-white rounded-t-2xl flex items-center justify-center p-2">
        <img
          src={
            image
              ? image
              : "https://via.placeholder.com/300?text=No+Image"
          }
          alt={name || "Product"}
          className="w-full h-40 object-contain"
        />
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="mb-2">
          <h3
            className="text-md sm:text-lg font-semibold"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
            title={name}
          >
            {name || "Unnamed Product"}
          </h3>
          <p className="text-gold font-bold mt-2">₦{formatNumber(safePrice)}</p>
        </div>

        <div className="mt-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart({ id, name, price: !isNaN(safePrice) ? safePrice : 0, image });
            }}
            className="w-full bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}
