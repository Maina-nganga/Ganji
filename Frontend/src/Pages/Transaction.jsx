import AppLayout from "../components/AppLayout";

export default function Transactions() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#2b2b1f] text-white px-8 py-10">

        <h1 className="text-3xl font-bold mb-8">
          Transaction <span className="text-yellow-400">History</span>
        </h1>

        <div className="bg-[#1a1a1a]/80 border border-yellow-400/10 rounded-2xl p-6 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-yellow-400 border-b border-yellow-400/20">
              <tr>
                <th className="pb-3">Date</th>
                <th className="pb-3">Recipient</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              <tr className="border-b border-yellow-400/10">
                <td className="py-4">Feb 19, 2026</td>
                <td>Jane Doe</td>
                <td>$250</td>
                <td className="text-green-400">Completed</td>
              </tr>
              <tr>
                <td className="py-4">Feb 18, 2026</td>
                <td>Mike Ross</td>
                <td>$120</td>
                <td className="text-yellow-400">Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}