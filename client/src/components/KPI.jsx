export default function KPI({ title, value }) {
  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md">
      <h3 className="text-gray-400">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}