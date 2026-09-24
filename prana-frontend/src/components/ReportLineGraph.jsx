import React from 'react';

export default function ReportLineGraph({ data = [] }) {
  const maxVal = Math.max(...data.map(d => d.reports), 10);

  return (
    <div className="space-y-4">
      <div className="h-48 flex items-end space-x-6 pt-6 pb-2 border-b border-gray-200 dark:border-gray-700 px-4">
        {data.map((item, idx) => {
          const heightPercent = Math.round((item.reports / maxVal) * 100);
          return (
            <div key={idx} className="flex-1 flex flex-col items-center space-y-2 h-full justify-end">
              <span className="text-[10px] font-bold text-ayurGreen-700 dark:text-ayurGreen-300">{item.reports}</span>
              <div className="w-full bg-ayurGreen-600 rounded-t transition-all duration-500 hover:bg-ayurGreen-700" style={{ height: `${heightPercent}%` }}></div>
              <span className="text-xs text-gray-500 whitespace-nowrap">{item.date}</span>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-gray-400 text-center">Time-series reports surge and monitoring frequency</p>
    </div>
  );
}