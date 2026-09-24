import React, { useEffect, useState } from 'react';
import { apiGetTrials } from '../services/api';
import { ShieldCheck, Pill, Activity, Users } from 'lucide-react';

export default function TrialDirectory() {
  const [trials, setTrials] = useState([]);
  const token = localStorage.getItem('prana_token');

  useEffect(() => {
    async function load() {
      try { setTrials(await apiGetTrials(token)); } catch(e){console.error(e);}
    }
    load();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Public Clinical Trials & Medication Directory</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Explore active Ayurvedic interventional studies, standardized formulations, dosages, and safety statuses hosted at AIIA.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trials.map(t => (
          <div key={t.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold bg-ayurGreen-100 text-ayurGreen-800 px-2.5 py-1 rounded-full">{t.ctri_number}</span>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">{t.status}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.title}</h3>
              <div className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-1">
                <div className="flex items-center space-x-2 text-xs font-medium text-ayurGreen-800 dark:text-ayurGreen-300">
                  <Pill className="h-4 w-4"/><span>Investigational Medication / Herb:</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 pl-6">Standardized Herbal Extract (Phase {t.phase})</p>
              </div>
            </div>
            
            <div className="border-t dark:border-gray-700 pt-4 flex justify-between items-center text-xs text-gray-500">
              <span className="flex items-center space-x-1"><Users className="h-4 w-4"/><span>Target: {t.target_enrolment}</span></span>
              <span className="font-semibold text-ayurGreen-700 dark:text-ayurGreen-300">PI: {t.principal_investigator}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}