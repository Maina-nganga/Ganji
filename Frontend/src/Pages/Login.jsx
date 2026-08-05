import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API = "https://ganji-f4ne.onrender.com";

export default function Login() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [waking, setWaking]     = useState(true);

 
  useEffect(() => {
    fetch(`${API}/api/auth/login`, { method: "OPTIONS" })
      .catch(() => {})
      .finally(() => setWaking(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      await login(data.access_token);
      navigate("/dashboard");
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const buttonLabel = () => {
    if (waking)   return "Connecting to server...";
    if (loading)  return "Logging in...";
    return "LOGIN";
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">
      <div className="absolute right-0 top-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-gold opacity-20 blur-[180px] rounded-full" />

      <nav className="flex justify-between items-center px-6 md:px-12 py-6 relative z-10">
        <h1 className="text-xl font-semibold"><span className="text-gold">Ganji</span></h1>
        <Link to="/register" className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition">
          Sign Up
        </Link>
      </nav>

    
      {waking && (
        <div className="relative z-10 mx-6 md:mx-12 mb-2 flex items-center gap-2 px-4 py-2.5 bg-yellow-400/10 border border-yellow-400/20 rounded-xl text-yellow-400 text-xs">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse shrink-0" />
          Waking up the server, please wait a moment...
        </div>
      )}

      <div className="grid md:grid-cols-2 items-center px-6 md:px-12 mt-6 md:mt-10 relative z-10 gap-8">

        <div className="hidden md:block">
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight">
            Welcome Back <br />
            To Your Secure <br />
            <span className="text-gold">Digital Wallet</span>
          </motion.h1>
          <p className="text-gray-400 mt-6 max-w-md text-sm">
            Access your account and manage your money securely and instantly.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

            <div className="md:hidden text-center mb-8">
              <h2 className="text-3xl font-bold leading-tight">
                Welcome Back to <span className="text-gold">Ganji</span>
              </h2>
              <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-gold text-black rounded-full flex items-center justify-center font-bold text-sm">
                  @
                </div>
                <input type="email" required autoComplete="email"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full pl-16 pr-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:outline-none transition text-sm"
                />
              </div>

              <div className="relative">
                <input type="password" required autoComplete="current-password"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-6 pr-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:outline-none transition text-sm"
                />
              </div>

              <button type="submit" disabled={loading || waking}
                className="w-full py-4 rounded-full bg-gold text-black font-semibold text-base hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transition disabled:opacity-60 flex items-center justify-center gap-2">
                {(waking || loading) && (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                )}
                {buttonLabel()}
              </button>

              <p className="text-center text-sm text-gray-400">
                Don&apos;t have an account?{" "}
                <Link to="/register" className="text-gold hover:underline">Sign Up</Link>
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}