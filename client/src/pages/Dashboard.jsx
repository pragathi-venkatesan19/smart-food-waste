import { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await axios.get("http://127.0.0.1:5000/all");
    setData(res.data);
    setFilteredData(res.data);
  };

  // Filter by date
  const handleDateFilter = (date) => {
    setSelectedDate(date);
    if (!date) {
      setFilteredData(data);
    } else {
      const filtered = data.filter((d) => d.date === date);
      setFilteredData(filtered);
    }
  };

  // KPI calculations
  const totalPrepared = filteredData.reduce(
    (a, b) => a + Number(b.prepared),
    0
  );

  const totalConsumed = filteredData.reduce(
    (a, b) => a + Number(b.consumed),
    0
  );

  const totalWaste = totalPrepared - totalConsumed;

  const wastePercent =
    totalPrepared > 0
      ? ((totalWaste / totalPrepared) * 100).toFixed(2)
      : 0;

  const wasteLevel =
    wastePercent < 20
      ? { label: "Low", color: "text-green-600" }
      : wastePercent < 50
      ? { label: "Medium", color: "text-yellow-500" }
      : { label: "High", color: "text-red-600" };

  // Chart Data
  const chartData = filteredData.map((item) => ({
    date: item.date,
    prepared: Number(item.prepared),
    consumed: Number(item.consumed),
    waste: Number(item.prepared) - Number(item.consumed),
  }));

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Dashboard</h2>

      {/* Date Filter */}
      <div className="mb-6">
        <label className="mr-3 font-medium">Filter by Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => handleDateFilter(e.target.value)}
          className="border p-2 rounded"
        />
        {selectedDate && (
          <button
            onClick={() => handleDateFilter("")}
            className="ml-3 text-blue-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Prepared</p>
          <h3 className="text-2xl font-bold">{totalPrepared}</h3>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Consumed</p>
          <h3 className="text-2xl font-bold">{totalConsumed}</h3>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Total Waste</p>
          <h3 className="text-2xl font-bold text-red-500">
            {totalWaste}
          </h3>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <p className="text-gray-500">Waste Percentage</p>
          <h3 className="text-2xl font-bold">
            {wastePercent}%
          </h3>
          <p className={`mt-2 font-semibold ${wasteLevel.color}`}>
            Waste Level: {wasteLevel.label}
          </p>
        </div>
      </div>

      {/* Waste Trend Line Chart */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">
          Daily Waste Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="waste"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Prepared vs Consumed Bar Chart */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">
          Prepared vs Consumed
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="prepared" fill="#3b82f6" />
            <Bar dataKey="consumed" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}