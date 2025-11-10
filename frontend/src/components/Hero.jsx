import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-20 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-black">WESTLINK</span> Supermarket
          </h1>
          <p className="text-lg md:text-xl text-gray-100 max-w-lg">
            Your one-stop destination for groceries, drinks, household items, and more — 
            all at unbeatable prices!
          </p>

          <Link
            to="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition"
          >
            Shop Now
          </Link>
        </motion.div>

        {/* Hero Image */}
        <motion.img
          src="https://images.unsplash.com/photo-1581578017423-3f0abf0e8b9a?auto=format&fit=crop&w=800&q=80"
          alt="Shopping"
          className="w-full md:w-[45%] rounded-2xl shadow-lg"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />
      </div>
    </section>
  );
}
