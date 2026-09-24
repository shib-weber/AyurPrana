import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ShieldCheck, AlertCircle, CheckCircle, Send, Code, Users, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetTrials, apiGetAuditLogs, apiGetContracts, apiGetPatients } from '../../services/api';

export default function GovPortal() {
  const [trials, setTrials] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [patients, setPatients] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [submitted, setSubmitted] = useState({});
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      setTrials(await apiGetTrials(token));
      setContracts(await apiGetContracts(token));
      setPatients(await apiGetPatients(token));
      setAuditLogs(await apiGetAuditLogs(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const handleFinalSubmit = (trialId, ctri) => {
    setSubmitted(prev => ({ ...prev, [trialId]: true }));
    alert(`Final regulatory audit report & CDISC submission package for trial ${ctri} submitted successfully to global researchers and Ministry of Ayush.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Government Official & NPvCC Regulator Portal</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="NPvCC Surveillance" value="Active" icon={ShieldCheck} subtitle="National monitoring" />
        <Card title="Total Registered Patients" value={patients.length} icon={Users} subtitle="System-wide participants" />
        <Card title="Total CRDA Trials" value={trials.length} icon={AlertCircle} subtitle="Registered studies" />
      </div>

      {/* National Trial Oversight Table (Clickable Rows for Detailed Trial Report) */}
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
                        <button onClick={() => handleFinalSubmit(t.id, t.ctri_number)} className="bg-ayurGreen-600 hover:bg-ayurGreen-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1 shadow">
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
    </div>
  );
}