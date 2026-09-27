const COLORS = ['#C62828', '#111827', '#EF4444', '#6B7280', '#F59E0B', '#22C55E'];

const polarToCartesian = (cx, cy, radius, angleDeg) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad)
  };
};

const describeArc = (cx, cy, radius, startAngle, endAngle) => {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', cx, cy,
    'L', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    'Z'
  ].join(' ');
};

const TrendChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex min-h-[220px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
        No chart data available.
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + Number(item.value || item.openings || 0), 0) || 1;

  let startAngle = 0;

  const slices = data.map((item, index) => {
    const value = Number(item.value || item.openings || 0);
    const angle = (value / total) * 360;
    const endAngle = startAngle + angle;
    const path = describeArc(110, 110, 82, startAngle, endAngle);
    const result = {
      ...item,
      value,
      path,
      color: COLORS[index % COLORS.length],
      startAngle,
      endAngle
    };
    startAngle = endAngle;
    return result;
  });

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 xl:flex-row">
      <div className="relative flex items-center justify-center">
        <svg viewBox="0 0 220 220" className="h-56 w-56">
          {slices.map((slice) => (
            <path
              key={slice.label}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="2"
            />
          ))}
          <circle cx="110" cy="110" r="48" fill="white" />
          <text x="110" y="103" textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">
            {total}
          </text>
          <text x="110" y="124" textAnchor="middle" fontSize="10" fill="#6B7280">
            Total applicants
          </text>
        </svg>
      </div>

      <div className="grid w-full max-w-sm gap-3">
        {slices.map((slice) => {
          const percentage = Math.round((slice.value / total) * 100);
          return (
            <div key={slice.label} className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: slice.color }} />
                <span className="truncate text-sm font-medium text-gray-700">{slice.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">{slice.value}</span>
                <span className="ml-2 text-xs text-gray-500">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendChart;
