export default function Topbar() {
  return (
    <div className="flex justify-between items-center p-6 border-b border-gold/20 bg-[#0E0E10] relative">
      {/* Gold Glow Behind Balance */}
      <div className="absolute right-6 top-1/2 transform -translate-y-1/2 w-40 h-12 bg-gold opacity-20 blur-[100px] rounded-xl -z-10"></div>

      <h2 className="text-lg font-semibold text-white">Welcome back 👋</h2>
      
      <div className="bg-gold text-black px-4 py-2 rounded-xl font-semibold shadow-[0_0_15px_rgba(255,215,0,0.5)]">
        $4,350
      </div>
    </div>
  );
}