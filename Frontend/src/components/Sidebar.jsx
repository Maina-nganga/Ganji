import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  Users,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-[#0E0E10] shadow-xl flex flex-col justify-between p-6 hidden md:flex rounded-l-3xl overflow-hidden fixed left-0 top-0 z-50">
      <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gold opacity-20 blur-[180px] rounded-full -z-10"></div>
      <div className="absolute left-0 bottom-0 w-[300px] h-[300px] bg-gold opacity-10 blur-[120px] rounded-full -z-10"></div>

      <div>
        <h1 className="text-3xl font-bold text-gold mb-10">Ganji</h1>

        <nav className="flex flex-col gap-4 text-gray-300">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            to="/wallet"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition"
          >
            <Wallet size={18} /> Wallet
          </Link>

          <Link
            to="/beneficiaries"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition"
          >
            <Users size={18} /> Beneficiaries
          </Link>

          <Link
            to="/transactions"
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition"
          >
            <ArrowRightLeft size={18} /> Transactions
          </Link>
        </nav>
      </div>
      <Link to="/login">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] text-gold hover:bg-gold hover:text-black transition font-semibold shadow-md">
          <LogOut size={1} /> Sign Out
        </button>
      </Link>
    </div>
  );
}
