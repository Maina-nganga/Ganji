export default function StatCard({ title, value }) {
  return (
    <div className="bg-[#1a1a1a]/80 border border-yellow-400/10 backdrop-blur-lg rounded-2xl p-6 hover:border-yellow-400/30 transition duration-300 shadow-lg">
      <h3 className="text-gray-400 text-sm mb-3">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
}