import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";

const trendData = [
  { month: "Jan", sent: 400, received: 240 },
  { month: "Feb", sent: 300, received: 139 },
  { month: "Mar", sent: 500, received: 380 },
  { month: "Apr", sent: 478, received: 290 },
  { month: "May", sent: 589, received: 480 },
  { month: "Jun", sent: 639, received: 520 },
];

const pieData = [
  { name: "Sent", value: 12400 },
  { name: "Received", value: 9200 },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-8 relative py-10 overflow-hidden">

        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Overview</p>
            <h1 className="text-4xl font-bold">
              Welcome Back, <span className="text-yellow-400">John</span>
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">Here's your financial performance overview.</p>
          </div>
          <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            + New Transaction
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10 relative z-10">
          <StatCard title="Wallet Balance" value="$4,350" />
          <StatCard title="Total Sent" value="$12,400" />
          <StatCard title="Total Received" value="$9,200" />
          <StatCard title="Transactions" value="84" />
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10 relative z-10">
          <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">Monthly Transactions</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="month" stroke="#71717a" tick={{ fontSize: 12 }} />
                <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#18181b", border: "1px solid #3f3f46", borderRadius: "12px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="sent" stroke="#facc15" strokeWidth={2} dot={{ fill: "#facc15", r: 3 }} />
                <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} dot={{ fill: "#22c55e", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">Funds Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" outerRadius={90} innerRadius={50} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
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
          </div>
        </div>

        {/* Recent Transactions */}
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
                {[
                  { date: "Feb 20, 2026", name: "Jane Doe", amount: "- $250", amountColor: "text-red-400", status: "Completed", statusColor: "text-green-400", statusBg: "bg-green-400/10" },
                  { date: "Feb 18, 2026", name: "Mike Ross", amount: "+ $520", amountColor: "text-green-400", status: "Pending", statusColor: "text-yellow-400", statusBg: "bg-yellow-400/10" },
                ].map((tx, i) => (
                  <tr key={i} className="border-b border-zinc-800/60 hover:bg-zinc-800/40 transition">
                    <td className="py-4 text-zinc-500 text-sm">{tx.date}</td>
                    <td className="py-4 font-medium">{tx.name}</td>
                    <td className={`py-4 font-bold ${tx.amountColor}`}>{tx.amount}</td>
                    <td className="py-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${tx.statusColor} ${tx.statusBg}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}