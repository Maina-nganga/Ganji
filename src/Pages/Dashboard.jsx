import AppLayout from "../components/AppLayout";
import StatCard from "../components/statCard";

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Wallet Balance" value="$4,350" />
        <StatCard title="Total Sent" value="$12,400" />
        <StatCard title="Total Received" value="$9,200" />
        <StatCard title="Transactions" value="84" />
      </div>
    </AppLayout>
  );
}
