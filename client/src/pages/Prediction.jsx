import React, { useState } from "react";
import API from "../api";

export default function Prediction() {
  const [data, setData] = useState("");
  const [message, setMessage] = useState("");

  const handlePredict = async () => {
    try {
      const res = await API.post("/predict", { data });
      setMessage(res.data.prediction);
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server");
    }
  };

  return (
    <div>
      <h2>Prediction</h2>
      <input
        type="text"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <button onClick={handlePredict}>Predict</button>

      {message && <div>{message}</div>}
    </div>
  );
}