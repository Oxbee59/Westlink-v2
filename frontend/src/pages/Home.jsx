import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import santaDecor from "../assets/santa_decor.png";

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
    <div className="bg-[#111] min-h-screen text-white py-6">
      {/* WRAPPER */}
      <div className="max-w-6xl mx-auto px-4">
        {/* CHRISTMAS BANNER */}
        <div className="relative bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 rounded-xl mb-4 p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center text-center sm:text-left shadow-lg">
          <img
            src={santaDecor}
            alt="Santa decoration"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain sm:object-contain animate-bounce flex-shrink-0"
          />

          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide">
              WESTLINK Supermarket
            </h1>

            <p className="text-sm sm:text-base mt-1 opacity-95">
              Celebrate Christmas with quality groceries, household essentials,
              and festive savings for your family.
            </p>

            <div className="inline-block mt-2 sm:mt-3 bg-white/20 backdrop-blur px-3 py-1 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base font-semibold">
              🎄 Christmas Offer:{" "}
              <span className="font-extrabold text-yellow-200">
                10% OFF all items
              </span>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                activeCategory === cat
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                setSelectedProduct(product);
                setActiveImage(0);
              }}
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
              <p className="text-xs text-center text-gray-400 mt-1">
                Tap to view images
              </p>
            </div>
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
              className="absolute inset-0 bg-black/70"
              onClick={() => setSelectedProduct(null)}
            />

            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden z-50"
            >
              <div className="grid md:grid-cols-2">
                {/* IMAGE VIEWER */}
                <div className="bg-gray-100 p-4">
                  <img
                    src={
                      getImages(selectedProduct)[activeImage]?.startsWith("http")
                        ? getImages(selectedProduct)[activeImage]
                        : `${API}${getImages(selectedProduct)[activeImage]}`
                    }
                    className="w-full h-80 object-contain"
                    alt={selectedProduct.name}
                  />

                  <div className="flex gap-2 justify-center mt-3">
                    {getImages(selectedProduct).map((img, idx) => (
                      <img
                        key={idx}
                        src={img.startsWith("http") ? img : `${API}${img}`}
                        onClick={() => setActiveImage(idx)}
                        className={`w-14 h-14 object-cover rounded cursor-pointer border ${
                          activeImage === idx
                            ? "border-yellow-500"
                            : "border-gray-300"
                        }`}
                        alt=""
                      />
                    ))}
                  </div>
                </div>

                {/* DETAILS */}
                <div className="p-6 flex flex-col gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-xl font-extrabold text-yellow-600">
                    ₦{Number(selectedProduct.price).toLocaleString()}
                  </p>

                  {/* Removed duplicate name under price */}

                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => addToCart(selectedProduct)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-2 rounded-lg font-semibold"
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
