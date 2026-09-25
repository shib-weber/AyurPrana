import React from 'react';

export default function ReportLineGraph({ data = [] }) {
  if (!data || data.length === 0) {
    return <div className="p-8 text-center text-xs text-gray-400">No time-series report data available.</div>;
  }

  const maxVal = Math.max(...data.map(d => d.reports), 10);
  
  // SVG Viewport Dimensions
  const width = 600;
  const height = 180;
  const paddingX = 40;
  const paddingY = 30;
  const usableWidth = width - paddingX * 2;
  const usableHeight = height - paddingY * 2;

  // Calculate coordinates for each data point
  const points = data.map((item, idx) => {
    const x = paddingX + (idx / (data.length - 1 || 1)) * usableWidth;
    const y = height - paddingY - (item.reports / maxVal) * usableHeight;
    return { x, y, ...item };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div className="space-y-4">
      <div className="relative bg-ayurGreen-50/50 dark:bg-gray-700/30 p-4 rounded-2xl border border-ayurGreen-100 dark:border-gray-700">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
          {/* Horizontal Grid Lines */}
          {[0, 0.5, 1].map((ratio, i) => {
            const y = paddingY + usableHeight * ratio;
            const valLabel = Math.round(maxVal * (1 - ratio));
            return (
              <g key={i}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeDasharray="4 4" strokeWidth="1" />
                <text x={paddingX - 10} y={y + 4} className="text-[10px] fill-gray-400" textAnchor="end">{valLabel}</text>
              </g>
            );
          })}

          {/* Line Graph Path */}
          <polyline
            fill="none"
            stroke="#16a34a"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={polylinePoints}
          />

          {/* Data Points / Nodes */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              {/* Outer Glow Ring */}
              <circle cx={p.x} cy={p.y} r="6" className="fill-ayurGreen-200 dark:fill-ayurGreen-900 opacity-60 group-hover:r-8 transition-all" />
              {/* Inner Solid Node */}
              <circle cx={p.x} cy={p.y} r="4" className="fill-ayurGreen-600 stroke-white dark:stroke-gray-800" strokeWidth="2" />
              
              {/* Value Tooltip Hover Label */}
              <text x={p.x} y={p.y - 12} className="text-[10px] font-bold fill-ayurGreen-800 dark:fill-ayurGreen-300 opacity-0 group-hover:opacity-100 transition-opacity" textAnchor="middle">
                {p.reports} reports
              </text>
            </g>
          ))}
        </svg>

        {/* X-Axis Date Labels */}
        <div className="flex justify-between px-6 pt-2 text-xs text-gray-500 font-medium border-t border-ayurGreen-100 dark:border-gray-700 mt-2">
          {data.map((item, idx) => (
            <span key={idx}>{item.date}</span>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">Time-series reports surge and monitoring frequency (SVG Line Graph)</p>
    </div>
  );
}