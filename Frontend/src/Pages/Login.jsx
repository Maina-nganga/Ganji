import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("https://ganji-f4ne.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      await login(data.access_token);
      navigate("/dashboard");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <h1 className="text-xl font-semibold">
          <span className="text-gold">Ganji</span>
        </h1>

        <Link
          to="/register"
          className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition"
        >
          Sign Up
        </Link>
      </nav>

      <div className="grid md:grid-cols-2 items-center px-12 mt-10 relative z-10">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Welcome Back <br />
            To Your Secure <br />
            <span className="text-gold">Digital Wallet</span>
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-md text-sm">
            Access your account and manage your money securely and instantly.
          </p>
        </div>

        <div className="mt-16 md:mt-0 flex justify-center">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-8"
          >
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gold text-black rounded-full flex items-center justify-center font-bold">
                @
              </div>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-16 pr-6 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:outline-none transition"
              />
            </div>

            <div className="relative">
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-6 pr-16 py-5 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 rounded-full bg-gold text-black font-semibold text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition disabled:opacity-60"
            >
              {loading ? "Logging in..." : "LOGIN"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold hover:underline">
                Sign Up
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </div>
  );
}