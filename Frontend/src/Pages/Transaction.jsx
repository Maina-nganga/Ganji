import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";

const statusStyles = {
  completed: { color: "text-green-400",  bg: "bg-green-400/10"  },
  pending:   { color: "text-yellow-400", bg: "bg-yellow-400/10" },
  failed:    { color: "text-red-400",    bg: "bg-red-400/10"    },
};

export default function Transactions() {
  const { token } = useAuth();
  const API = "https://ganji-f4ne.onrender.com";

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");

  useEffect(() => {
    if (!token) return;
    const fetch_ = async () => {
      setLoading(true); setError("");
      try {
        const res  = await fetch(`${API}/api/transactions/`, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to load transactions");
        const data = await res.json();
        setTransactions(data.transactions ?? []);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [token]);

  const filtered = transactions.filter((tx) => {
    const name = tx.recipient_name ?? tx.sender_name ?? "";
    const matchesSearch  = name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter  =
      filter === "All" ||
      (filter === "Sent"     && tx.type === "sent") ||
      (filter === "Received" && tx.type === "received");
    return matchesSearch && matchesFilter;
  });

  const getInitials = (tx) => (tx.recipient_name ?? tx.sender_name ?? "??").slice(0, 2).toUpperCase();
  const fmt = (n)   => `KES ${Math.abs(Number(n)).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
  const fmtDateShort = (d) => new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric" });

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-4 md:px-8 py-6 md:py-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

   
        <div className="relative z-10 mb-6">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">History</p>
          <h1 className="text-2xl md:text-3xl font-bold">
            Transaction <span className="text-yellow-400">History</span>
          </h1>
        </div>

     
        <div className="flex flex-col sm:flex-row gap-3 mb-6 relative z-10">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text" placeholder="Search by name..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/50 transition"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Sent", "Received"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  filter === f ? "bg-yellow-400 text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
                }`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-base md:text-lg text-yellow-400">All Transactions</h2>
            <span className="text-zinc-500 text-xs md:text-sm">{filtered.length} records</span>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
          )}

         
          <div className="md:hidden space-y-2">
            {loading ? (
              Array(5).fill(0).map((_, i) => <div key={i} className="h-16 bg-zinc-800 rounded-xl animate-pulse" />)
            ) : filtered.length === 0 ? (
              <p className="py-10 text-center text-zinc-600 text-sm">
                {transactions.length === 0 ? "No transactions yet." : "No matches found."}
              </p>
            ) : (
              filtered.map((tx, i) => {
                const isSent = tx.type === "sent";
                const status = (tx.status ?? "completed").toLowerCase();
                const style  = statusStyles[status] ?? statusStyles.completed;
                return (
                  <motion.div key={tx.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl hover:bg-zinc-800/80 transition">
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">
                      {getInitials(tx)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.recipient_name ?? tx.sender_name ?? "—"}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-zinc-500 text-xs">{fmtDateShort(tx.created_at)}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${style.color} ${style.bg}`}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${isSent ? "text-red-400" : "text-green-400"}`}>
                        {isSent ? "−" : "+"}{fmt(tx.amount)}
                      </p>
                      <div className={`flex items-center justify-end gap-0.5 text-[10px] font-medium mt-0.5 ${isSent ? "text-red-400" : "text-green-400"}`}>
                        {isSent ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                        {isSent ? "Sent" : "Received"}
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

        
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-zinc-500 text-sm border-b border-zinc-800">
                <tr>
                  <th className="pb-4 font-medium">Recipient</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Type</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="border-b border-zinc-800/60">
                      <td colSpan={5} className="py-4"><div className="h-8 bg-zinc-800 rounded-lg animate-pulse" /></td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="py-12 text-center text-zinc-600 text-sm">
                    {transactions.length === 0 ? "No transactions yet. Make your first deposit!" : "No transactions match your search."}
                  </td></tr>
                ) : (
                  filtered.map((tx, i) => {
                    const status = (tx.status ?? "completed").toLowerCase();
                    const style  = statusStyles[status] ?? statusStyles.completed;
                    return (
                      <motion.tr key={tx.id}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">{getInitials(tx)}</div>
                            <span className="font-medium text-zinc-100">{tx.recipient_name ?? tx.sender_name ?? "—"}</span>
                          </div>
                        </td>
                        <td className="py-4 text-zinc-500 text-sm">
                          <div className="flex items-center gap-1.5"><Clock size={12} />{fmtDate(tx.created_at)}</div>
                        </td>
                        <td className="py-4">
                          <div className={`flex items-center gap-1 text-xs font-medium ${tx.type === "sent" ? "text-red-400" : "text-green-400"}`}>
                            {tx.type === "sent" ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                            {tx.type === "sent" ? "Sent" : "Received"}
                          </div>
                        </td>
                        <td className={`py-4 font-bold ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                          {tx.type === "received" ? "+" : "−"}{fmt(tx.amount)}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${style.color} ${style.bg}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}