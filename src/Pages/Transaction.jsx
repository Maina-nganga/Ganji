import AppLayout from "../components/AppLayout";
import Card from "../components/Card";

export default function Transactions() {
  return (
    <AppLayout>
      <Card>
        <h2 className="text-xl font-bold text-gold mb-4">Recent Transactions</h2>
        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Sent to John</span>
            <span className="text-red-400">- $200</span>
          </div>
          <div className="flex justify-between">
            <span>Received from Alice</span>
            <span className="text-green-400">+ $500</span>
          </div>
        </div>
      </Card>
    </AppLayout>
  );
}
