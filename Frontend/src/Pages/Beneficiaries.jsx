import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, Trash2, Send, Phone, Building2, CreditCard, Loader } from "lucide-react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "../context/AuthContext";

export default function Beneficiaries() {
  const { token } = useAuth();
  const API = "http://127.0.0.1:5000";
  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "", account: "", bank: "", phone: "",
  });

  const [deleteId, setDeleteId] = useState(null);

  
  const fetchBeneficiaries = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/beneficiaries/`, { headers: authHeaders });
      if (!res.ok) throw new Error("Failed to load beneficiaries");
      const data = await res.json();
      setBeneficiaries(data.beneficiaries ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchBeneficiaries();
  }, [token]);

  
  const handleAdd = async () => {
    setFormError("");
    if (!newBeneficiary.name.trim() || !newBeneficiary.account.trim()) {
      return setFormError("Name and account number are required");
    }

    setFormLoading(true);
    try {
      const res = await fetch(`${API}/api/beneficiaries/`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify(newBeneficiary),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add beneficiary");

      setBeneficiaries((prev) => [data.beneficiary, ...prev]);
      setShowModal(false);
      setNewBeneficiary({ name: "", account: "", bank: "", phone: "" });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

 
  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      const res = await fetch(`${API}/api/beneficiaries/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error("Failed to remove beneficiary");
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = beneficiaries.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.account.toLowerCase().includes(search.toLowerCase()) ||
    b.bank?.toLowerCase().includes(search.toLowerCase())
  );

  const field = (key, placeholder, icon, type = "text") => (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={newBeneficiary[key]}
        onChange={(e) => setNewBeneficiary({ ...newBeneficiary, [key]: e.target.value })}
        disabled={formLoading}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl pl-11 pr-4 py-4 text-white text-sm focus:outline-none focus:border-yellow-400 transition disabled:opacity-50 placeholder:text-zinc-600"
      />
    </div>
  );

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#0c0c0e] text-white px-8 py-10 relative overflow-hidden">

        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[180px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center mb-10">
          <div>
            <p className="text-zinc-500 text-sm tracking-widest uppercase mb-1">Contacts</p>
            <h1 className="text-3xl font-bold">
              Your <span className="text-yellow-400">Beneficiaries</span>
            </h1>
          </div>
          <button
            onClick={() => { setShowModal(true); setFormError(""); }}
            className="flex items-center gap-2 bg-yellow-400 text-black px-5 py-3 rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-lg shadow-yellow-400/20"
          >
            <UserPlus size={16} /> Add Beneficiary
          </button>
        </div>

      
        <div className="relative z-10 mb-8">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by name, account, or bank..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-yellow-400/50 transition"
          />
        </div>

        {error && (
          <div className="relative z-10 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

       
        <div className="relative z-10 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-44 bg-zinc-900 border border-zinc-800 rounded-2xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-zinc-600 text-sm">
                {beneficiaries.length === 0
                  ? "No beneficiaries yet. Add one to get started."
                  : "No beneficiaries match your search."}
              </p>
            </div>
          ) : (
            filtered.map((b) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-zinc-900 border border-zinc-800 hover:border-yellow-400/30 rounded-2xl p-6 transition group"
              >
             
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 font-bold text-lg shrink-0">
                    {b.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-white truncate">{b.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{b.account}</p>
                  </div>
                </div>

             
                <div className="space-y-1.5 mb-5">
                  {b.bank && (
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Building2 size={12} className="shrink-0" />
                      {b.bank}
                    </div>
                  )}
                  {b.phone && (
                    <div className="flex items-center gap-2 text-zinc-400 text-xs">
                      <Phone size={12} className="shrink-0" />
                      {b.phone}
                    </div>
                  )}
                </div>

               
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-yellow-400 text-black text-xs font-semibold hover:bg-yellow-300 transition">
                    <Send size={12} /> Send Money
                  </button>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deleteId === b.id}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-700 text-zinc-500 hover:border-red-500 hover:text-red-400 transition disabled:opacity-50"
                  >
                    {deleteId === b.id
                      ? <Loader size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-md"
              >
                <h2 className="text-xl font-bold mb-1">
                  Add <span className="text-yellow-400">Beneficiary</span>
                </h2>
                <p className="text-zinc-500 text-sm mb-6">
                  Save someone you send money to regularly.
                </p>

                {formError && (
                  <div className="mb-5 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                    {formError}
                  </div>
                )}

                <div className="space-y-4">
                  {field("name",    "Full Name *",      <UserPlus size={15} />)}
                  {field("account", "Account Number *", <CreditCard size={15} />)}
                  {field("bank",    "Bank Name",        <Building2 size={15} />)}
                  {field("phone",   "Phone Number",     <Phone size={15} />, "tel")}
                </div>

                <div className="flex gap-3 mt-7">
                  <button
                    onClick={() => setShowModal(false)}
                    disabled={formLoading}
                    className="flex-1 py-3.5 rounded-2xl border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition font-medium text-sm disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAdd}
                    disabled={formLoading}
                    className="flex-1 py-3.5 rounded-2xl bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {formLoading && <Loader size={14} className="animate-spin" />}
                    {formLoading ? "Saving..." : "Save Beneficiary"}
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