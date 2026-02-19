import { Link } from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-6">
      <h1 className="text-2xl font-bold text-gold">AurraPay</h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-gold">Home</Link>
        <Link to="/login">Login</Link>
        <Button>Sign Up</Button>
      </div>
    </nav>
  );
}
