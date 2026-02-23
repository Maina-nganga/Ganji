import { Link } from "react-router-dom";
import { LayoutDashboard, Wallet, Users, ArrowRightLeft, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-yellow-500 via-yellow-400 to-yellow-300 shadow-lg relative flex flex-col justify-between p-6 hidden md:flex rounded-l-3xl overflow-hidden">
      
      {/* Gold Glow Effect */}
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gold opacity-20 blur-[180px] rounded-full -z-10"></div>

      {/* Logo */}
      <div>
        <h1 className="text-3xl font-bold text-black mb-10">Ganji</h1>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-4 text-black">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/10 hover:shadow-md transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            to="/wallet"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/10 hover:shadow-md transition"
          >
            <Wallet size={18} /> Wallet
          </Link>

          <Link
            to="/beneficiaries"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/10 hover:shadow-md transition"
          >
            <Users size={18} /> Beneficiaries
          </Link>

          <Link
            to="/transactions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-black/10 hover:shadow-md transition"
          >
            <ArrowRightLeft size={18} /> Transactions
          </Link>
        </nav>
      </div>

      {/* Sign Out Button */}
      <button
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black text-yellow-500 hover:bg-black/80 hover:shadow-md transition font-semibold"
      >
        <LogOut size={18} /> Sign Out
      </button>
    </div>
  );
}