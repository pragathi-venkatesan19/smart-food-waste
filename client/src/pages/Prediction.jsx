import { useEffect, useState } from "react";
import axios from "axios";

export default function Prediction() {

  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    const res = await axios.get("http://127.0.0.1:5000/predict");

    if (res.data.prediction) {
      setData(res.data);
    } else {
      setMessage(res.data.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-3xl mx-auto space-y-6">

      <h2 className="text-2xl font-semibold">AI Waste Forecast</h2>

      {data && (
        <>
          <div className="grid grid-cols-2 gap-6">

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Predicted Avg Waste (Next 7 Days)
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {data.prediction} kg
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Trend Direction
              </div>
              <div className="text-xl font-semibold">
                {data.trend}
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Severity Level
              </div>
              <div className="text-xl font-semibold">
                {data.severity}
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600">
                Model Confidence
              </div>
              <div className="text-xl font-semibold">
                {data.confidence}
              </div>
            </div>

          </div>

          <div className="bg-gray-100 p-6 rounded-lg text-gray-700">
            <h4 className="font-semibold mb-2">AI Reasoning:</h4>
            {data.reasoning}
          </div>
        </>
      )}

      {message && (
        <div className="text-red-500">{message}</div>
      )}

    </div>
  );
}