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
      whileHover={{ scale: 1.03, y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
      className="relative bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full border-2 border-yellow-500"
    >
      {/* IMAGE */}
      <div className="relative w-full bg-white rounded-t-2xl flex items-center justify-center p-2 group">
        <img
          src={image || "https://via.placeholder.com/300?text=No+Image"}
          alt={name || "Product"}
          className="w-full h-40 object-contain"
        />

        {/* VIEW IMAGES BADGE */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-white/90 text-black px-3 py-1 rounded-full">
            Tap to view images
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 flex flex-col justify-between flex-1">
        <div className="mb-2">
          <h3
            className="text-md sm:text-lg font-semibold text-gray-900"
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

          <p className="text-yellow-600 font-bold mt-2">
            ₦{formatNumber(safePrice)}
          </p>
        </div>

        {/* ADD TO CART */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToCart({
              id,
              name,
              price: !isNaN(safePrice) ? safePrice : 0,
              image,
            });
          }}
          className="w-full bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
