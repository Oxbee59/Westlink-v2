import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import santaDecor from "../assets/santa_decor.png"; // place uploaded image here

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error loading products:", err));
  }, [API]);

  const categories = [
    "All",
    "Babies Corner",
    "Wines & Alcohol",
    "Beverages",
    "Lotions & Body Care",
    "Cooking Essentials",
    "Cooking Utensils",
    "Other Materials",
  ];

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) =>
            (p.category || "Other Materials").toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <div className="bg-[#111] min-h-screen text-white py-6">
      {/* TOP CHRISTMAS BANNER */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 rounded-xl overflow-hidden mb-6 p-4 flex items-center gap-4">
          <img
            src={santaDecor}
            alt="Santa"
            className="w-20 h-20 object-contain hidden sm:block transform animate-bounce"
          />
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold">WESTLINK Supermarket</h1>
            <p className="mt-1 text-sm sm:text-base">
              Your home away from home — this Christmas enjoy love, joy and great savings!
            </p>
            <div className="mt-2 inline-block bg-white/20 px-3 py-1 rounded">
              <span className="font-semibold">🎄 Christmas Special:</span> Get{" "}
              <span className="font-bold">10% OFF</span> storewide (auto-applied at checkout).
            </div>
          </div>
        </div>

        {/* CATEGORY selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 sm:px-4 py-2 rounded-full font-semibold text-sm sm:text-base transition-all ${
                activeCategory === category
                  ? "bg-yellow-500 text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative">
              {/* clicking the card opens modal */}
              <div onClick={() => setSelectedProduct(product)}>
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image?.startsWith("http") ? product.image : `${API}${product.image}`}
                />
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-gray-400 col-span-full mt-10">No products found in this category.</p>
        )}
      </div>

      {/* Product modal preview */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setSelectedProduct(null)}
            />
            <motion.div
              layout
              initial={{ y: 30, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden z-50"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-4 bg-gray-100 flex items-center justify-center">
                  <img
                    src={selectedProduct.image?.startsWith("http") ? selectedProduct.image : `${API}${selectedProduct.image}`}
                    alt={selectedProduct.name}
                    className="max-h-96 w-full object-contain"
                  />
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProduct.name}</h2>
                    <p className="text-gray-600 mt-1">{selectedProduct.category || "Miscellaneous"}</p>
                  </div>

                  <div className="flex-1">
                    <p className="text-xl font-extrabold text-yellow-600">₦{Number(selectedProduct.price).toLocaleString()}</p>
                    {/* placeholder for description if available */}
                    <p className="mt-3 text-gray-700">
                      {selectedProduct.description || "No description available."}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        addToCart(selectedProduct);
                      }}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-lg"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 border border-gray-300 text-gray-800 py-2 rounded-lg"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
