import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Purchases from "./pages/Purchases";
import About from "./pages/About";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";

function App() {
  const isStaff = localStorage.getItem("is_staff") === "true";

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* PROTECTED ADMIN ROUTE */}
            <Route
              path="/admin"
              element={
                isStaff ? (
                  <Admin />
                ) : (
                  <h1 className="text-center text-2xl mt-10 text-red-600">
                    Access Denied 🔐 (Staff Only)
                  </h1>
                )
              }
            />

            <Route path="/profile" element={<Profile />} />
            <Route path="/purchases" element={<Purchases />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
