export default function Sidebar({ setTab }) {
  return (
    <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
      <h1 className="text-xl font-bold mb-6 text-blue-600">
        Smart Food Wastage
      </h1>

      <ul className="space-y-4">
        <li onClick={() => setTab("dashboard")} className="cursor-pointer hover:text-blue-500">
          Dashboard
        </li>
        <li onClick={() => setTab("data")} className="cursor-pointer hover:text-blue-500">
          Data Entry
        </li>
        <li onClick={() => setTab("reports")} className="cursor-pointer hover:text-blue-500">
          Reports
        </li>
        <li onClick={() => setTab("prediction")} className="cursor-pointer hover:text-blue-500">
          Prediction
        </li>
      </ul>
    </div>
  );
}