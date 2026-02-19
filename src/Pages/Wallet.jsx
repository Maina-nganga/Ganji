import AppLayout from "../components/AppLayout";
import Card from "../components/Card";
import Button from "../components/Button";

export default function Wallet() {
  return (
    <AppLayout>
      <Card>
        <h2 className="text-xl font-bold text-gold mb-4">Wallet Balance</h2>
        <p className="text-3xl font-bold">$4,350</p>

        <div className="mt-6 flex gap-4">
          <Button>Add Funds</Button>
          <button className="border border-gold px-6 py-3 rounded-xl">
            Withdraw
          </button>
        </div>
      </Card>
    </AppLayout>
  );
}
