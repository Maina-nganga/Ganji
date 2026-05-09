import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-[#0c0c0e]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

  
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">

       
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-4 bg-[#0E0E10] border-b border-gold/20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gold p-1"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="text-gold font-bold text-lg">Ganji</span>
          <div className="w-8" /> 
        </header>

        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}