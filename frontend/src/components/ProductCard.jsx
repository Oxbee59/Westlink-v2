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
      whileHover={{ scale: 1.04, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 18 }}
      className="relative bg-white rounded-3xl shadow-lg overflow-hidden flex flex-col h-full border border-gray-200 hover:shadow-2xl transition-all duration-300"
    >
      {/* IMAGE */}
      <div className="relative w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 group">
        <img
          src={image || "https://via.placeholder.com/300?text=No+Image"}
          alt={name || "Product"}
          className="w-full h-44 object-contain transition-transform duration-300 group-hover:scale-105"
        />

        {/* VIEW OVERLAY */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center rounded-t-3xl">
          <span className="opacity-0 group-hover:opacity-100 transition text-xs font-semibold bg-white text-black px-4 py-1.5 rounded-full shadow">
            View Details
          </span>
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3
            className="text-base sm:text-lg font-semibold text-gray-800 leading-snug"
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

          <p className="text-lg font-extrabold text-yellow-600 mt-3">
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
          className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black py-2.5 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
}
