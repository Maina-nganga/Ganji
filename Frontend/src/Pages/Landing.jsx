import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">
      
      
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

     
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-20">
        <Link to="/" className="text-xl font-semibold">
          <span className="text-gold">Ganji</span>
        </Link>

        
        <div className="hidden md:flex gap-10 text-sm text-gray-300">
          <a href="#services" className="hover:text-gold transition">Service</a>
          <a href="#how" className="hover:text-gold transition">How It Works</a>
          <a href="#benefits" className="hover:text-gold transition">Benefits</a>
        </div>

        <div className="hidden md:flex gap-4 items-center">
          <Link to="/login" className="text-sm hover:text-gold transition">
            Log In
          </Link>
          <Link
            to="/register"
            className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition"
          >
            Sign Up
          </Link>
        </div>

       
        <button
          className="md:hidden text-gold"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>


      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-gold/20 px-6 py-4 space-y-4 text-sm">
          <a href="#services" className="block hover:text-gold">Service</a>
          <a href="#how" className="block hover:text-gold">How It Works</a>
          <a href="#benefits" className="block hover:text-gold">Benefits</a>
          <Link to="/login" className="block hover:text-gold">Log In</Link>
          <Link to="/register" className="block text-gold">Sign Up</Link>
        </div>
      )}

     
      <section className="grid md:grid-cols-2 items-center px-6 md:px-12 mt-16 md:mt-24 relative z-10">

        
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold leading-tight"
          >
            Fast And Simple <br />
            Digital Payment <br />
            Solution
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-md text-sm md:text-base">
            Secure, modern and seamless digital transactions designed
            for individuals and businesses worldwide.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              to="/register"
              className="bg-gold text-black px-6 py-3 rounded-md text-sm font-semibold hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition"
            >
              Get Started
            </Link>

            <a
              href="#how"
              className="border border-gold px-6 py-3 rounded-md text-sm hover:bg-gold hover:text-black transition"
            >
              Learn More
            </a>
          </div>
        </div>

        <div className="relative mt-20 md:mt-0 flex justify-center">
          
          <motion.div
            initial={{ rotate: -6, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-[320px] h-[200px] bg-black rounded-2xl shadow-2xl p-6 relative z-20 border border-gold/20"
          >
            <div className="w-10 h-6 bg-gold rounded-sm mb-6"></div>
            <p className="tracking-widest text-sm">
              1234 5678 9012 245
            </p>
            <p className="text-xs text-gray-400 mt-6">06/25</p>
          </motion.div>

          <div className="absolute -left-10 top-10 w-[320px] h-[200px] bg-gold opacity-70 rounded-2xl z-10"></div>
        </div>
      </section>

     
      <section id="services" className="px-6 md:px-12 mt-32 relative z-10">
        <h2 className="text-3xl font-bold mb-12 text-center">
          Why Choose <span className="text-gold">Ganji</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-10 text-gray-400">
          <div className="p-6 bg-[#151517] rounded-xl border border-gold/10 hover:border-gold/30 transition">
            <h3 className="text-gold mb-4 font-semibold">Secure Payments</h3>
            <p>End-to-end encrypted transactions with real-time monitoring.</p>
          </div>

          <div className="p-6 bg-[#151517] rounded-xl border border-gold/10 hover:border-gold/30 transition">
            <h3 className="text-gold mb-4 font-semibold">Instant Transfers</h3>
            <p>Send and receive funds instantly anywhere in the world.</p>
          </div>

          <div className="p-6 bg-[#151517] rounded-xl border border-gold/10 hover:border-gold/30 transition">
            <h3 className="text-gold mb-4 font-semibold">Analytics Dashboard</h3>
            <p>Track your financial activity with real-time insights.</p>
          </div>
        </div>
      </section>

     
<section id="how" className="px-6 md:px-12 mt-32 relative z-10 overflow-hidden">
  

  <div className="absolute -left-20 top-10 w-[400px] h-[400px] bg-gold opacity-20 blur-[160px] rounded-full"></div>

  <h2 className="text-3xl font-bold mb-12 text-center relative z-10">
    How It <span className="text-gold">Works</span>
  </h2>

  <div className="grid md:grid-cols-3 gap-12 text-gray-400 relative z-10">

    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold text-black font-bold text-lg">
        1
      </div>
      <h3 className="text-gold font-semibold mb-3">Create Account</h3>
      <p>Sign up in minutes and securely verify your identity.</p>
    </div>

    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold text-black font-bold text-lg">
        2
      </div>
      <h3 className="text-gold font-semibold mb-3">Fund Your Wallet</h3>
      <p>Add funds easily using supported payment methods.</p>
    </div>

    <div className="text-center">
      <div className="w-14 h-14 mx-auto mb-6 flex items-center justify-center rounded-full bg-gold text-black font-bold text-lg">
        3
      </div>
      <h3 className="text-gold font-semibold mb-3">Send & Track</h3>
      <p>Transfer money instantly and monitor transactions in real time.</p>
    </div>

  </div>
</section>

<section id="benefits" className="px-6 md:px-12 mt-32 relative z-10 overflow-hidden">
  
 
  <div className="absolute -right-20 top-20 w-[450px] h-[450px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

  <h2 className="text-3xl font-bold mb-12 text-center relative z-10">
    Powerful <span className="text-gold">Benefits</span>
  </h2>

  <div className="grid md:grid-cols-2 gap-12 relative z-10">

    <div className="bg-[#151517] p-8 rounded-xl border border-gold/10 hover:border-gold/30 transition">
      <h3 className="text-gold font-semibold mb-4 text-lg">
        Low Transaction Fees
      </h3>
      <p className="text-gray-400">
        Enjoy competitive rates designed to save you more with every transfer.
      </p>
    </div>

    <div className="bg-[#151517] p-8 rounded-xl border border-gold/10 hover:border-gold/30 transition">
      <h3 className="text-gold font-semibold mb-4 text-lg">
        Bank-Level Security
      </h3>
      <p className="text-gray-400">
        Multi-layer encryption and fraud detection keep your funds protected.
      </p>
    </div>

    <div className="bg-[#151517] p-8 rounded-xl border border-gold/10 hover:border-gold/30 transition">
      <h3 className="text-gold font-semibold mb-4 text-lg">
        24/7 Support
      </h3>
      <p className="text-gray-400">
        Dedicated support team available anytime you need assistance.
      </p>
    </div>

    <div className="bg-[#151517] p-8 rounded-xl border border-gold/10 hover:border-gold/30 transition">
      <h3 className="text-gold font-semibold mb-4 text-lg">
        Real-Time Analytics
      </h3>
      <p className="text-gray-400">
        Track performance, spending, and growth with a powerful dashboard.
      </p>
    </div>

  </div>
</section>
              

     
      <footer className="mt-32 border-t border-gold/10 px-6 md:px-12 py-10 text-gray-500 text-sm relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <p>© {new Date().getFullYear()} Ganji. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gold">Privacy</a>
            <a href="#" className="hover:text-gold">Terms</a>
            <a href="#" className="hover:text-gold">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}