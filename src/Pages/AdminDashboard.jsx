import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#2b2b1f] text-white px-8 py-10">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Admin <span className="text-yellow-400">Dashboard</span>
          </h1>
          <p className="text-gray-400 mt-2">
            System overview and platform statistics.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value="1,240" />
          <StatCard title="Active Wallets" value="980" />
          <StatCard title="Total Transactions" value="12,430" />
          <StatCard title="Revenue" value="$34,800" />
        </div>

        <div className="bg-[#1a1a1a]/80 border border-yellow-400/10 rounded-2xl p-6">
          <h2 className="text-yellow-400 text-lg font-semibold mb-4">
            Recent Activity
          </h2>
          <p className="text-gray-400">Latest platform transactions will appear here.</p>
        </div>

      </div>
    </AppLayout>
  );
}