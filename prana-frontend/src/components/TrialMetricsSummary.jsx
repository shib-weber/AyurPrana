import React from 'react';
import { Users, UserCheck, AlertTriangle, ShieldAlert } from 'lucide-react';

export default function TrialMetricsSummary({ metrics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl text-ayurGreen-600"><Users className="h-6 w-6"/></div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Doctors Recommending</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{metrics.doctorsCount}</h4>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl text-ayurGreen-600"><UserCheck className="h-6 w-6"/></div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Patients Enrolled</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{metrics.patientsCount}</h4>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-amber-50 dark:bg-gray-700 rounded-xl text-amber-600"><AlertTriangle className="h-6 w-6"/></div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Alarms & Alerts</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{metrics.alarmsCount}</h4>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex items-center space-x-4">
        <div className="p-3 bg-red-50 dark:bg-gray-700 rounded-xl text-red-600"><ShieldAlert className="h-6 w-6"/></div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Health Threats</p>
          <h4 className="text-xl font-bold text-gray-900 dark:text-white">{metrics.healthThreatsCount}</h4>
        </div>
      </div>
    </div>
  );
}