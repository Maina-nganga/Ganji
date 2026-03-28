import AppLayout from "../components/AppLayout";
import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  CreditCard,
  TrendingUp,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const transactions = [
  { id: 1, name: "Jane Doe", type: "sent", amount: -250, date: "Feb 20", status: "completed", avatar: "JD" },
  { id: 2, name: "Mike Ross", type: "received", amount: +520, date: "Feb 18", status: "pending", avatar: "MR" },
  { id: 3, name: "Sarah Kim", type: "received", amount: +1200, date: "Feb 15", status: "completed", avatar: "SK" },
  { id: 4, name: "Netflix", type: "sent", amount: -15.99, date: "Feb 12", status: "completed", avatar: "NF" },
  { id: 5, name: "Alex Mugo", type: "sent", amount: -300, date: "Feb 10", status: "completed", avatar: "AM" },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Wallet() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const [modal, setModal] = useState(null); // "deposit" | "withdraw" | null

  const cards = [
    { label: "Main Wallet", balance: 4350.0, number: "**** **** **** 4291", color: "from-yellow-500 via-yellow-400 to-amber-300" },
    { label: "Savings Vault", balance: 12800.5, number: "**** **** **** 8832", color: "from-zinc-700 via-zinc-600 to-zinc-500" },
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-6 md:px-10 py-10 font-sans relative overflow-hidden">

       
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

       
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-10">
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Your Wallet</p>
            <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
          </div>
          <button className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            <Plus size={16} /> New Transfer
          </button>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <div className="relative">
              <div className="flex gap-3 mb-5">
                {cards.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${activeCard === i ? "bg-yellow-400 text-black border-yellow-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-gradient-to-br ${cards[activeCard].color} rounded-3xl p-7 shadow-2xl overflow-hidden`}
                >
                  
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="absolute right-6 top-6 opacity-20">
                    <CreditCard size={80} strokeWidth={0.8} />
                  </div>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-black/60 text-xs font-semibold uppercase tracking-widest">{cards[activeCard].label}</p>
                      <p className="text-black/80 text-sm mt-0.5">{cards[activeCard].number}</p>
                    </div>
                    <button onClick={() => setBalanceVisible(!balanceVisible)} className="text-black/50 hover:text-black/80 transition">
                      {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <div>
                    <p className="text-black/60 text-xs uppercase tracking-widest mb-1">Available Balance</p>
                    <p className="text-black text-5xl font-bold tracking-tight">
                      {balanceVisible ? `$${cards[activeCard].balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "••••••"}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Deposit", icon: ArrowDownLeft, action: "deposit", style: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-400/20" },
                { label: "Withdraw", icon: ArrowUpRight, action: "withdraw", style: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700" },
              ].map(({ label, icon: Icon, action, style }) => (
                <motion.button
                  key={label}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setModal(action)}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition shadow-lg ${style}`}
                >
                  <Icon size={18} /> {label}
                </motion.button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Sent", value: "$12,400", icon: ArrowUpRight, color: "text-red-400" },
                { label: "Total Received", value: "$9,200", icon: ArrowDownLeft, color: "text-green-400" },
                { label: "This Month", value: "+$840", icon: TrendingUp, color: "text-yellow-400" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                >
                  <stat.icon size={16} className={`${stat.color} mb-3`} />
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>

         
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-bold text-lg">Recent Activity</h2>
                <button className="text-yellow-400 text-xs flex items-center gap-1 hover:underline">
                  See all <ChevronRight size={12} />
                </button>
              </div>

              <div className="space-y-1">
                {transactions.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/60 transition cursor-pointer group"
                  >
                 
                    <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">
                      {tx.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tx.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={10} className="text-zinc-600" />
                        <p className="text-zinc-500 text-xs">{tx.date}</p>
                        {tx.status === "pending" && (
                          <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                            <Zap size={8} /> Pending
                          </span>
                        )}
                      </div>
                    </div>

                    <p className={`text-sm font-bold shrink-0 ${tx.amount > 0 ? "text-green-400" : "text-red-400"}`}>
                      {tx.amount > 0 ? "+" : ""}${Math.abs(tx.amount).toFixed(2)}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        
        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModal(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-1 capitalize">{modal} Funds</h2>
                <p className="text-zinc-500 text-sm mb-6">Enter the amount you wish to {modal}.</p>

                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-lg">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-9 pr-4 py-4 text-white text-lg font-semibold focus:outline-none focus:border-yellow-400 transition"
                  />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setModal(null)} className="flex-1 py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-medium text-sm">
                    Cancel
                  </button>
                  <button className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition">
                    Confirm {modal.charAt(0).toUpperCase() + modal.slice(1)}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}