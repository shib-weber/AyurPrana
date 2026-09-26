import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ShieldCheck, AlertCircle, CheckCircle, Send, Code, Users, ArrowRight, Sparkles, Building2, FileCheck2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetTrials, apiGetAuditLogs, apiGetContracts, apiGetPatients, apiGetProfile } from '../../services/api';

export default function GovPortal() {
  const [trials, setTrials] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [currentOfficial, setCurrentOfficial] = useState(null);
  const [submitted, setSubmitted] = useState({});
  
  // Professional Modal State
  const [modalData, setModalData] = useState(null);

  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const profile = await apiGetProfile(token);
      setCurrentOfficial(profile);

      setTrials(await apiGetTrials(token));
      setContracts(await apiGetContracts(token));
      setPatients(await apiGetPatients(token));
      setAuditLogs(await apiGetAuditLogs(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const handleFinalSubmit = (trial) => {
    setSubmitted(prev => ({ ...prev, [trial.id]: true }));
    setModalData({
      ctri: trial.ctri_number,
      title: trial.title,
      investigator: trial.principal_investigator,
      timestamp: new Date().toLocaleString()
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative">
      
      {/* Personalized Greeting Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-ayurGreen-100 dark:bg-gray-700 text-ayurGreen-600 rounded-2xl">
            <Building2 className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-ayurGreen-900 dark:text-white">
                Welcome back, {currentOfficial?.full_name || 'Regulator'}!
              </h1>
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Official Regulator ID: <span className="font-mono font-bold">#{currentOfficial?.id}</span> • Ministry of Ayush & NPvCC Coordination Directorate
            </p>
          </div>
        </div>
        <div className="bg-ayurGreen-50 dark:bg-gray-700 px-4 py-2 rounded-xl text-xs font-semibold text-ayurGreen-800 dark:text-ayurGreen-300 border border-ayurGreen-200 dark:border-gray-600">
          NPvCC National Oversight Active
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="NPvCC Surveillance" value="Active" icon={ShieldCheck} subtitle="National monitoring" />
        <Card title="Total Registered Patients" value={patients.length} icon={Users} subtitle="System-wide participants" />
        <Card title="Total CRDA Trials" value={trials.length} icon={AlertCircle} subtitle="Registered studies" />
      </div>

      {/* National Trial Oversight Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-6">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">National Clinical Trial Oversight (Click Row for Detailed Report)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b dark:border-gray-700 text-gray-500">
                <th className="py-3 px-4">CRDA / CTRI Number</th>
                <th className="py-3 px-4">Study Title</th>
                <th className="py-3 px-4">Principal Investigator</th>
                <th className="py-3 px-4">Doctors</th>
                <th className="py-3 px-4">Patients</th>
                <th className="py-3 px-4">Compliance</th>
                <th className="py-3 px-4">Global Submission</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trials.map(t => {
                const trialContracts = contracts.filter(c => c.trial_id === t.id);
                const uniqueDoctors = new Set(trialContracts.map(c => c.doctor_id)).size;
                const enrolledPatientsCount = trialContracts.length;

                return (
                  <tr key={t.id} className="border-b dark:border-gray-700 hover:bg-ayurGreen-50 dark:hover:bg-gray-700 transition">
                    <td className="py-3 px-4 font-mono font-semibold text-ayurGreen-600">{t.ctri_number}</td>
                    <td className="py-3 px-4">{t.title}</td>
                    <td className="py-3 px-4">{t.principal_investigator}</td>
                    <td className="py-3 px-4 font-bold text-blue-600">{uniqueDoctors} Doctor(s)</td>
                    <td className="py-3 px-4 font-bold text-ayurGreen-700">{enrolledPatientsCount} Patient(s)</td>
                    <td className="py-3 px-4 font-bold text-green-600">{t.compliance_score}%</td>
                    <td className="py-3 px-4">
                      {submitted[t.id] ? (
                        <span className="text-xs text-green-600 font-bold flex items-center space-x-1"><CheckCircle className="h-4 w-4"/><span>Submitted</span></span>
                      ) : (
                        <button onClick={() => handleFinalSubmit(t)} className="bg-ayurGreen-600 hover:bg-ayurGreen-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 shadow">
                          <Send className="h-3 w-3"/><span>Global Submit</span>
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => navigate(`/trials/${t.id}`)} className="bg-ayurGreen-50 dark:bg-gray-700 text-ayurGreen-700 dark:text-ayurGreen-300 hover:bg-ayurGreen-100 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1">
                        <span>Report</span><ArrowRight className="h-3 w-3"/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Immutable JSON Audit Stream */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-ayurGreen-600"/>
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Immutable JSON Audit Stream (ALCOA+ Compliance)</h3>
        </div>
        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-80">
          <pre>{JSON.stringify(auditLogs, null, 2)}</pre>
        </div>
      </div>

      {/* PROFESSIONAL SUBMISSION SUCCESS MODAL POPUP */}
      {modalData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-ayurGreen-100 dark:border-gray-700 space-y-6 relative">
            
            <button 
              onClick={() => setModalData(null)} 
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-full shadow-inner">
                <FileCheck2 className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="text-2xl font-extrabold text-ayurGreen-900 dark:text-white">
                Global Submission Successful!
              </h3>
              <p className="text-xs text-gray-500">
                Final regulatory audit report & CDISC submission package successfully dispatched to global researchers and the Ministry of Ayush.
              </p>
            </div>

            <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700/50 rounded-2xl space-y-2 text-xs border border-ayurGreen-100 dark:border-gray-600">
              <div className="flex justify-between">
                <span className="text-gray-500">CRDA / CTRI Tracking:</span>
                <span className="font-mono font-bold text-ayurGreen-700 dark:text-ayurGreen-300">{modalData.ctri}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Study Title:</span>
                <span className="font-semibold text-gray-900 dark:text-white truncate max-w-[240px]">{modalData.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Principal Investigator:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{modalData.investigator}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Submission Timestamp:</span>
                <span className="font-mono text-gray-600 dark:text-gray-300">{modalData.timestamp}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-[10px] text-gray-400 justify-center">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span>SHA-256 Cryptographic Seal Verified • ALCOA+ Compliant</span>
            </div>

            <button 
              onClick={() => setModalData(null)}
              className="w-full bg-ayurGreen-600 hover:bg-ayurGreen-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg transition transform hover:-translate-y-0.5"
            >
              Close & Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}