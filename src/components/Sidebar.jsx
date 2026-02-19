import { Link } from "react-router-dom";
import { LayoutDashboard, Wallet, Users, ArrowRightLeft } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-black border-r border-gray-800 p-6 hidden md:block">
      <h1 className="text-2xl font-bold text-gold mb-10">Ganji</h1>

      <nav className="flex flex-col gap-6">
        <Link to="/dashboard" className="flex items-center gap-3 hover:text-gold">
          <LayoutDashboard size={18} /> Dashboard
        </Link>

        <Link to="/wallet" className="flex items-center gap-3 hover:text-gold">
          <Wallet size={18} /> Wallet
        </Link>

        <Link to="/beneficiaries" className="flex items-center gap-3 hover:text-gold">
          <Users size={18} /> Beneficiaries
        </Link>

        <Link to="/transactions" className="flex items-center gap-3 hover:text-gold">
          <ArrowRightLeft size={18} /> Transactions
        </Link>
      </nav>
    </div>
  );
}
