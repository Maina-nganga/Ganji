import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">

     
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

     
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <h1 className="text-xl font-semibold">
          <span className="text-gold">Ganji</span>
        </h1>

        <div className="flex gap-6 items-center">
          <Link to="/login" className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition">
            Log In
          </Link>
        </div>
      </nav>

  
      <div className="grid md:grid-cols-2 items-center px-12 mt-10 relative z-10">

        
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Create Your <br />
            Secure <span className="text-gold">Account</span> <br />
            Today
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-md text-sm">
            Join thousands of users making secure and instant digital payments.
          </p>
        </div>

        
        <div className="mt-16 md:mt-0 flex justify-center">
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-6"
          >
            <div>
              <label className="text-sm text-gray-400">Full Name</label>
              <input
                type="text"
                className="w-full mt-2 p-4 rounded-md bg-black border border-gray-700 focus:border-gold focus:outline-none transition"
                placeholder="Username"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Email</label>
              <input
                type="email"
                className="w-full mt-2 p-4 rounded-md bg-black border border-gray-700 focus:border-gold focus:outline-none transition"
                placeholder="username@example.com"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400">Password</label>
              <input
                type="password"
                className="w-full mt-2 p-4 rounded-md bg-black border border-gray-700 focus:border-gold focus:outline-none transition"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gold text-black py-4 rounded-md font-semibold hover:shadow-glow transition"
            >
              Create Account
            </button>

            <p className="text-sm text-gray-400 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Log In
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}
