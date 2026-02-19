import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">
      
      {/* Gold Gradient Glow */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <h1 className="text-xl font-semibold">
          <span className="text-gold">Ganji</span>
        </h1>

        <div className="hidden md:flex gap-10 text-sm text-gray-300">
          <a href="#" className="hover:text-gold">Service</a>
          <a href="#" className="hover:text-gold">How It Work</a>
          <a href="#" className="hover:text-gold">Benefits</a>
          <a href="#" className="hover:text-gold">Pricing</a>
        </div>

        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-sm hover:text-gold">
            Log In
          </Link>
          <Link
            to="/register"
            className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="grid md:grid-cols-2 items-center px-12 mt-20 relative z-10">

        {/* Left Content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Fast And Simple <br />
            Digital Payment <br />
            Solution
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-md text-sm">
            Many credit cards are lost by the users, stolen, or expired. 
            But these cards can still be used by others. This app can 
            provide you with a card and necessary information.
          </p>

          <div className="flex gap-4 mt-8">
            <button className="bg-gold text-black px-6 py-3 rounded-md text-sm font-semibold hover:shadow-glow transition">
              Get It Now
            </button>

            <button className="border border-gold px-6 py-3 rounded-md text-sm hover:bg-gold hover:text-black transition">
              Download App
            </button>
          </div>
        </div>

        {/* Right Content (Card + Hand Mock Area) */}
        <div className="relative mt-20 md:mt-0 flex justify-center">

          {/* Black Card */}
          <motion.div
            initial={{ rotate: -5, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-[320px] h-[200px] bg-black rounded-2xl shadow-2xl p-6 relative z-20"
          >
            <div className="w-10 h-6 bg-gold rounded-sm mb-6"></div>
            <p className="tracking-widest text-sm">
              1234 5678 9012 245
            </p>
            <p className="text-xs text-gray-400 mt-6">06/25</p>
          </motion.div>

          {/* Gold Card Behind */}
          <div className="absolute -left-10 top-10 w-[320px] h-[200px] bg-gold opacity-70 rounded-2xl z-10"></div>

        </div>
      </div>

      {/* Bottom Stats Section */}
      <div className="flex flex-wrap gap-16 px-12 mt-20 pb-12 text-sm text-gray-400 relative z-10">

        <div>
          <p className="text-gold font-semibold">01</p>
          <p className="mt-2">Financial Transaction</p>
        </div>

        <div>
          <p className="text-gold font-semibold">02</p>
          <p className="mt-2">Easy To Use System</p>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="bg-gold text-black px-6 py-2 rounded-md font-semibold">
            1.24M
          </div>
          <p>World Active User</p>
        </div>

      </div>
    </div>
  );
}
