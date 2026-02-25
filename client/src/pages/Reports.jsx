import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export default function Reports() {

  const [data, setData] = useState([]);

  const fetchData = async () => {
    const res = await axios.get("http://127.0.0.1:5000/all");
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteEntry = async (id) => {
    await axios.delete(`http://127.0.0.1:5000/delete/${id}`);
    fetchData();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Food Waste");
    XLSX.writeFile(wb, "Food_Waste_Report.xlsx");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Reports</h2>
        <button
          onClick={downloadExcel}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Download Excel
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Date</th>
              <th className="p-3">Item</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Prepared</th>
              <th className="p-3 text-right">Consumed</th>
              <th className="p-3 text-right">Waste</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">

                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.item}</td>
                <td className="p-3">{row.category}</td>

                <td className="p-3 text-right">{row.prepared}</td>
                <td className="p-3 text-right">{row.consumed}</td>

                <td className="p-3 text-right text-red-500 font-semibold">
                  {(row.prepared - row.consumed).toFixed(2)}
                </td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => deleteEntry(row.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}