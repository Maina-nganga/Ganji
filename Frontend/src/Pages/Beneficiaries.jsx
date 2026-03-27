import { useState } from "react";
import { motion } from "framer-motion";
import AppLayout from "../components/AppLayout";

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: "John Mwangi", account: "GAN-928374", bank: "Equity Bank" },
    { id: 2, name: "Sarah Wanjiku", account: "GAN-112233", bank: "KCB Bank" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: "",
    account: "",
    bank: "",
  });

  const handleAdd = (e) => {
    e.preventDefault();
    setBeneficiaries([...beneficiaries, { ...newBeneficiary, id: Date.now() }]);
    setShowModal(false);
    setNewBeneficiary({ name: "", account: "", bank: "" });
  };

  return (
    <AppLayout>
      {" "}
      <div className="min-h-screen bg-[#0E0E10] text-white relative overflow-hidden p-8">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold opacity-10 blur-[180px] rounded-full"></div>

        <div className="relative z-10 flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            Your <span className="text-gold">Beneficiaries</span>
          </h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-gold text-black px-6 py-3 rounded-full font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition"
          >
            + Add Beneficiary
          </button>
        </div>

       
        <div className="relative z-10 mb-8">
          <input
            type="text"
            placeholder="Search beneficiary..."
            className="w-full md:w-1/3 px-6 py-4 rounded-full bg-[#151517] border border-gold/20 focus:border-gold focus:ring-2 focus:ring-gold/30 focus:outline-none transition"
          />
        </div>

        
        <div className="relative z-10 grid md:grid-cols-2 gap-6">
          {beneficiaries.map((b) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151517] p-6 rounded-2xl border border-gold/10 hover:border-gold/30 transition"
            >
              <h2 className="text-xl font-semibold text-gold">{b.name}</h2>
              <p className="text-gray-400 mt-2 text-sm">Account: {b.account}</p>
              <p className="text-gray-400 text-sm">Bank: {b.bank}</p>

              <div className="mt-6 flex gap-4">
                <button className="px-4 py-2 rounded-full bg-gold text-black text-sm font-medium hover:shadow-[0_0_15px_rgba(255,215,0,0.5)] transition">
                  Send Money
                </button>
                <button className="px-4 py-2 rounded-full border border-red-500 text-red-400 text-sm hover:bg-red-500 hover:text-white transition">
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#151517] p-8 rounded-3xl w-[400px] border border-gold/20"
            >
              <h2 className="text-2xl font-bold mb-6">
                Add <span className="text-gold">Beneficiary</span>
              </h2>

              <form onSubmit={handleAdd} className="space-y-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newBeneficiary.name}
                  onChange={(e) =>
                    setNewBeneficiary({
                      ...newBeneficiary,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-6 py-4 rounded-full bg-[#0E0E10] border border-gold/20 focus:border-gold focus:outline-none"
                  required
                />

                <input
                  type="text"
                  placeholder="Account Number"
                  value={newBeneficiary.account}
                  onChange={(e) =>
                    setNewBeneficiary({
                      ...newBeneficiary,
                      account: e.target.value,
                    })
                  }
                  className="w-full px-6 py-4 rounded-full bg-[#0E0E10] border border-gold/20 focus:border-gold focus:outline-none"
                  required
                />

                <input
                  type="text"
                  placeholder="Bank Name"
                  value={newBeneficiary.bank}
                  onChange={(e) =>
                    setNewBeneficiary({
                      ...newBeneficiary,
                      bank: e.target.value,
                    })
                  }
                  className="w-full px-6 py-4 rounded-full bg-[#0E0E10] border border-gold/20 focus:border-gold focus:outline-none"
                  required
                />

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-full border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-gold text-black font-semibold hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition"
                  >
                    Save
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
