import React, { useEffect, useState } from "react";
import API from "../api";

export default function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await API.get("/reports");
        setReports(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReports();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/delete/${id}`);
      setReports(reports.filter((r) => r._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      {reports.map((report) => (
        <div key={report._id}>
          {report.name}
          <button onClick={() => handleDelete(report._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}