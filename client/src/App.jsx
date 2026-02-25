import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import DataEntry from "./pages/DataEntry";
import Reports from "./pages/Reports";
import Prediction from "./pages/Prediction";

export default function App() {
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar setTab={setTab} />
      <div className="flex-1 p-6">
        {tab === "dashboard" && <Dashboard />}
        {tab === "data" && <DataEntry />}
        {tab === "reports" && <Reports />}
        {tab === "prediction" && <Prediction />}
      </div>
    </div>
  );
}