import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Activity, AlertTriangle, ShieldCheck, ArrowLeft, LineChart, FileText, MessageSquare, Send, Sparkles, HeartPulse, TrendingUp } from 'lucide-react';
import { apiGetPatientDetails, apiGetPatientHealthLogs, apiGetAdverseEvents, apiGetProfile, apiGetMessages, apiSendMessage } from '../services/api';

export default function PatientProfilePage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [logs, setLogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('prana_token');

  async function loadData() {
    try {
      const doctorProfile = await apiGetProfile(token);
      setCurrentDoctor(doctorProfile);

      const patientData = await apiGetPatientDetails(token, patientId);
      setPatient(patientData);

      const healthLogs = await apiGetPatientHealthLogs(token, patientId);
      setLogs(healthLogs);

      const allEvents = await apiGetAdverseEvents(token);
      const patientEvents = allEvents.filter(e => e.patient_id.toString() === patientId.toString());
      setEvents(patientEvents);

      try {
        const chatMsgs = await apiGetMessages(token, patientId);
        setMessages(chatMsgs.map(m => ({
          sender: m.sender_id === doctorProfile?.id ? 'doctor' : 'patient',
          text: m.message,
          timestamp: m.timestamp
        })));
      } catch (e) {
        console.error("Chat sync fallback:", e);
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, [patientId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentDoctor) return;

    try {
      await apiSendMessage(token, parseInt(patientId), newMessage);
      setMessages([
        ...messages,
        { sender: 'doctor', text: newMessage, timestamp: new Date().toLocaleTimeString() }
      ]);
      setNewMessage('');
    } catch (err) {
      alert(err.message);
    }
  };

  // --- MULTI-FACTOR DYNAMIC HEALTH SCORE & WAVEFORM CALCULATION ---
  const totalAlarms = events.length;
  const severeAlarms = events.filter(e => e.severity === 'Severe' || e.severity === 'SAE').length;
  const totalLogs = logs.length;
  const totalMessages = messages.length;

  // Dynamic Health Score formula based on actual records
  const healthScore = Math.max(25, Math.min(100, 90 - (totalAlarms * 12) - (severeAlarms * 15) + (totalLogs * 4) + (totalMessages * 2)));

  // Generate dynamic wave path coordinates based on patient records
  // If there are alarms, amplitude spikes; if logs are steady, wave stabilizes.
  const generateDynamicWavePath = () => {
    let path = "M 0 60";
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      const x = (800 / steps) * i;
      // Inject volatility if alarms exist near this interval, otherwise smooth recovery
      const volatility = totalAlarms > 0 ? Math.sin(i + totalAlarms) * 35 : Math.cos(i) * 15;
      const y = 60 + volatility - (totalLogs * 2); 
      path += ` Q ${x - 50} ${y + (i % 2 === 0 ? 30 : -30)}, ${x} ${Math.max(15, Math.min(105, y))}`;
    }
    path += " L 800 120 L 0 120 Z";
    return path;
  };

  const generateDynamicWaveStroke = () => {
    let path = "M 0 60";
    const steps = 8;
    for (let i = 1; i <= steps; i++) {
      const x = (800 / steps) * i;
      const volatility = totalAlarms > 0 ? Math.sin(i + totalAlarms) * 35 : Math.cos(i) * 15;
      const y = 60 + volatility - (totalLogs * 2);
      path += ` Q ${x - 50} ${y + (i % 2 === 0 ? 30 : -30)}, ${x} ${Math.max(15, Math.min(105, y))}`;
    }
    return path;
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading patient clinical profile & multi-factor diagnostics...</div>;
  if (!patient) return <div className="p-12 text-center text-red-500">Patient not found for ID: #{patientId}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Navigation & Header */}
      <div>
        <button onClick={() => navigate(-1)} className="text-xs text-ayurGreen-600 font-bold hover:underline mb-2 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4"/><span>Back to Doctor Portal</span>
        </button>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 gap-6">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-2xl text-ayurGreen-600">
              <User className="h-10 w-10"/>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-ayurGreen-900 dark:text-white">{patient.full_name}</h1>
              <p className="text-sm text-gray-500">{patient.email} | Patient ID: #{patient.id}</p>
              <p className="text-xs text-ayurGreen-700 dark:text-ayurGreen-300 font-semibold mt-1">Status: Active Clinical Subject • Multi-Factor Monitored</p>
            </div>
          </div>

          {/* AI Health Score Circular Badge */}
          <div className="flex items-center space-x-4 bg-ayurGreen-50 dark:bg-gray-700/60 p-4 rounded-2xl border border-ayurGreen-200 dark:border-gray-600">
            <div className="relative flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" className="text-gray-200 dark:text-gray-600 fill-none" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="26" 
                  stroke="currentColor" 
                  strokeWidth="6" 
                  strokeDasharray={163} 
                  strokeDashoffset={163 - (163 * healthScore) / 100} 
                  className="text-ayurGreen-600 fill-none transition-all duration-1000" 
                />
              </svg>
              <span className="absolute text-sm font-bold text-ayurGreen-900 dark:text-white">{healthScore}%</span>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-xs font-bold text-ayurGreen-800 dark:text-ayurGreen-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Multi-Factor AI Health Score</span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                Derived from {totalLogs} logs, {totalAlarms} alarms & {totalMessages} consultation notes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Record-Driven Wavy Biometric Waveform */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 text-ayurGreen-800 dark:text-white font-bold">
            <HeartPulse className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Dynamic Biometric Waveform (Based on Patient Records & Alarms)</h3>
          </div>
          <span className="text-xs bg-ayurGreen-100 text-ayurGreen-800 dark:bg-gray-700 dark:text-ayurGreen-300 px-3 py-1 rounded-full font-semibold">
            {totalAlarms > 0 ? `${totalAlarms} Volatile Spike(s) Detected` : 'Steady Recovery Pattern'}
          </span>
        </div>
        <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700/40 rounded-xl overflow-hidden">
          <svg viewBox="0 0 800 120" className="w-full h-28">
            <defs>
              <linearGradient id="patientWaveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={totalAlarms > 0 ? "#ef4444" : "#16a34a"} stopOpacity="0.4" />
                <stop offset="100%" stopColor={totalAlarms > 0 ? "#ef4444" : "#16a34a"} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path d={generateDynamicWavePath()} fill="url(#patientWaveGradient)" />
            <path d={generateDynamicWaveStroke()} fill="none" stroke={totalAlarms > 0 ? "#ef4444" : "#16a34a"} strokeWidth="3" />
            
            {/* Render alert surge markers based on actual alarms */}
            {events.map((ev, i) => (
              <g key={ev.id || i}>
                <circle cx={100 + (i * 180)} cy="40" r="6" className="fill-red-500 animate-ping" />
                <circle cx={100 + (i * 180)} cy="40" r="4" className="fill-red-700 stroke-white" strokeWidth="1.5" />
              </g>
            ))}
          </svg>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center mt-2">
            Waveform amplitude and spikes are dynamically computed from {totalLogs} daily logs and {totalAlarms} safety alarms.
          </p>
        </div>
      </div>

      {/* Main Grid: Health Recovery Line Graph & Vitals Logs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Health Recovery & Vitals Surge LINE GRAPH */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center space-x-2 text-ayurGreen-800 dark:text-white font-bold">
            <LineChart className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Health Recovery & Vitals Surge Trend</h3>
          </div>
          <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700/50 rounded-xl">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">No daily health logs submitted yet.</p>
            ) : (
              <div className="h-48 relative flex items-end justify-between px-4 pt-8 border-b border-l border-ayurGreen-200 dark:border-gray-600">
                <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 400 160" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="3"
                    points={logs.map((l, idx) => {
                      const x = (idx / (logs.length - 1 || 1)) * 360 + 20;
                      const y = 140 - ((idx + 1) * 30);
                      return `${x},${Math.max(20, y)}`;
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

        {/* Daily Notes & Vitals */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
            <Activity className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Patient Daily Notes & Vitals Logs</h3>
          </div>
          <div className="space-y-3 max-h-56 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-xs text-gray-500">No logs found.</p>
            ) : (
              logs.map(l => (
                <div key={l.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-gray-900 dark:text-white">Vitals: {l.vitals_summary}</p>
                  <p className="text-gray-600 dark:text-gray-300">Notes: {l.symptoms_notes || "None recorded"}</p>
                  <p className="text-[10px] text-gray-400">{new Date(l.log_date).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Alarms Raised & Solutions Given */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
          <AlertTriangle className="h-5 w-5 text-amber-500"/>
          <h3>Safety Alarms Raised & Doctor Solutions</h3>
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto">
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

      {/* Direct Messaging Consultation Chat Area */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col justify-between h-[400px]">
        <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white border-b pb-3 dark:border-gray-700">
          <MessageSquare className="h-5 w-5 text-ayurGreen-600"/>
          <h3>Direct Consultation Chat with {patient.full_name}</h3>
        </div>

        {/* Chat Messages Stream */}
        <div className="flex-grow overflow-y-auto space-y-3 py-4 pr-2">
          {messages.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No messages yet. Start the conversation below.</p>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className={`flex flex-col ${m.sender === 'doctor' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-xl max-w-[80%] text-xs ${
                  m.sender === 'doctor' 
                    ? 'bg-ayurGreen-600 text-white rounded-br-none' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                }`}>
                  <p>{m.text}</p>
                </div>
                <span className="text-[9px] text-gray-400 mt-1">{m.timestamp}</span>
              </div>
            ))
          )}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2 pt-3 border-t dark:border-gray-700">
          <input 
            type="text" 
            value={newMessage} 
            onChange={e=>setNewMessage(e.target.value)} 
            placeholder={`Message ${patient.full_name}...`} 
            className="flex-1 p-2.5 text-xs border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />
          <button type="submit" className="bg-ayurGreen-600 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1 hover:bg-ayurGreen-700">
            <Send className="h-3 w-3"/><span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}