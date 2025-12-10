import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ShoppingCart, Menu, X } from "lucide-react";
import logo from "../assets/westlink_logo.png";

export default function Navbar() {
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isStaff = localStorage.getItem("is_staff") === "true";
  const user = localStorage.getItem("user");

  const totalItems = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  // LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("is_staff");
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav className="bg-dark text-gold shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={() => setMenuOpen(true)} className="text-gold focus:outline-none">
              <Menu size={24} />
            </button>

            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="WESTLINK" className="w-9 h-9 rounded-full object-cover" />
              <div className="hidden sm:block">
                <div className="text-base font-bold">WESTLINK</div>
                <div className="text-xs -mt-1">Supermarket</div>
              </div>
              <div className="sm:hidden text-base font-bold ml-1">WESTLINK</div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {!user && (
              <>
                <Link to="/login" className="hover:text-yellow-400">Login</Link>
                <Link to="/register" className="hover:text-yellow-400">Register</Link>
              </>
            )}

            {user && (
              <>
                <Link to="/profile" className="hover:text-yellow-400">Profile</Link>
                <button onClick={handleLogout} className="hover:text-yellow-400">
                  Logout
                </button>
              </>
            )}

            <Link to="/cart" className="relative flex items-center hover:text-yellow-400">
              <ShoppingCart className="w-6 h-6" />
              <span className="ml-1 hidden sm:inline">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* MOBILE RIGHT ICONS */}
          <div className="md:hidden flex items-center space-x-3">
            <Link to="/cart" className="relative flex items-center hover:text-yellow-400">
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={() => setMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-dark text-gold shadow-lg transform transition-transform duration-300 z-50 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gold">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)} className="text-gold">
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col px-6 py-6 space-y-4">
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            👤 Profile
          </Link>

          <Link to="/purchases" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            🛍 Purchases
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
            ℹ️ About
          </Link>

          {/* ADMIN ONLY */}
          {isStaff && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="hover:text-yellow-400 font-bold"
            >
              🔐 Admin Panel
            </Link>
          )}

          {/* NEW: CONTACT STAFF LINK */}
          <Link
            to="/contact-staff"
            onClick={() => setMenuOpen(false)}
            className="hover:text-yellow-400 font-semibold"
          >
            📞 Contact Staff
          </Link>

          {/* Divider */}
          <div className="pt-4 border-t border-gold"></div>

          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="hover:text-yellow-400">
                Register
              </Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="text-left hover:text-yellow-400"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}
