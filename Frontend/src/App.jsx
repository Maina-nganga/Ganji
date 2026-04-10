  import { Routes, Route } from "react-router-dom";
  import Landing from "./Pages/Landing";
  import Login from "./Pages/Login";
  import Register from "./Pages/Register";
  import Dashboard from "./Pages/Dashboard";
  import Wallet from "./Pages/Wallet";
  import Transaction from "./Pages/Transaction";
  import Beneficiaries from "./Pages/Beneficiaries";
  import AdminDashboard from "./Pages/AdminDashboard";
  import ProtectedRoute from "./components/ProtectedRoute";

  function App() {
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          }
        />

        <Route
          path="/beneficiaries"
          element={
            <ProtectedRoute>
              <Beneficiaries />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    );
  }

  export default App;