import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/westlink_logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-dark text-gold shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left section (logo + menu button) */}
          <div className="flex items-center space-x-3">
            {/* Hamburger Icon */}
            <button
              onClick={() => setMenuOpen(true)}
              className="text-gold focus:outline-none"
            >
              <Menu size={26} />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img
                src={logo}
                alt="WESTLINK Supermarket"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold">WESTLINK Supermarket</h1>
            </Link>
          </div>

          {/* Right side links */}
          <div className="flex items-center space-x-6 text-base">
            <Link to="/login" className="hover:text-yellow-400">
              Login
            </Link>
            <Link to="/register" className="hover:text-yellow-400">
              Register
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center hover:text-yellow-400"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="ml-1">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* SIDEBAR OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-dark text-gold shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-4 border-b border-gold">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-gold">
            <X size={26} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-4 space-y-6">
          <Link
            to="/profile"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400"
          >
            👤 Profile
          </Link>
          <Link
            to="/purchases"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400"
          >
            🛍 Purchases
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400"
          >
            ℹ️ About
          </Link>
        </div>
      </div>
    </>
  );
}
