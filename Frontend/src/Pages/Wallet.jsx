import AppLayout from "../components/AppLayout";

export default function Wallet() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#2b2b1f] text-white px-8 py-10">

        <h1 className="text-3xl font-bold mb-8">
          My <span className="text-yellow-400">Wallet</span>
        </h1>

        <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-300/10 border border-yellow-400/20 backdrop-blur-xl rounded-2xl p-8 mb-10 shadow-lg">
          <h2 className="text-gray-400 text-sm mb-2">Current Balance</h2>
          <p className="text-4xl font-bold text-yellow-400">$4,350.00</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button className="bg-yellow-400 text-black py-4 rounded-xl font-semibold hover:bg-yellow-300 transition">
            Deposit
          </button>
          <button className="border border-yellow-400 text-yellow-400 py-4 rounded-xl font-semibold hover:bg-yellow-400 hover:text-black transition">
            Withdraw
          </button>
        </div>

      </div>
    </AppLayout>
  );
}