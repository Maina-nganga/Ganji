import AppLayout from "../components/AppLayout";
import Card from "../components/Card";

export default function Beneficiaries() {
  return (
    <AppLayout>
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <h3 className="font-semibold">John Doe</h3>
          <p className="text-gray-400">+254700000000</p>
          <div className="flex gap-4 mt-4">
            <button className="text-gold">Send</button>
            <button>Edit</button>
            <button className="text-red-500">Delete</button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
