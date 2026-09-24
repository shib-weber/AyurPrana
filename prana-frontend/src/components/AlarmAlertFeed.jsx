import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AlarmAlertFeed({ alarms = [] }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4 flex flex-col h-full">
      <div className="flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-amber-500"/>
        <h3 className="text-lg font-bold text-ayurGreen-800 dark:text-white">Active Alarms & Health Threats Log</h3>
      </div>
      <div className="space-y-2 overflow-y-auto max-h-80 flex-1">
        {alarms.length === 0 ? (
          <p className="text-xs text-gray-500">No active alarms recorded for this trial.</p>
        ) : (
          alarms.map(alarm => (
            <div key={alarm.id} className="p-3 bg-red-50 dark:bg-gray-700 rounded-xl text-xs space-y-1 border border-red-100">
              <div className="flex justify-between font-bold text-red-800 dark:text-red-300">
                <span>{alarm.type} ({alarm.severity})</span>
                <span className="text-gray-400">{alarm.timestamp}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300">{alarm.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}