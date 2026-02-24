import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Password Strength Logic
  const getStrength = () => {
    if (password.length < 6) return { text: "Weak", color: "bg-red-500", width: "w-1/3" };
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/))
      return { text: "Strong", color: "bg-green-500", width: "w-full" };
    return { text: "Medium", color: "bg-yellow-500", width: "w-2/3" };
  };

  const strength = getStrength();

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">

      {/* Gold Glow Background */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <h1 className="text-xl font-semibold">
          <span className="text-gold">Ganji</span>
        </h1>

        <Link
          to="/login"
          className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition"
        >
          Log In
        </Link>
      </nav>

      {/* Content */}
      <div className="grid md:grid-cols-2 items-center px-12 mt-10 relative z-10">

        {/* Left Side Text */}
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

        {/* Form */}
        <div className="mt-16 md:mt-0 flex justify-center">
          <motion.form
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-8"
          >
            {/* Full Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold text-black rounded-full flex items-center justify-center">
                👤
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-16 pr-6 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/40 focus:outline-none transition"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold text-black rounded-full flex items-center justify-center">
                @
              </div>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-16 pr-6 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/40 focus:outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-6 pr-16 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/40 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gold text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength Bar */}
              {password && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-2 ${strength.color} ${strength.width} transition-all duration-300`}
                    ></div>
                  </div>
                  <p className="text-xs mt-1 text-gray-400">
                    Strength: <span className="text-gold">{strength.text}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-6 pr-6 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/40 focus:outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-5 rounded-full bg-gold text-black font-semibold text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition"
            >
              CREATE ACCOUNT
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