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
    opacity: 1,
    y: 0,
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
  const [phone, setPhone] = useState(""); // ✅ ADDED FOR M-PESA

  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalSent: 0,
    totalReceived: 0,
    thisMonth: 0
  });

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
        .filter(t => {
          const d = new Date(t.created_at);
          return d.getMonth() === now.getMonth() &&
                 d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + (t.type === "received" ? t.amount : -t.amount), 0);

      const totalSent = txList
        .filter(t => t.type === "sent")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalReceived = txList
        .filter(t => t.type === "received")
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
    setPhone(""); // reset phone
    setModalError("");
    setSuccessMsg("");
  };

  const closeModal = () => {
    setModal(null);
    setAmount("");
    setPhone("");
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

    // ✅ M-PESA phone validation
    if (modal === "deposit") {
      if (!phone) {
        return setModalError("Phone number required for M-Pesa deposit");
      }
    }

    setModalLoading(true);

    try {
      let endpoint;
      let payload = { amount: parsed };

      // 🚀 M-PESA FLOW
      if (modal === "deposit") {
        endpoint = `${API}/api/wallet/mpesa/stk-push`;
        payload.phone = phone;
      } 
      // 💸 NORMAL WITHDRAW
      else {
        endpoint = `${API}/api/wallet/withdraw`;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `${modal} failed`);
      }

      setSuccessMsg(
        modal === "deposit"
          ? "STK Push sent! Check your phone to complete payment."
          : `$${parsed.toFixed(2)} withdrawn successfully!`
      );

      await fetchWalletData();

      setTimeout(() => closeModal(), 2000);

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
      <div className="min-h-screen bg-[#0c0c0e] text-white px-6 md:px-10 py-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <p className="text-zinc-500 text-sm uppercase">Your Wallet</p>
            <h1 className="text-3xl font-bold">Financial Hub</h1>
          </div>
        </div>

        {error && (
          <div className="mb-4 text-red-400">{error}</div>
        )}

        {/* ACTION BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={() => openModal("deposit")}
            className="bg-yellow-400 text-black py-3 rounded-xl font-bold"
          >
            <ArrowDownLeft className="inline mr-2" />
            Deposit (M-Pesa)
          </button>

          <button
            onClick={() => openModal("withdraw")}
            className="bg-zinc-800 py-3 rounded-xl font-bold"
          >
            <ArrowUpRight className="inline mr-2" />
            Withdraw
          </button>
        </div>

        {/* BALANCE */}
        <div className="text-3xl font-bold mb-10">
          Balance: {fmt(balance)}
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {modal && (
            <motion.div
              className="fixed inset-0 bg-black/70 flex items-center justify-center"
              onClick={closeModal}
            >
              <motion.div
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 p-6 rounded-2xl w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-4 capitalize">
                  {modal}
                </h2>

                {successMsg && (
                  <div className="text-green-400 mb-3">{successMsg}</div>
                )}

                {modalError && (
                  <div className="text-red-400 mb-3">{modalError}</div>
                )}

                {/* PHONE INPUT ONLY FOR DEPOSIT */}
                {modal === "deposit" && (
                  <input
                    type="text"
                    placeholder="Phone (2547XXXXXXXX)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-3 mb-3 rounded bg-zinc-800"
                  />
                )}

                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-3 mb-4 rounded bg-zinc-800"
                />

                <div className="flex gap-2">
                  <button
                    onClick={closeModal}
                    className="flex-1 bg-zinc-700 py-2 rounded"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={modalLoading}
                    className="flex-1 bg-yellow-400 text-black py-2 rounded font-bold"
                  >
                    {modalLoading ? "Processing..." : "Confirm"}
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