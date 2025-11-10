import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // ✅ Base API URL
  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetch(`${API}/api/products`)
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = [
    "All",
    "Babies Corner",
    "Wines & Alcohol",
    "Beverages",
    "Lotions & Body Care",
    "Cooking Utensils",
    "Other Materials",
  ];

  // Filter products based on selected category
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) =>
            (p.category || "Other Materials").toLowerCase() ===
            activeCategory.toLowerCase()
        );

  return (
    <div className="bg-[#111] min-h-screen text-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gold mb-6 text-center">
          🛍️ Welcome to WESTLINK Supermarket
        </h2>

        {/* Category selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full font-semibold transition-all ${
                activeCategory === category
                  ? "bg-yellow-500 text-black shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => setSelected(index)}
              className={`relative bg-gray-900 rounded-2xl shadow-lg cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-gold/30 ${
                selected === index ? "ring-2 ring-yellow-500" : ""
              }`}
            >
              <img
                src={
                  product.image?.startsWith("http")
                    ? product.image
                    : `${API}${product.image}`
                }
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-3"
              />

              <div className="p-4 flex flex-col justify-between h-40">
                <div>
                  <h3 className="text-lg font-semibold text-gold mb-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-300">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-xl transition-all"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-400 col-span-full mt-10">
              No products found in this category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
