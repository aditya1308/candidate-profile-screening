const MetricCard = ({ label, value, subLabel, accent = 'bg-sg-red' }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 h-2.5 w-12 rounded-full ${accent}`} />
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        <span className="text-xs font-medium text-gray-500">{subLabel}</span>
      </div>
    </div>
  );
};

export default MetricCard;
