import React, { useState } from "react";
import API from "../api";

export default function DataEntry() {
  const [formData, setFormData] = useState({});

  const handleSubmit = async () => {
    try {
      await API.post("/data-entry", formData);
      alert("Data saved successfully");
    } catch (error) {
      console.error(error);
      alert("Error saving data");
    }
  };

  return (
    <div>
      <h2>Data Entry</h2>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}