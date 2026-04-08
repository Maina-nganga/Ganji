import AppLayout from "../components/AppLayout";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ArrowDownLeft, ArrowUpRight, Plus, CreditCard,
  TrendingUp, Clock, ChevronRight, Eye, EyeOff, Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }),
};

export default function Wallet() {
  const { token } = useAuth();
  const API = "http://127.0.0.1:5000";
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const [modal, setModal] = useState(null);     
  const [amount, setAmount] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0, thisMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cards = [
    {
      label: "Main Wallet",
      balance: balance ?? 0,
      number: "**** **** **** 4291",
      color: "from-yellow-500 via-yellow-400 to-amber-300",
    },
    {
      label: "Savings Vault",
      balance: 0,
      number: "**** **** **** 8832",
      color: "from-zinc-700 via-zinc-600 to-zinc-500",
    },
  ];

  
  const fetchWalletData = async () => {
    setLoading(true);
    setError("");
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`${API}/api/wallet/`, { headers: authHeaders }),
        fetch(`${API}/api/transactions/`, { headers: authHeaders }),
      ]);

      if (!balRes.ok) throw new Error("Failed to load balance");
      if (!txRes.ok) throw new Error("Failed to load transactions");

      const balData = await balRes.json();
      const txData = await txRes.json();

      setBalance(balData.balance);

      const txList = txData.transactions ?? [];
      setTransactions(txList.slice(0, 5));

      const now = new Date();
      const thisMonth = txList
        .filter((t) => {
          const d = new Date(t.created_at);
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + (t.type === "received" ? t.amount : -t.amount), 0);

      const totalSent = txList
        .filter((t) => t.type === "sent")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalReceived = txList
        .filter((t) => t.type === "received")
        .reduce((sum, t) => sum + t.amount, 0);

      setStats({ totalSent, totalReceived, thisMonth });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchWalletData();
  }, [token]);


  const openModal = (type) => {
    setModal(type);
    setAmount("");
    setModalError("");
    setSuccessMsg("");
  };

  const closeModal = () => {
    setModal(null);
    setAmount("");
    setModalError("");
  };

 
  const handleConfirm = async () => {
    setModalError("");
    const parsed = parseFloat(amount);

    if (!amount || isNaN(parsed) || parsed <= 0) {
      return setModalError("Enter a valid amount greater than 0");
    }

    if (modal === "withdraw" && parsed > (balance ?? 0)) {
      return setModalError("Insufficient balance");
    }

    setModalLoading(true);

    try {
      const endpoint =
        modal === "deposit"
          ? `${API}/api/wallet/deposit`
          : `${API}/api/wallet/withdraw`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ amount: parsed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `${modal} failed`);
      }

      setSuccessMsg(
        modal === "deposit"
          ? `$${parsed.toFixed(2)} deposited successfully!`
          : `$${parsed.toFixed(2)} withdrawn successfully!`
      );

 
      await fetchWalletData();

     
      setTimeout(() => closeModal(), 1500);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const fmt = (n) =>
    n == null
      ? "—"
      : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-6 md:px-10 py-10 font-sans relative overflow-hidden">

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-10"
        >
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Your Wallet</p>
            <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
          </div>
          <button className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            <Plus size={16} /> New Transfer
          </button>
        </motion.div>

        {error && (
          <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">

          
            <div className="relative">
              <div className="flex gap-3 mb-5">
                {cards.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCard(i)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                      activeCard === i
                        ? "bg-yellow-400 text-black border-yellow-400"
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
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
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                    backgroundSize: "24px 24px"
                  }} />
                  <div className="absolute right-6 top-6 opacity-20">
                    <CreditCard size={80} strokeWidth={0.8} />
                  </div>

                  <div className="flex justify-between items-start mb-10">
                    <div>
                      <p className="text-black/60 text-xs font-semibold uppercase tracking-widest">
                        {cards[activeCard].label}
                      </p>
                      <p className="text-black/80 text-sm mt-0.5">{cards[activeCard].number}</p>
                    </div>
                    <button
                      onClick={() => setBalanceVisible(!balanceVisible)}
                      className="text-black/50 hover:text-black/80 transition"
                    >
                      {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>

                  <div>
                    <p className="text-black/60 text-xs uppercase tracking-widest mb-1">
                      Available Balance
                    </p>
                    {loading ? (
                      <div className="h-12 w-48 bg-black/10 rounded-xl animate-pulse" />
                    ) : (
                      <p className="text-black text-5xl font-bold tracking-tight">
                        {balanceVisible
                          ? fmt(cards[activeCard].balance)
                          : "••••••"}
                      </p>
                    )}
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
                  onClick={() => openModal(action)}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition shadow-lg ${style}`}
                >
                  <Icon size={18} /> {label}
                </motion.button>
              ))}
            </div>

           
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Sent", value: fmt(stats.totalSent), icon: ArrowUpRight, color: "text-red-400" },
                { label: "Total Received", value: fmt(stats.totalReceived), icon: ArrowDownLeft, color: "text-green-400" },
                {
                  label: "This Month",
                  value: `${stats.thisMonth >= 0 ? "+" : ""}${fmt(stats.thisMonth)}`,
                  icon: TrendingUp,
                  color: "text-yellow-400"
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4"
                >
                  {loading ? (
                    <div className="h-12 bg-zinc-800 rounded-lg animate-pulse" />
                  ) : (
                    <>
                      <stat.icon size={16} className={`${stat.color} mb-3`} />
                      <p className="text-white font-bold text-lg">{stat.value}</p>
                      <p className="text-zinc-500 text-xs mt-0.5">{stat.label}</p>
                    </>
                  )}
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
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-14 bg-zinc-800 rounded-2xl animate-pulse mb-2" />
                  ))
                ) : transactions.length === 0 ? (
                  <p className="text-zinc-600 text-sm text-center py-10">No transactions yet.</p>
                ) : (
                  transactions.map((tx, i) => (
                    <motion.div
                      key={tx.id}
                      custom={i}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/60 transition cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">
                        {tx.recipient_name?.slice(0, 2).toUpperCase() ?? "??"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tx.recipient_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={10} className="text-zinc-600" />
                          <p className="text-zinc-500 text-xs">
                            {new Date(tx.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric"
                            })}
                          </p>
                          {tx.status === "pending" && (
                            <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                              <Zap size={8} /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm font-bold shrink-0 ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "received" ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                      </p>
                    </motion.div>
                  ))
                )}
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
              onClick={closeModal}
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
                <p className="text-zinc-500 text-sm mb-6">
                  {modal === "deposit"
                    ? "Add funds to your wallet."
                    : `Available balance: ${fmt(balance)}`}
                </p>

                
                {successMsg && (
                  <div className="mb-4 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm text-center">
                    {successMsg}
                  </div>
                )}

             
                {modalError && (
                  <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {modalError}
                  </div>
                )}

                <div className="relative mb-6">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-lg">$</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={modalLoading || !!successMsg}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-9 pr-4 py-4 text-white text-lg font-semibold focus:outline-none focus:border-yellow-400 transition disabled:opacity-50"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    disabled={modalLoading}
                    className="flex-1 py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-medium text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={modalLoading || !!successMsg}
                    className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50"
                  >
                    {modalLoading
                      ? "Processing..."
                      : `Confirm ${modal.charAt(0).toUpperCase() + modal.slice(1)}`}
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