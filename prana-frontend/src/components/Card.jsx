import React from 'react';

export default function Card({ title, value, subtitle, icon: Icon, badge }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h4>
        {subtitle && <p className="text-xs text-ayurGreen-600 dark:text-ayurGreen-400 mt-1">{subtitle}</p>}
      </div>
      {Icon && (
        <div className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-lg text-ayurGreen-600 dark:text-ayurGreen-400">
          <Icon className="h-6 w-6" />
        </div>
      )}
    </div>
  );
}