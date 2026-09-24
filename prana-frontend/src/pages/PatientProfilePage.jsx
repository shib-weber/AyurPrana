import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Activity, AlertTriangle, ShieldCheck, ArrowLeft, LineChart, FileText } from 'lucide-react';
import { apiGetPatientDetails, apiGetPatientHealthLogs, apiGetAdverseEvents } from '../services/api';

export default function PatientProfilePage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('prana_token');

  useEffect(() => {
    async function loadPatientData() {
      try {
        const patientData = await apiGetPatientDetails(token, patientId);
        setPatient(patientData);

        const healthLogs = await apiGetPatientHealthLogs(token, patientId);
        setLogs(healthLogs);

        const allEvents = await apiGetAdverseEvents(token);
        const patientEvents = allEvents.filter(e => e.patient_id.toString() === patientId.toString());
        setEvents(patientEvents);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadPatientData();
  }, [patientId, token]);

  if (loading) return <div className="p-12 text-center text-gray-500">Loading patient clinical profile...</div>;
  if (!patient) return <div className="p-12 text-center text-red-500">Patient not found for ID: #{patientId}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Navigation & Header */}
      <div>
        <button onClick={() => navigate(-1)} className="text-xs text-ayurGreen-600 font-bold hover:underline mb-2 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4"/><span>Back to Doctor Portal</span>
        </button>
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-2xl text-ayurGreen-600">
            <User className="h-10 w-10"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ayurGreen-900 dark:text-white">{patient.full_name}</h1>
            <p className="text-sm text-gray-500">{patient.email} | Patient ID: #{patient.id}</p>
            <p className="text-xs text-ayurGreen-700 dark:text-ayurGreen-300 font-semibold mt-1">Status: Active Clinical Subject</p>
          </div>
        </div>
      </div>

      {/* Health Recovery & Vitals Surge LINE GRAPH */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center space-x-2 text-ayurGreen-800 dark:text-white font-bold">
          <LineChart className="h-5 w-5 text-ayurGreen-600"/>
          <h3>Health Recovery & Vitals Surge Trend (Line Graph)</h3>
        </div>
        <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700/50 rounded-xl">
          {logs.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6">No daily health logs submitted yet.</p>
          ) : (
            <div className="h-48 relative flex items-end justify-between px-4 pt-8 border-b border-l border-ayurGreen-200 dark:border-gray-600">
              {/* SVG Line Graph Connectors */}
              <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3"
                  points={logs.map((l, idx) => {
                    const x = (idx / (logs.length - 1 || 1)) * 90 + 5; // percentage X
                    const y = 100 - ((idx + 1) * 20); // mock height percentage Y
                    return `${x}%,${y}%`;
                  }).join(' ')}
                />
              </svg>
              {logs.map((log, idx) => (
                <div key={log.id} className="z-10 flex flex-col items-center space-y-2">
                  <div className="w-3 h-3 bg-ayurGreen-600 rounded-full border-2 border-white dark:border-gray-800 shadow"></div>
                  <span className="text-[10px] text-gray-500 font-semibold">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Daily Notes & Vitals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
            <Activity className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Patient Daily Notes & Vitals Logs</h3>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500">No logs found.</p>
            ) : (
              logs.map(l => (
                <div key={l.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">Vitals: {l.vitals_summary}</p>
                  <p className="text-gray-600 dark:text-gray-300">Notes: {l.symptoms_notes || "None recorded"}</p>
                  <p className="text-[10px] text-gray-400">{new Date(l.log_date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alarms Raised & Solutions Given */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
            <AlertTriangle className="h-5 w-5 text-amber-500"/>
            <h3>Safety Alarms Raised & Doctor Solutions</h3>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-xs text-gray-500">No safety alarms or warnings raised.</p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="p-4 bg-red-50 dark:bg-gray-700 rounded-xl text-xs space-y-2 border border-red-100 dark:border-gray-600">
                  <div className="flex justify-between font-bold text-red-800 dark:text-red-300">
                    <span>Alarm: {ev.meddra_preferred_term}</span>
                    <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded">{ev.severity}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">Outcome: {ev.outcome}</p>
                  <div className="p-2 bg-green-50 dark:bg-gray-800 rounded border border-green-200 text-green-800 dark:text-green-300 font-semibold">
                    Doctor Solution: {ev.doctor_solution || "Pending doctor response..."}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}