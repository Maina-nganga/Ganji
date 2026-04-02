import AppLayout from "../components/AppLayout";
import { useState } from "react";
import { Search, Filter, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
import { motion } from "framer-motion";

const allTransactions = [
  { id: 1, date: "Feb 20, 2026", name: "Jane Doe", avatar: "JD", amount: -250, status: "Completed", type: "sent" },
  { id: 2, date: "Feb 18, 2026", name: "Mike Ross", avatar: "MR", amount: +520, status: "Pending", type: "received" },
  { id: 3, date: "Feb 15, 2026", name: "Sarah Kim", avatar: "SK", amount: +1200, status: "Completed", type: "received" },
  { id: 4, date: "Feb 12, 2026", name: "Netflix", avatar: "NF", amount: -15.99, status: "Completed", type: "sent" },
  { id: 5, date: "Feb 10, 2026", name: "Alex Mugo", avatar: "AM", amount: -300, status: "Completed", type: "sent" },
  { id: 6, date: "Feb 08, 2026", name: "Wanjiku K.", avatar: "WK", amount: +750, status: "Completed", type: "received" },
  { id: 7, date: "Feb 05, 2026", name: "Spotify", avatar: "SP", amount: -9.99, status: "Failed", type: "sent" },
];

const statusStyles = {
  Completed: { color: "text-green-400", bg: "bg-green-400/10" },
  Pending:   { color: "text-yellow-400", bg: "bg-yellow-400/10" },
  Failed:    { color: "text-red-400", bg: "bg-red-400/10" },
};

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = allTransactions.filter((tx) => {
    const matchesSearch = tx.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || tx.type === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-8 py-10 relative overflow-hidden">

      
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

        <div className="relative z-10 mb-8">
          <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">History</p>
          <h1 className="text-3xl font-bold">
            Transaction <span className="text-yellow-400">History</span>
          </h1>
        </div>

        
        <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/50 transition"
            />
          </div>
          <div className="flex gap-2">
            {["All", "Sent", "Received"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f ? "bg-yellow-400 text-black" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-semibold text-lg text-yellow-400">All Transactions</h2>
            <span className="text-zinc-500 text-sm">{filtered.length} records</span>
          </div>

          <div className="overflow-x-auto">
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
                {filtered.map((tx, i) => (
                  <motion.tr
                    key={tx.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition group"
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400">
                          {tx.avatar}
                        </div>
                        <span className="font-medium text-zinc-100">{tx.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} /> {tx.date}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className={`flex items-center gap-1 text-xs font-medium ${tx.type === "sent" ? "text-red-400" : "text-green-400"}`}>
                        {tx.type === "sent" ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                        {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                      </div>
                    </td>
                    <td className={`py-4 font-bold ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </td>
                    <td className="py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[tx.status].color} ${statusStyles[tx.status].bg}`}>
                        {tx.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-zinc-600 text-sm">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}