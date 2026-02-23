import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
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
      <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#2b2b1f] text-white px-8 py-10">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold">
              Welcome Back, <span className="text-yellow-400">John</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Here's your financial performance overview.
            </p>
          </div>

          <button className="bg-yellow-400 text-black px-6 py-3 rounded-xl font-semibold hover:bg-yellow-300 transition">
            + New Transaction
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Wallet Balance" value="$4,350" />
          <StatCard title="Total Sent" value="$12,400" />
          <StatCard title="Total Received" value="$9,200" />
          <StatCard title="Transactions" value="84" />
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">

          {/* Line Chart */}
          <div className="lg:col-span-2 bg-[#1a1a1a]/80 border border-yellow-400/10 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">
              Monthly Transactions
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#aaa" />
                <YAxis stroke="#aaa" />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#facc15" strokeWidth={2} />
                <Line type="monotone" dataKey="received" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-[#1a1a1a]/80 border border-yellow-400/10 rounded-2xl p-6">
            <h2 className="text-yellow-400 text-lg font-semibold mb-6">
              Funds Distribution
            </h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  outerRadius={100}
                  label
                >
                  <Cell fill="#facc15" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-[#1a1a1a]/80 border border-yellow-400/10 rounded-2xl p-6">
          <h2 className="text-yellow-400 text-lg font-semibold mb-6">
            Recent Transactions
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-gray-400 border-b border-yellow-400/10">
                <tr>
                  <th className="pb-4">Date</th>
                  <th className="pb-4">Recipient</th>
                  <th className="pb-4">Amount</th>
                  <th className="pb-4">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-yellow-400/5">
                  <td className="py-4">Feb 20, 2026</td>
                  <td>Jane Doe</td>
                  <td className="text-red-400">- $250</td>
                  <td className="text-green-400">Completed</td>
                </tr>
                <tr>
                  <td className="py-4">Feb 18, 2026</td>
                  <td>Mike Ross</td>
                  <td className="text-green-400">+ $520</td>
                  <td className="text-yellow-400">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}