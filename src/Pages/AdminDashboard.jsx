import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard"

export default function AdminDashboard() {
  return (
    <AppLayout>
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$45,200" />
        <StatCard title="Total Users" value="1,240" />
        <StatCard title="Transactions" value="8,430" />
        <StatCard title="Growth Rate" value="+12%" />
      </div>
    </AppLayout>
  );
}
