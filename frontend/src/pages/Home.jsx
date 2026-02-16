import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeImage, setActiveImage] = useState(0);

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

  const getImages = (product) =>
    [product.image1, product.image2, product.image3].filter(Boolean);

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#111] min-h-screen text-white">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wide">
            WESTLINK Supermarket
          </h1>
          <p className="mt-3 text-sm sm:text-base font-medium">
            Your trusted supermarket in New Owerri, Imo State
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* CATEGORY SECTION */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            Shop by Category
          </h2>

          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow ${
                  activeCategory === cat
                    ? "bg-yellow-500 text-black scale-105"
                    : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              onClick={() => {
                setSelectedProduct(product);
                setActiveImage(0);
              }}
              className="cursor-pointer"
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                image={
                  product.image1?.startsWith("http")
                    ? product.image1
                    : `${API}${product.image1}`
                }
              />
              <p className="text-xs text-center text-gray-400 mt-2">
                Click to view details
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* PRODUCT MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden z-50 shadow-2xl"
            >
              <div className="grid md:grid-cols-2">

                {/* IMAGE SECTION */}
                <div className="bg-gray-100 p-6">
                  <img
                    src={
                      getImages(selectedProduct)[activeImage]?.startsWith("http")
                        ? getImages(selectedProduct)[activeImage]
                        : `${API}${getImages(selectedProduct)[activeImage]}`
                    }
                    className="w-full h-96 object-contain rounded-lg"
                    alt={selectedProduct.name}
                  />

                  <div className="flex gap-3 justify-center mt-4">
                    {getImages(selectedProduct).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith("http") ? img : `${API}${img}`}
                        onClick={() => setActiveImage(idx)}
                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                          activeImage === idx
                            ? "border-yellow-500"
                            : "border-gray-300"
                        }`}
                        alt=""
                      />
                    ))}
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="p-8 flex flex-col gap-5">
                  <h2 className="text-2xl font-bold text-gray-800 leading-snug">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-2xl font-extrabold text-yellow-600">
                    ₦{Number(selectedProduct.price).toLocaleString()}
                  </p>

                  <div className="flex gap-4 mt-auto">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => setSelectedProduct(null)}
                      className="flex-1 border border-gray-300 text-gray-800 py-3 rounded-xl"
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
