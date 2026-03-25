
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const checkStrength = (value) => {
    if (value.length < 6) return setStrength("Weak");
    if (value.match(/^(?=.*[A-Z])(?=.*[0-9])/)) return setStrength("Strong");
    return setStrength("Medium");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden">

      {/* Glow Background */}
      <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-gold opacity-20 blur-[180px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-12 py-8 relative z-10">
        <h1 className="text-xl font-semibold">
          <span className="text-gold">AurraPay</span>
        </h1>

        <Link
          to="/login"
          className="border border-gold px-4 py-2 rounded-md text-sm hover:bg-gold hover:text-black transition"
        >
          Log In
        </Link>
      </nav>

      {/* Main Layout */}
      <div className="grid md:grid-cols-2 items-center px-12 mt-10 relative z-10">

        {/* Left Content */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Create Your <br />
            Secure <span className="text-gold">Account</span>
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-md text-sm">
            Join AurraPay and start sending money securely with
            enterprise-level digital wallet technology.
          </p>
        </div>

        {/* Form */}
        <div className="mt-16 md:mt-0 flex justify-center">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full max-w-md space-y-6"
          >

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Full Name */}
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] focus:outline-none transition"
            />

            {/* Email */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] focus:outline-none transition"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-full px-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] focus:outline-none transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Password Strength */}
            {password && (
              <p
                className={`text-sm ${
                  strength === "Weak"
                    ? "text-red-400"
                    : strength === "Medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                Password Strength: {strength}
              </p>
            )}

            {/* Confirm Password */}
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:shadow-[0_0_15px_rgba(255,215,0,0.4)] focus:outline-none transition"
            />

            {/* Submit */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-5 rounded-full bg-gold text-black font-semibold text-lg hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "CREATE ACCOUNT"}
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
