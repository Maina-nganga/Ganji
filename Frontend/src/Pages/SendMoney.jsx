import AppLayout from "../components/AppLayout";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Search, Send, CheckCircle, Loader, ArrowRight,
  User, X, AlertCircle, ChevronRight, Shield, Lock, Clock3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = { SEARCH: "search", CONFIRM: "confirm", SUCCESS: "success" };

export default function SendMoney() {
  const { token } = useAuth();
  const API = "http://127.0.0.1:5000";
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [step, setStep] = useState(STEPS.SEARCH);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [txResult, setTxResult] = useState(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetch(`${API}/api/wallet/`, { headers: authHeaders })
      .then((r) => r.json())
      .then((d) => setBalance(d.balance ?? 0))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`${API}/api/users/search?q=${encodeURIComponent(query)}`, { headers: authHeaders });
        const data = await res.json();
        setResults(data.users ?? []);
      } catch { setResults([]); }
      finally { setSearching(false); }
    }, 350);
  }, [query]);

  const selectRecipient = (user) => { setRecipient(user); setQuery(""); setResults([]); setError(""); };
  const clearRecipient = () => { setRecipient(null); setAmount(""); setNote(""); setError(""); setTimeout(() => searchRef.current?.focus(), 50); };

  const handleSend = async () => {
    setError("");
    const parsed = parseFloat(amount);
    if (!recipient) return setError("Please select a recipient.");
    if (!amount || isNaN(parsed) || parsed <= 0) return setError("Enter a valid amount.");
    if (balance !== null && parsed > balance) return setError("Insufficient balance.");
    setSending(true);
    try {
      const res = await fetch(`${API}/api/transactions/transfer`, {
        method: "POST", headers: authHeaders,
        body: JSON.stringify({ receiver_id: recipient.id, amount: parsed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Transfer failed.");
      setTxResult(data.transaction);
      setStep(STEPS.SUCCESS);
    } catch (err) { setError(err.message); }
    finally { setSending(false); }
  };

  const reset = () => { setStep(STEPS.SEARCH); setRecipient(null); setAmount(""); setNote(""); setError(""); setTxResult(null); setQuery(""); };

  const fmt = (n) => `KES ${Number(n).toLocaleString("en-KE", { minimumFractionDigits: 2 })}`;
  const initials = (name) => name?.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() ?? "??";

  const stepList = ["Recipient & Amount", "Review", "Done"];
  const stepIndex = step === STEPS.SEARCH ? 0 : step === STEPS.CONFIRM ? 1 : 2;

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white relative overflow-hidden">

     
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-yellow-400/3 blur-[150px] rounded-full pointer-events-none" />

  
        <div className="relative z-10 border-b border-zinc-800 bg-zinc-900/60 backdrop-blur px-8 py-3 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Ganji Bank · Fund Transfer</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Lock size={11} className="text-yellow-400" />
            <span>256-bit SSL Secured</span>
          </div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-10 flex gap-8">

          <div className="flex-1 min-w-0">

    
            <div className="mb-8">
              <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Payments</p>
              <h1 className="text-3xl font-bold">Send <span className="text-yellow-400">Money</span></h1>
            </div>

      
            <div className="flex items-center mb-8">
              {stepList.map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                      i < stepIndex ? "bg-yellow-400 border-yellow-400 text-black"
                      : i === stepIndex ? "bg-transparent border-yellow-400 text-yellow-400"
                      : "bg-transparent border-zinc-700 text-zinc-600"
                    }`}>
                      {i < stepIndex ? "✓" : i + 1}
                    </div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${i === stepIndex ? "text-yellow-400" : i < stepIndex ? "text-zinc-400" : "text-zinc-600"}`}>{s}</span>
                  </div>
                  {i < stepList.length - 1 && (
                    <div className={`w-10 h-px mx-3 ${i < stepIndex ? "bg-yellow-400" : "bg-zinc-800"}`} />
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">

         
              {step === STEPS.SEARCH && (
                <motion.div key="search" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} className="space-y-4">

             
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Beneficiary Details</p>
                    </div>
                    <div className="p-5">
                      <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recipient Name / Email</label>
                      {recipient ? (
                        <div className="flex items-center gap-4 p-4 bg-yellow-400/5 rounded-xl border border-yellow-400/20">
                          <div className="w-11 h-11 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold text-sm shrink-0">
                            {initials(recipient.full_name)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-white">{recipient.full_name}</p>
                            <p className="text-xs text-zinc-500">{recipient.email}</p>
                            <p className="text-xs text-yellow-400 mt-0.5 font-semibold">✓ Verified Ganji Account</p>
                          </div>
                          <button onClick={clearRecipient} className="text-zinc-600 hover:text-zinc-400 transition p-1">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="relative">
                          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                          <input
                            ref={searchRef} autoFocus type="text"
                            placeholder="Enter recipient name or email address"
                            value={query} onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20 transition"
                          />
                          {searching && <Loader size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 animate-spin" />}
                          <AnimatePresence>
                            {results.length > 0 && (
                              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden z-20 shadow-2xl">
                                <div className="px-4 py-2 border-b border-zinc-700">
                                  <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{results.length} account(s) found</p>
                                </div>
                                {results.map((u) => (
                                  <button key={u.id} onClick={() => selectRecipient(u)}
                                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-zinc-700/60 transition text-left border-b border-zinc-700/50 last:border-0">
                                    <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center text-yellow-400 text-xs font-bold shrink-0">
                                      {initials(u.full_name)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-semibold text-white truncate">{u.full_name}</p>
                                      <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-600 shrink-0" />
                                  </button>
                                ))}
                              </motion.div>
                            )}
                            {query.length >= 2 && !searching && results.length === 0 && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-5 text-center z-20 shadow-2xl">
                                <User size={22} className="mx-auto text-zinc-600 mb-1.5" />
                                <p className="text-sm text-zinc-500">No matching accounts found</p>
                                <p className="text-xs text-zinc-600 mt-0.5">Recipient must be a registered Ganji user</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-800 px-5 py-3">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Transfer Amount</p>
                    </div>
                    <div className="p-5 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Amount (KES)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold text-sm pointer-events-none">KES</span>
                          <input type="number" placeholder="0.00" min="1" step="0.01" value={amount}
                            onChange={(e) => { setAmount(e.target.value); setError(""); }}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-14 pr-4 py-4 text-white text-3xl font-bold focus:outline-none focus:border-yellow-400/60 focus:ring-1 focus:ring-yellow-400/20 transition placeholder:text-zinc-700"
                          />
                        </div>
                        {balance !== null && (
                          <p className="text-xs text-zinc-500 mt-2">
                            Available balance: <span className="font-bold text-white">{fmt(balance)}</span>
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Quick Select</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[500, 1000, 5000, 10000].map((q) => (
                            <button key={q} onClick={() => setAmount(String(q))}
                              className={`py-2 rounded-lg text-sm font-semibold transition border ${
                                amount === String(q)
                                  ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                                  : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                              }`}>
                              {q >= 1000 ? `${q / 1000}K` : q}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

          
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="border-b border-zinc-800 px-5 py-3 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Payment Narration</p>
                      <span className="text-xs text-zinc-600">Optional</span>
                    </div>
                    <div className="p-5">
                      <input type="text" placeholder="e.g. Rent payment, School fees, Invoice #1234"
                        maxLength={80} value={note} onChange={(e) => setNote(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/60 transition"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      <AlertCircle size={15} className="shrink-0" /> {error}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      const parsed = parseFloat(amount);
                      if (!recipient) return setError("Please select a recipient.");
                      if (!amount || isNaN(parsed) || parsed <= 0) return setError("Enter a valid amount.");
                      if (balance !== null && parsed > balance) return setError("Insufficient balance.");
                      setError(""); setStep(STEPS.CONFIRM);
                    }}
                    className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-bold text-base hover:bg-yellow-300 transition flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20">
                    Proceed to Review <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {step === STEPS.CONFIRM && (
                <motion.div key="confirm" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-4">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold">Review Transfer</h2>
                    <p className="text-sm text-zinc-500 mt-0.5">Confirm the details below before authorising this transaction.</p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
           
                    <div className="bg-yellow-400/10 border-b border-yellow-400/20 px-6 py-5 text-center">
                      <p className="text-yellow-400/70 text-xs uppercase tracking-widest mb-1">Transfer Amount</p>
                      <p className="text-4xl font-bold text-yellow-400">{fmt(parseFloat(amount))}</p>
                    </div>
               
                    <div className="divide-y divide-zinc-800">
                      {[
                        { label: "From", value: "My Ganji Wallet" },
                        { label: "To", value: recipient?.full_name, sub: recipient?.email },
                        { label: "Narration", value: note || "—" },
                        { label: "Transfer Fee", value: "KES 0.00", green: true },
                        { label: "Total Debit", value: fmt(parseFloat(amount)), bold: true },
                        { label: "Balance After", value: fmt((balance ?? 0) - parseFloat(amount)) },
                      ].map(({ label, value, sub, bold, green }) => (
                        <div key={label} className="flex justify-between items-center px-6 py-4">
                          <span className="text-sm text-zinc-500">{label}</span>
                          <div className="text-right">
                            <p className={`text-sm ${bold ? "font-bold text-white text-base" : green ? "text-green-400 font-semibold" : "font-semibold text-white"}`}>{value}</p>
                            {sub && <p className="text-xs text-zinc-600">{sub}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

          
                  <div className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                    <Shield size={15} className="text-yellow-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      By confirming, you authorise Ganji to debit your wallet immediately. Transfers are processed in real-time and <span className="text-white font-semibold">cannot be reversed</span> once confirmed.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      <AlertCircle size={15} className="shrink-0" /> {error}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button onClick={() => { setStep(STEPS.SEARCH); setError(""); }} disabled={sending}
                      className="flex-1 py-4 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-semibold text-sm disabled:opacity-50">
                      ← Go Back
                    </button>
                    <button onClick={handleSend} disabled={sending}
                      className="flex-1 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-yellow-400/20">
                      {sending ? <><Loader size={16} className="animate-spin" /> Processing...</> : <><Lock size={15} /> Confirm & Send</>}
                    </button>
                  </div>
                </motion.div>
              )}

        
              {step === STEPS.SUCCESS && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-center">
                    <div className="bg-green-500/10 border-b border-green-500/20 px-6 py-8">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, delay: 0.1 }}
                        className="w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={36} className="text-green-400" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white">Transfer Successful</h2>
                      <p className="text-zinc-500 text-sm mt-1">{fmt(txResult?.amount ?? parseFloat(amount))} sent to {recipient?.full_name}</p>
                    </div>
                    <div className="divide-y divide-zinc-800">
                      {[
                        { label: "Transaction Reference", value: txResult?.reference ?? "—", mono: true },
                        { label: "Status", value: "Completed", green: true },
                        { label: "Date & Time", value: new Date(txResult?.created_at ?? Date.now()).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }) },
                        { label: "Recipient", value: recipient?.full_name },
                      ].map(({ label, value, mono, green }) => (
                        <div key={label} className="flex justify-between items-center px-6 py-4">
                          <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
                          <span className={`text-sm font-semibold ${mono ? "font-mono text-xs text-zinc-300" : green ? "text-green-400" : "text-white"}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-center text-zinc-600">A confirmation has been recorded in your transaction history.</p>
                  <button onClick={reset}
                    className="w-full py-4 rounded-2xl bg-yellow-400 text-black font-bold hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20">
                    Make Another Transfer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

         
          <div className="w-64 shrink-0 space-y-4 hidden lg:block">

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Account Summary</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <p className="text-xs text-zinc-600">Available Balance</p>
                  <p className="text-2xl font-bold text-yellow-400">{balance !== null ? fmt(balance) : "—"}</p>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <p className="text-xs text-zinc-600">Account Status</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <p className="text-xs font-semibold text-zinc-300">Active & Verified</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="border-b border-zinc-800 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Transfer Limits</p>
              </div>
              <div className="p-4 space-y-3">
                {[
                  { label: "Min. Transfer", value: "KES 1.00" },
                  { label: "Max. Per Transfer", value: "KES 999,999" },
                  { label: "Daily Limit", value: "KES 2,000,000" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-xs text-zinc-600">{label}</span>
                    <span className="text-xs font-semibold text-zinc-300">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-zinc-900 border border-yellow-400/20 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <Shield size={13} className="text-yellow-400" />
                <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">Security</p>
              </div>
              {[
                { icon: Lock, text: "End-to-end encrypted" },
                { icon: Shield, text: "Fraud monitoring active" },
                { icon: Clock3, text: "Real-time processing" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={12} className="text-zinc-500 shrink-0" />
                  <p className="text-xs text-zinc-500">{text}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-zinc-600 text-center leading-relaxed px-2">
              Protected under Kenya's National Payment System Act. Support: <span className="text-zinc-400 font-semibold">0800 720 XXX</span>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}