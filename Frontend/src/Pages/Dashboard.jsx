import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";
import { useAuth } from "../context/AuthContext";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

export default function Dashboard() {
  const { user, token } = useAuth();
  const firstName = user?.full_name?.split(" ")[0] ?? "User";

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0, count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API = "http://127.0.0.1:5000";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const [balanceRes, txRes] = await Promise.all([
          fetch(`${API}/api/wallet/`, { headers: authHeaders }),
          fetch(`${API}/api/transactions/`, { headers: authHeaders }),
        ]);

        if (!balanceRes.ok) throw new Error("Failed to load balance");
        if (!txRes.ok) throw new Error("Failed to load transactions");

        const balanceData = await balanceRes.json();
        const txData = await txRes.json();

        setBalance(balanceData.balance);

        const txList = txData.transactions ?? [];
        setTransactions(txList.slice(0, 5));
        const sent = txList
          .filter((t) => t.type === "sent")
          .reduce((sum, t) => sum + t.amount, 0);
        const received = txList
          .filter((t) => t.type === "received")
          .reduce((sum, t) => sum + t.amount, 0);

        setStats({ totalSent: sent, totalReceived: received, count: txList.length });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [token]);
  const pieData = [
    { name: "Sent", value: stats.totalSent || 0 },
    { name: "Received", value: stats.totalReceived || 0 },
  ];
  const trendData = [
    { month: "Jan", sent: 400, received: 240 },
    { month: "Feb", sent: 300, received: 139 },
    { month: "Mar", sent: 500, received: 380 },
    { month: "Apr", sent: 478, received: 290 },
    { month: "May", sent: 589, received: 480 },
    { month: "Jun", sent: 639, received: 520 },
  ];
  const fmt = (n) =>
    n == null ? "—" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  const statusStyles = {
    completed: { color: "text-green-400", bg: "bg-green-400/10", label: "Completed" },
    pending:   { color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Pending" },
    failed:    { color: "text-red-400", bg: "bg-red-400/10", label: "Failed" },
  };
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-8 relative py-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Overview</p>
            <h1 className="text-4xl font-bold">
              Welcome Back, <span className="text-yellow-400">{firstName}</span>
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Here's your financial performance overview.</p>
          </div>
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            + New Transaction
          </button>
        </div>
        {error && (
          <div className="relative z-10 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        <div className="grid md:grid-cols-4 gap-6 mb-10 relative z-10">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 animate-pulse h-24" />
            ))
          ) : (
            <>
              <StatCard title="Wallet Balance" value={fmt(balance)} />
              <StatCard title="Total Sent" value={fmt(stats.totalSent)} />
              <StatCard title="Total Received" value={fmt(stats.totalReceived)} />
              <StatCard title="Transactions" value={stats.count} />
            </>
          )}
        </div>     
        <div className="grid lg:grid-cols-3 gap-8 mb-10 relative z-10">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">Monthly Transactions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="sent" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 3 }} />
                <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">Funds Distribution</h2>
            {loading ? (
              <div className="h-[220px] flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" outerRadius={90} innerRadius={50} paddingAngle={4}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#facc15" />
                      <Cell fill="#22c55e" />
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm text-zinc-400"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Sent</div>
                  <div className="flex items-center gap-2 text-sm text-zinc-400"><span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Received</div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 relative z-10">
          <h2 className="text-yellow-400 text-lg font-semibold mb-6">Recent Transactions</h2>
          <div className="overflow-x-auto">
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
                    <tr key={i}>
                      <td colSpan={4} className="py-3">
                        <div className="h-8 bg-zinc-800 rounded-lg animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-zinc-600 text-sm">
                      No transactions yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx, i) => {
                    const isSent = tx.type === "sent";
                    const style = statusStyles[tx.status?.toLowerCase()] ?? statusStyles.completed;
                    return (
                      <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition">
                        <td className="py-4 text-zinc-500 text-sm">
                          {new Date(tx.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-4 font-medium">{tx.recipient_name ?? tx.reference}</td>
                        <td className={`py-4 font-bold ${isSent ? "text-red-400" : "text-green-400"}`}>
                          {isSent ? "-" : "+"}${Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="py-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${style.color} ${style.bg}`}>
                            {style.label}
                          </span>
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