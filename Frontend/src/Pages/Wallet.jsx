import AppLayout from "../components/AppLayout";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  ArrowDownLeft, ArrowUpRight, Plus, CreditCard,
  TrendingUp, Clock, ChevronRight, Eye, EyeOff, Zap,
  Smartphone, CheckCircle, Loader, Send, Search, User,
  X, AlertCircle, Shield, Lock, Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const MPESA_METHOD  = { id: "mpesa",  label: "M-Pesa",  icon: Smartphone,    description: "Via Safaricom M-Pesa" };
const DIRECT_DEP    = { id: "direct", label: "Direct",  icon: ArrowDownLeft, description: "Manual transfer" };
const DIRECT_WIT    = { id: "direct", label: "Direct",  icon: ArrowUpRight,  description: "Manual withdrawal" };

const SEND_STEPS = { SEARCH: "search", CONFIRM: "confirm", SUCCESS: "success" };

export default function Wallet() {
  const { token } = useAuth();
  const API = "http://127.0.0.1:5000";
  const authHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

 
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [activeCard, setActiveCard] = useState(0);
  const [balance, setBalance]       = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats]           = useState({ totalSent: 0, totalReceived: 0, thisMonth: 0 });
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  
  const [modal, setModal]           = useState(null); 
  const [payMethod, setPayMethod]   = useState("mpesa");
  const [amount, setAmount]         = useState("");
  const [phone, setPhone]           = useState("");
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [mpesaPending, setMpesaPending] = useState(false);


  const [sendStep, setSendStep]     = useState(SEND_STEPS.SEARCH);
  const [query, setQuery]           = useState("");
  const [results, setResults]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [recipient, setRecipient]   = useState(null);
  const [sendAmount, setSendAmount] = useState("");
  const [note, setNote]             = useState("");
  const [sendError, setSendError]   = useState("");
  const [sending, setSending]       = useState(false);
  const [txResult, setTxResult]     = useState(null);
  const searchRef  = useRef(null);
  const debounceRef = useRef(null);

  const fmt = (n) =>
    n == null ? "—" : `KES ${Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  const initials = (name) =>
    name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";


  const fetchWalletData = async () => {
    setLoading(true); setError("");
    try {
      const [balRes, txRes] = await Promise.all([
        fetch(`${API}/api/wallet/`,        { headers: authHeaders }),
        fetch(`${API}/api/transactions/`,  { headers: authHeaders }),
      ]);
      if (!balRes.ok) throw new Error("Failed to load balance");
      if (!txRes.ok)  throw new Error("Failed to load transactions");

      const balData = await balRes.json();
      const txData  = await txRes.json();
      setBalance(balData.balance);

      const txList = txData.transactions ?? [];
      setTransactions(txList.slice(0, 5));

      const now = new Date();
      const thisMonth = txList
        .filter((t) => { const d = new Date(t.created_at); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
        .reduce((s, t) => s + (t.type === "received" ? t.amount : -t.amount), 0);
      const totalSent     = txList.filter((t) => t.type === "sent")    .reduce((s, t) => s + t.amount, 0);
      const totalReceived = txList.filter((t) => t.type === "received").reduce((s, t) => s + t.amount, 0);
      setStats({ totalSent, totalReceived, thisMonth });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (token) fetchWalletData(); }, [token]);

  
  useEffect(() => {
    if (modal !== "send") return;
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res  = await fetch(`${API}/api/users/search?q=${encodeURIComponent(query)}`, { headers: authHeaders });
        const data = await res.json();
        setResults(data.users ?? []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 350);
  }, [query, modal]);

 
  const openModal = (type) => {
    setModal(type);
    setAmount(""); setPhone(""); setModalError(""); setSuccessMsg(""); setMpesaPending(false); setPayMethod("mpesa");
   
    setSendStep(SEND_STEPS.SEARCH); setQuery(""); setResults([]); setRecipient(null);
    setSendAmount(""); setNote(""); setSendError(""); setTxResult(null);
  };

  const closeModal = () => {
    setModal(null);
    setAmount(""); setPhone(""); setModalError(""); setMpesaPending(false); setSuccessMsg("");
    setSendStep(SEND_STEPS.SEARCH); setQuery(""); setResults([]); setRecipient(null);
    setSendAmount(""); setNote(""); setSendError(""); setTxResult(null);
  };

  
  const handleMpesaDeposit = async (parsed) => {
    if (!phone.trim()) return setModalError("Enter your M-Pesa phone number");
    const res  = await fetch(`${API}/api/mpesa/stk-push`, { method: "POST", headers: authHeaders, body: JSON.stringify({ amount: parsed, phone: phone.trim() }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "M-Pesa request failed");
    setMpesaPending(true);
    setSuccessMsg("STK push sent! Check your phone and enter your M-Pesa PIN.");
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const balRes = await fetch(`${API}/api/wallet/`, { headers: authHeaders });
        const balData = await balRes.json();
        if (balData.balance !== balance) {
          clearInterval(poll); setBalance(balData.balance);
          setSuccessMsg(`KES ${parsed.toFixed(2)} deposited via M-Pesa!`);
          setMpesaPending(false); await fetchWalletData(); setTimeout(() => closeModal(), 1800);
        }
      } catch (_) {}
      if (attempts >= 10) { clearInterval(poll); setMpesaPending(false); setSuccessMsg("Payment initiated. Your balance will update shortly."); setTimeout(() => closeModal(), 2500); }
    }, 4000);
  };

  const handleMpesaWithdraw = async (parsed) => {
    if (!phone.trim()) return setModalError("Enter your M-Pesa phone number");
    const res  = await fetch(`${API}/api/mpesa/withdraw`, { method: "POST", headers: authHeaders, body: JSON.stringify({ amount: parsed, phone: phone.trim() }) });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Withdrawal failed");
    setMpesaPending(true);
    setSuccessMsg("Withdrawal initiated! Funds will arrive on your M-Pesa shortly.");
    await fetchWalletData(); setTimeout(() => closeModal(), 3000);
  };

  const handleConfirm = async () => {
    setModalError("");
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) return setModalError("Enter a valid amount greater than 0");
    if (modal === "withdraw" && parsed > (balance ?? 0)) return setModalError("Insufficient balance");
    setModalLoading(true);
    try {
      if (modal === "deposit") {
        if (payMethod === "mpesa") { await handleMpesaDeposit(parsed); }
        else {
          const res = await fetch(`${API}/api/wallet/deposit`, { method: "POST", headers: authHeaders, body: JSON.stringify({ amount: parsed }) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Deposit failed");
          setSuccessMsg(`KES ${parsed.toFixed(2)} deposited successfully!`);
          await fetchWalletData(); setTimeout(() => closeModal(), 1500);
        }
        return;
      }
      if (modal === "withdraw") {
        if (payMethod === "mpesa") { await handleMpesaWithdraw(parsed); }
        else {
          const res = await fetch(`${API}/api/wallet/withdraw`, { method: "POST", headers: authHeaders, body: JSON.stringify({ amount: parsed }) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Withdrawal failed");
          setSuccessMsg(`KES ${parsed.toFixed(2)} withdrawn successfully!`);
          await fetchWalletData(); setTimeout(() => closeModal(), 1500);
        }
      }
    } catch (err) { setModalError(err.message); }
    finally { setModalLoading(false); }
  };


  const handleSend = async () => {
    setSendError("");
    const parsed = parseFloat(sendAmount);
    if (!recipient)                              return setSendError("Please select a recipient.");
    if (!sendAmount || isNaN(parsed) || parsed <= 0) return setSendError("Enter a valid amount.");
    if (balance !== null && parsed > balance)   return setSendError("Insufficient balance.");
    setSending(true);
    try {
      const res  = await fetch(`${API}/api/transactions/transfer`, { method: "POST", headers: authHeaders, body: JSON.stringify({ receiver_id: recipient.id, amount: parsed }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Transfer failed.");
      setTxResult(data.transaction);
      setSendStep(SEND_STEPS.SUCCESS);
      await fetchWalletData();
    } catch (err) { setSendError(err.message); }
    finally { setSending(false); }
  };

  const isMpesa = payMethod === "mpesa";
  const confirmLabel = () => {
    if (modalLoading) return "Processing...";
    if (mpesaPending) return "Pending...";
    if (modal === "deposit")  return isMpesa ? "Send STK Push" : "Confirm Deposit";
    if (modal === "withdraw") return isMpesa ? "Withdraw via M-Pesa" : "Confirm Withdrawal";
    return "Confirm";
  };

  const cards = [
    { label: "Main Wallet", balance: balance ?? 0, number: "**** **** **** 4291", color: "from-yellow-500 via-yellow-400 to-amber-300" },
    { label: "Savings Vault", balance: 0,           number: "**** **** **** 8832", color: "from-zinc-700 via-zinc-600 to-zinc-500" },
  ];

  const sendStepIndex = sendStep === SEND_STEPS.SEARCH ? 0 : sendStep === SEND_STEPS.CONFIRM ? 1 : 2;
  const sendStepList  = ["Recipient", "Review", "Done"];

  
  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-6 md:px-10 py-10 font-sans relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />

        
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-center mb-10">
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Your Wallet</p>
            <h1 className="text-3xl font-bold tracking-tight">Financial Hub</h1>
          </div>
          <button onClick={() => openModal("send")} className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
            <Plus size={16} /> New Transfer
          </button>
        </motion.div>

        {error && <div className="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">{error}</div>}

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-6">

         
            <div className="relative">
              <div className="flex gap-3 mb-5">
                {cards.map((c, i) => (
                  <button key={i} onClick={() => setActiveCard(i)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${activeCard === i ? "bg-yellow-400 text-black border-yellow-400" : "border-zinc-700 text-zinc-400 hover:border-zinc-500"}`}>
                    {c.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeCard} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.3 }}
                  className={`relative bg-gradient-to-br ${cards[activeCard].color} rounded-3xl p-7 shadow-2xl overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="absolute right-6 top-6 opacity-20"><CreditCard size={80} strokeWidth={0.8} /></div>
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
                    {loading ? <div className="h-12 w-48 bg-black/10 rounded-xl animate-pulse" /> : (
                      <p className="text-black text-5xl font-bold tracking-tight">
                        {balanceVisible ? fmt(cards[activeCard].balance) : "••••••"}
                      </p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

        
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Deposit",  icon: ArrowDownLeft, action: "deposit",  style: "bg-yellow-400 text-black hover:bg-yellow-300 shadow-yellow-400/20" },
                { label: "Withdraw", icon: ArrowUpRight,  action: "withdraw", style: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700" },
                { label: "Send",     icon: Send,          action: "send",     style: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700" },
              ].map(({ label, icon: Icon, action, style }) => (
                <motion.button key={label} whileTap={{ scale: 0.97 }} onClick={() => openModal(action)}
                  className={`flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm transition shadow-lg ${style}`}>
                  <Icon size={18} /> {label}
                </motion.button>
              ))}
            </div>

       
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Sent",     value: fmt(stats.totalSent),     icon: ArrowUpRight,  color: "text-red-400" },
                { label: "Total Received", value: fmt(stats.totalReceived), icon: ArrowDownLeft, color: "text-green-400" },
                { label: "This Month",     value: `${stats.thisMonth >= 0 ? "+" : ""}${fmt(stats.thisMonth)}`, icon: TrendingUp, color: "text-yellow-400" },
              ].map((stat, i) => (
                <motion.div key={stat.label} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
                  {loading ? <div className="h-12 bg-zinc-800 rounded-lg animate-pulse" /> : (
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
                <button className="text-yellow-400 text-xs flex items-center gap-1 hover:underline">See all <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-1">
                {loading ? Array(4).fill(0).map((_, i) => <div key={i} className="h-14 bg-zinc-800 rounded-2xl animate-pulse mb-2" />) :
                  transactions.length === 0 ? <p className="text-zinc-600 text-sm text-center py-10">No transactions yet.</p> :
                  transactions.map((tx, i) => (
                    <motion.div key={tx.id} custom={i} variants={cardVariants} initial="hidden" animate="visible"
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-zinc-800/60 transition cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-yellow-400 shrink-0">
                        {tx.recipient_name?.slice(0, 2).toUpperCase() ?? "??"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{tx.recipient_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Clock size={10} className="text-zinc-600" />
                          <p className="text-zinc-500 text-xs">{new Date(tx.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric" })}</p>
                          {tx.status === "pending" && (
                            <span className="text-[10px] bg-yellow-400/10 text-yellow-400 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                              <Zap size={8} /> Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm font-bold shrink-0 ${tx.type === "received" ? "text-green-400" : "text-red-400"}`}>
                        {tx.type === "received" ? "+" : "−"}KES {Number(tx.amount).toLocaleString("en-KE", { minimumFractionDigits: 2 })}
                      </p>
                    </motion.div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>

    
        <AnimatePresence>
          {modal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">

            
                {(modal === "deposit" || modal === "withdraw") && (
                  <>
                    <h2 className="text-xl font-bold mb-1 capitalize">{modal} Funds</h2>
                    <p className="text-zinc-500 text-sm mb-6">
                      {modal === "deposit" ? "Choose how you'd like to add funds." : `Available balance: ${fmt(balance)}`}
                    </p>

                    {!mpesaPending && (
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {(modal === "deposit" ? [MPESA_METHOD, DIRECT_DEP] : [MPESA_METHOD, DIRECT_WIT]).map(({ id, label, icon: Icon, description }) => (
                          <button key={id} onClick={() => { setPayMethod(id); setModalError(""); }}
                            className={`flex flex-col items-start gap-1.5 p-4 rounded-2xl border transition text-left ${payMethod === id ? "border-yellow-400 bg-yellow-400/5" : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/50"}`}>
                            <div className={`p-2 rounded-xl ${payMethod === id ? "bg-yellow-400/15" : "bg-zinc-700"}`}>
                              <Icon size={16} className={payMethod === id ? "text-yellow-400" : "text-zinc-400"} />
                            </div>
                            <p className={`text-sm font-semibold ${payMethod === id ? "text-yellow-400" : "text-white"}`}>{label}</p>
                            <p className="text-zinc-500 text-[11px] leading-tight">{description}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {isMpesa && !mpesaPending && !successMsg && (
                      <div className="flex items-start gap-3 mb-5 px-4 py-3 bg-green-500/8 border border-green-500/20 rounded-2xl">
                        <Smartphone size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <p className="text-green-300 text-xs leading-relaxed">
                          {modal === "deposit" ? "Enter your M-Pesa number and amount. You'll receive an STK push prompt to confirm." : "Enter your M-Pesa number. Funds will be sent directly to your phone after confirmation."}
                        </p>
                      </div>
                    )}
                    {successMsg && (
                      <div className="mb-5 px-4 py-3 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3">
                        {mpesaPending ? <Loader size={16} className="text-green-400 animate-spin shrink-0" /> : <CheckCircle size={16} className="text-green-400 shrink-0" />}
                        <p className="text-green-400 text-sm">{successMsg}</p>
                      </div>
                    )}
                    {modalError && <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">{modalError}</div>}

                    {isMpesa && !mpesaPending && (
                      <div className="relative mb-4">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium pointer-events-none">🇰🇪</div>
                        <input type="tel" placeholder="07XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={modalLoading}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-10 pr-4 py-4 text-white text-base font-medium focus:outline-none focus:border-yellow-400 transition disabled:opacity-50 placeholder:text-zinc-600" />
                      </div>
                    )}
                    {!mpesaPending && (
                      <div className="relative mb-6">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-lg pointer-events-none">KES</span>
                        <input type="number" placeholder="0.00" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} disabled={modalLoading || !!successMsg}
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-14 pr-4 py-4 text-white text-lg font-semibold focus:outline-none focus:border-yellow-400 transition disabled:opacity-50" />
                      </div>
                    )}
                    {mpesaPending && (
                      <div className="flex flex-col items-center gap-4 py-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                          <Loader size={28} className="text-green-400 animate-spin" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-semibold text-sm">{modal === "deposit" ? "Waiting for M-Pesa confirmation" : "Processing your withdrawal"}</p>
                          <p className="text-zinc-500 text-xs mt-1">{modal === "deposit" ? "Enter your PIN on your phone to complete" : "Funds will arrive on your M-Pesa shortly"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={closeModal} disabled={modalLoading} className="flex-1 py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-medium text-sm disabled:opacity-50">
                        {mpesaPending ? "Close" : "Cancel"}
                      </button>
                      {!mpesaPending && (
                        <button onClick={handleConfirm} disabled={modalLoading || !!successMsg}
                          className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2">
                          {modalLoading && <Loader size={14} className="animate-spin" />}
                          {confirmLabel()}
                        </button>
                      )}
                    </div>
                    {isMpesa && <p className="text-center text-zinc-600 text-[11px] mt-4">Powered by Safaricom M-Pesa · Lipa Na M-Pesa</p>}
                  </>
                )}

              
                {modal === "send" && (
                  <>
                
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-0.5">Payments</p>
                        <h2 className="text-xl font-bold">Send <span className="text-yellow-400">Money</span></h2>
                      </div>
                      <button onClick={closeModal} className="text-zinc-600 hover:text-zinc-400 transition"><X size={18} /></button>
                    </div>

                 
                    <div className="flex items-center mb-6">
                      {sendStepList.map((s, i) => (
                        <div key={s} className="flex items-center">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${i < sendStepIndex ? "bg-yellow-400 border-yellow-400 text-black" : i === sendStepIndex ? "bg-transparent border-yellow-400 text-yellow-400" : "bg-transparent border-zinc-700 text-zinc-600"}`}>
                              {i < sendStepIndex ? "✓" : i + 1}
                            </div>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider ${i === sendStepIndex ? "text-yellow-400" : i < sendStepIndex ? "text-zinc-400" : "text-zinc-600"}`}>{s}</span>
                          </div>
                          {i < sendStepList.length - 1 && <div className={`w-6 h-px mx-2 ${i < sendStepIndex ? "bg-yellow-400" : "bg-zinc-800"}`} />}
                        </div>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                 
                      {sendStep === SEND_STEPS.SEARCH && (
                        <motion.div key="s-search" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} className="space-y-4">

                         
                          <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl overflow-hidden">
                            <div className="border-b border-zinc-700 px-4 py-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Beneficiary</p>
                            </div>
                            <div className="p-4">
                              {recipient ? (
                                <div className="flex items-center gap-3 p-3 bg-yellow-400/5 rounded-xl border border-yellow-400/20">
                                  <div className="w-10 h-10 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-xs shrink-0">{initials(recipient.full_name)}</div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-bold text-white text-sm">{recipient.full_name}</p>
                                    <p className="text-xs text-zinc-500">{recipient.email}</p>
                                    <p className="text-[10px] text-yellow-400 mt-0.5 font-semibold">✓ Verified Ganji Account</p>
                                  </div>
                                  <button onClick={() => { setRecipient(null); setSendAmount(""); setNote(""); }} className="text-zinc-600 hover:text-zinc-400 p-1"><X size={14} /></button>
                                </div>
                              ) : (
                                <div className="relative">
                                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                                  <input ref={searchRef} autoFocus type="text" placeholder="Enter Mobile Number"
                                    value={query} onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition" />
                                  {searching && <Loader size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 animate-spin" />}
                                  <AnimatePresence>
                                    {results.length > 0 && (
                                      <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                        className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                                        {results.map((u) => (
                                          <button key={u.id} onClick={() => { setRecipient(u); setQuery(""); setResults([]); }}
                                            className="w-full flex items-center gap-3 px-3 py-3 hover:bg-zinc-700/60 transition text-left border-b border-zinc-700/50 last:border-0">
                                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">{initials(u.full_name)}</div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                                              <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                                            </div>
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                    {query.length >= 2 && !searching && results.length === 0 && (
                                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                        className="absolute top-full left-0 right-0 mt-1 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-center z-20 shadow-2xl">
                                        <User size={18} className="mx-auto text-zinc-600 mb-1" />
                                        <p className="text-xs text-zinc-500">No matching accounts found</p>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>

                       
                          <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl overflow-hidden">
                            <div className="border-b border-zinc-700 px-4 py-2.5">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Amount (KES)</p>
                            </div>
                            <div className="p-4 space-y-3">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm pointer-events-none">KES</span>
                                <input type="number" placeholder="0.00" min="1" step="0.01" value={sendAmount}
                                  onChange={(e) => { setSendAmount(e.target.value); setSendError(""); }}
                                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white text-2xl font-bold focus:outline-none focus:border-yellow-400/60 transition placeholder:text-zinc-700" />
                              </div>
                              {balance !== null && <p className="text-xs text-zinc-500">Balance: <span className="font-bold text-white">{fmt(balance)}</span></p>}
                              <div className="grid grid-cols-4 gap-2">
                                {[500, 1000, 5000, 10000].map((q) => (
                                  <button key={q} onClick={() => setSendAmount(String(q))}
                                    className={`py-1.5 rounded-lg text-xs font-semibold transition border ${sendAmount === String(q) ? "border-yellow-400 bg-yellow-400/10 text-yellow-400" : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"}`}>
                                    {q >= 1000 ? `${q / 1000}K` : q}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                        
                          <input type="text" placeholder="Narration (optional) — e.g. Rent, Invoice #12"
                            maxLength={80} value={note} onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition" />

                          {sendError && <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"><AlertCircle size={13} className="shrink-0" /> {sendError}</div>}

                          <button
                            onClick={() => {
                              const p = parseFloat(sendAmount);
                              if (!recipient) return setSendError("Please select a recipient.");
                              if (!sendAmount || isNaN(p) || p <= 0) return setSendError("Enter a valid amount.");
                              if (balance !== null && p > balance) return setSendError("Insufficient balance.");
                              setSendError(""); setSendStep(SEND_STEPS.CONFIRM);
                            }}
                            className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20">
                            Proceed to Review <Send size={15} />
                          </button>
                        </motion.div>
                      )}

                    
                      {sendStep === SEND_STEPS.CONFIRM && (
                        <motion.div key="s-confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                          <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl overflow-hidden">
                            <div className="bg-yellow-400/10 border-b border-yellow-400/20 px-5 py-4 text-center">
                              <p className="text-yellow-400/70 text-[10px] uppercase tracking-widest mb-1">Transfer Amount</p>
                              <p className="text-3xl font-bold text-yellow-400">{fmt(parseFloat(sendAmount))}</p>
                            </div>
                            <div className="divide-y divide-zinc-800">
                              {[
                                { label: "To",             value: recipient?.full_name, sub: recipient?.email },
                                { label: "Narration",      value: note || "—" },
                                { label: "Fee",            value: "KES 0.00", green: true },
                                { label: "Total Debit",    value: fmt(parseFloat(sendAmount)), bold: true },
                                { label: "Balance After",  value: fmt((balance ?? 0) - parseFloat(sendAmount)) },
                              ].map(({ label, value, sub, bold, green }) => (
                                <div key={label} className="flex justify-between items-center px-5 py-3">
                                  <span className="text-xs text-zinc-500">{label}</span>
                                  <div className="text-right">
                                    <p className={`text-sm ${bold ? "font-bold text-white" : green ? "text-green-400 font-semibold" : "font-semibold text-white"}`}>{value}</p>
                                    {sub && <p className="text-[11px] text-zinc-600">{sub}</p>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-start gap-2.5 p-3 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                            <Shield size={13} className="text-yellow-400 mt-0.5 shrink-0" />
                            <p className="text-xs text-zinc-400 leading-relaxed">Transfers are real-time and <span className="text-white font-semibold">cannot be reversed</span> once confirmed.</p>
                          </div>

                          {sendError && <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"><AlertCircle size={13} className="shrink-0" /> {sendError}</div>}

                          <div className="flex gap-3">
                            <button onClick={() => { setSendStep(SEND_STEPS.SEARCH); setSendError(""); }} disabled={sending}
                              className="flex-1 py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-semibold text-sm disabled:opacity-50">← Back</button>
                            <button onClick={handleSend} disabled={sending}
                              className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20">
                              {sending ? <><Loader size={14} className="animate-spin" /> Processing...</> : <><Lock size={13} /> Confirm & Send</>}
                            </button>
                          </div>
                        </motion.div>
                      )}

                    
                      {sendStep === SEND_STEPS.SUCCESS && (
                        <motion.div key="s-success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4 text-center">
                          <div className="bg-zinc-800/60 border border-zinc-700 rounded-2xl overflow-hidden">
                            <div className="bg-green-500/10 border-b border-green-500/20 px-5 py-6">
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
                                className="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-3">
                                <CheckCircle size={30} className="text-green-400" />
                              </motion.div>
                              <p className="font-bold text-white text-lg">Transfer Successful</p>
                              <p className="text-zinc-500 text-xs mt-1">{fmt(txResult?.amount ?? parseFloat(sendAmount))} sent to {recipient?.full_name}</p>
                            </div>
                            <div className="divide-y divide-zinc-800 text-left">
                              {[
                                { label: "Reference", value: txResult?.reference ?? "—", mono: true },
                                { label: "Status",    value: "Completed", green: true },
                                { label: "Date",      value: new Date(txResult?.created_at ?? Date.now()).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }) },
                              ].map(({ label, value, mono, green }) => (
                                <div key={label} className="flex justify-between items-center px-5 py-3">
                                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
                                  <span className={`text-sm font-semibold ${mono ? "font-mono text-xs text-zinc-300" : green ? "text-green-400" : "text-white"}`}>{value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button onClick={closeModal}
                            className="w-full py-3.5 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
                            Done
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}

              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}