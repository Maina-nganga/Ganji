import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Wallet, Users,
  ArrowRightLeft, LogOut, Send, X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { to: "/dashboard",    icon: LayoutDashboard, label: "Dashboard" },
  { to: "/wallet",       icon: Wallet,          label: "Wallet" },
  { to: "/beneficiaries",icon: Users,           label: "Beneficiaries" },
  { to: "/transactions", icon: ArrowRightLeft,  label: "Transactions" },

];

export default function Sidebar({ open, onClose }) {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <>

      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
        />
      )}

    
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 z-50
          bg-[#0E0E10] shadow-xl flex flex-col justify-between p-6
          rounded-r-3xl overflow-hidden
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
      
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-gold opacity-20 blur-[180px] rounded-full -z-10" />
        <div className="absolute left-0 bottom-0 w-[300px] h-[300px] bg-gold opacity-10 blur-[120px] rounded-full -z-10" />

        <div>
         
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-bold text-gold">Ganji</h1>
            <button onClick={onClose} className="md:hidden text-zinc-400 hover:text-white transition">
              <X size={20} />
            </button>
          </div>

          <nav className="flex flex-col gap-2 text-gray-300">
            {NAV.map(({ to, icon: Icon, label }) => {
              const active = pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    active
                      ? "bg-gold/15 text-gold"
                      : "hover:bg-gold/10 hover:text-gold"
                  }`}
                >
                  <Icon size={18} /> {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#111] text-gold hover:bg-gold hover:text-black transition font-semibold shadow-md w-full"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </aside>
    </>
  );
}