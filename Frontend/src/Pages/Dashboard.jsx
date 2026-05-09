import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.full_name?.split(" ")[0] ?? "User";

  const [balance, setBalance]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats]           = useState({ totalSent: 0, totalReceived: 0, count: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  const API = "https://ganji-f4ne.onrender.com";
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) return;
    const fetchDashboardData = async () => {
      setLoading(true); setError("");
      try {
        const [balanceRes, txRes] = await Promise.all([
          fetch(`${API}/api/wallet/`,       { headers: authHeaders }),
          fetch(`${API}/api/transactions/`, { headers: authHeaders }),
        ]);
        if (!balanceRes.ok) throw new Error("Failed to load balance");
        if (!txRes.ok)      throw new Error("Failed to load transactions");

        const balanceData = await balanceRes.json();
        const txData      = await txRes.json();
        setBalance(balanceData.balance);

        const txList = txData.transactions ?? [];
        setTransactions(txList.slice(0, 5));
        const sent     = txList.filter((t) => t.type === "sent")    .reduce((s, t) => s + t.amount, 0);
        const received = txList.filter((t) => t.type === "received").reduce((s, t) => s + t.amount, 0);
        setStats({ totalSent: sent, totalReceived: received, count: txList.length });
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    };
    fetchDashboardData();
  }, [token]);

  const pieData   = [
    { name: "Sent",     value: stats.totalSent     || 0 },
    { name: "Received", value: stats.totalReceived  || 0 },
  ];
  const trendData = ["Jan","Feb","Mar","Apr","May","Jun"].map((m) => ({ month: m, sent: 0, received: 0 }));

  const fmt = (n) =>
    n == null ? "—" : `KES ${Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;

  const statusStyles = {
    completed: { color: "text-green-400",  bg: "bg-green-400/10",  label: "Completed" },
    pending:   { color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending"   },
    failed:    { color: "text-red-400",    bg: "bg-red-400/10",    label: "Failed"    },
  };

  const tooltipStyle = { contentStyle: { backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" } };

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-4 md:px-8 relative py-6 md:py-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

     
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 relative z-10">
          <div>
            <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Overview</p>
            <h1 className="text-2xl md:text-4xl font-bold">
              Welcome Back, <span className="text-yellow-400">{firstName}</span>
            </h1>
            <p className="text-zinc-500 mt-1 text-sm">Here's your financial performance overview.</p>
          </div>
          <button
            onClick={() => navigate("/send")}
            className="self-start sm:self-auto bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20 text-sm whitespace-nowrap"
          >
            + New Transaction
          </button>
        </div>

        {error && (
          <div className="relative z-10 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>
        )}

      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 relative z-10">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pulse h-20" />
            ))
          ) : (
            <>
              <StatCard title="Balance"    value={fmt(balance)} />
              <StatCard title="Sent"       value={fmt(stats.totalSent)} />
              <StatCard title="Received"   value={fmt(stats.totalReceived)} />
              <StatCard title="Tx Count"   value={stats.count} />
            </>
          )}
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative z-10">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6">
            <h2 className="text-yellow-400 text-base md:text-lg font-semibold mb-4">Monthly Transactions</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="sent"     stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 3 }} />
                <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6">
            <h2 className="text-yellow-400 text-base md:text-lg font-semibold mb-4">Funds Distribution</h2>
            {loading ? (
              <div className="h-[200px] flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={80} innerRadius={45} paddingAngle={4}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#facc15" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip {...tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-3">
                  <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" /> Sent</div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Received</div>
                </div>
              </>
            )}
          </div>
        </div>

        
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6 relative z-10">
          <h2 className="text-yellow-400 text-base md:text-lg font-semibold mb-4">Recent Transactions</h2>

          
          <div className="md:hidden space-y-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => <div key={i} className="h-16 bg-zinc-800 rounded-xl animate-pulse" />)
            ) : transactions.length === 0 ? (
              <p className="text-zinc-600 text-sm text-center py-8">No transactions yet.</p>
            ) : (
              transactions.map((tx, i) => {
                const isSent = tx.type === "sent";
                const style  = statusStyles[tx.status?.toLowerCase()] ?? statusStyles.completed;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${isSent ? "bg-red-400/10" : "bg-green-400/10"}`}>
                      {isSent ? <span className="text-red-400 text-xs font-bold">↑</span> : <span className="text-green-400 text-xs font-bold">↓</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.recipient_name ?? tx.reference}</p>
                      <p className="text-zinc-500 text-xs">{new Date(tx.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${isSent ? "text-red-400" : "text-green-400"}`}>
                        {isSent ? "−" : "+"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${style.color} ${style.bg}`}>{style.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

         
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-zinc-500 text-sm border-b border-zinc-800">
                <tr>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Recipient</th>
                  <th className="pb-4 font-medium">Amount</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i}><td colSpan={4} className="py-3"><div className="h-8 bg-zinc-800 rounded-lg animate-pulse" /></td></tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-zinc-600 text-sm">No transactions yet.</td></tr>
                ) : (
                  transactions.map((tx, i) => {
                    const isSent = tx.type === "sent";
                    const style  = statusStyles[tx.status?.toLowerCase()] ?? statusStyles.completed;
                    return (
                      <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition">
                        <td className="py-4 text-zinc-500 text-sm">{new Date(tx.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}</td>
                        <td className="py-4 font-medium">{tx.recipient_name ?? tx.reference}</td>
                        <td className={`py-4 font-bold ${isSent ? "text-red-400" : "text-green-400"}`}>
                          {isSent ? "−" : "+"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${style.color} ${style.bg}`}>{style.label}</span>
                        </td>
                      </tr>
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