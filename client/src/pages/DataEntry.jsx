import { useState } from "react";
import axios from "axios";

export default function DataEntry() {

  const [form, setForm] = useState({
    date: "",
    item: "",
    category: "Breakfast",
    unit: "kg",
    prepared: "",
    consumed: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const saveEntry = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/add", form);
      alert(res.data.message);
    } catch (err) {
      console.log(err.response?.data);
      alert("Backend error. Check console.");
    }
  };

  const uploadExcel = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData);
      alert(res.data.message);
    } catch (err) {
      console.log(err.response?.data);
      alert("Upload failed. Check console.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-xl mx-auto space-y-4">

      <h2 className="text-2xl font-semibold">Add Food Data</h2>

      <input type="date" name="date" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="text" name="item" placeholder="Food Item" onChange={handleChange} className="w-full border p-2 rounded" />

      <select name="category" onChange={handleChange} className="w-full border p-2 rounded">
        <option>Breakfast</option>
        <option>Lunch</option>
        <option>Dinner</option>
      </select>

      <input type="number" name="prepared" placeholder="Prepared Quantity" onChange={handleChange} className="w-full border p-2 rounded" />
      <input type="number" name="consumed" placeholder="Consumed Quantity" onChange={handleChange} className="w-full border p-2 rounded" />

      <button onClick={saveEntry} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save Entry
      </button>

      <div className="border-t pt-4">
        <h3 className="font-semibold">Upload Excel File</h3>
        <input type="file" onChange={uploadExcel} />
      </div>

    </div>
  );
}