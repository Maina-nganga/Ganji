import { Link, useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-[#0E0E10] text-white border-b border-gold/10">
      <h1 className="text-2xl font-bold text-gold">AurraPay</h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-gold transition">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-gold transition">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gold text-gold rounded-md hover:bg-gold hover:text-black transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gold transition">
              Login
            </Link>

            <Link to="/register">
              <Button>Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}