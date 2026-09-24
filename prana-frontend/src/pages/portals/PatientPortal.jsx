import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, User, Activity, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetProfile, apiGetContracts, apiReportAE, apiLogDailyHealth, apiGetAdverseEvents } from '../../services/api';

export default function PatientPortal() {
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [healthLog, setHealthLog] = useState({ trial_id: '', vitals: '', notes: '' });
  const [aeForm, setAeForm] = useState({ trial_id: '', term: '', severity: 'Mild' });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      setProfile(await apiGetProfile(token));
      setContracts(await apiGetContracts(token));
      setEvents(await apiGetAdverseEvents(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const contractedTrials = contracts.map(c => ({
    id: c.trial_id,
    title: c.trial_title || `Trial ID #${c.trial_id}`,
    contract_ref: c.contract_ref
  }));

  const handleHealthLogSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiLogDailyHealth(token, {
        patient_id: profile.id,
        trial_id: parseInt(healthLog.trial_id),
        vitals_summary: healthLog.vitals,
        symptoms_notes: healthLog.notes
      });
      setMsg('Daily health vitals & notes recorded successfully!');
      setHealthLog({ trial_id: '', vitals: '', notes: '' });
    } catch (err) { alert(err.message); }
  };

  const handleReportIssue = async (e) => {
    e.preventDefault();
    try {
      await apiReportAE(token, {
        patient_id: profile.id,
        trial_id: parseInt(aeForm.trial_id),
        severity: aeForm.severity,
        meddra_preferred_term: aeForm.term,
        outcome: "Under Observation"
      });
      setMsg('Safety alarm raised successfully to your doctor & NPvCC!');
      setAeForm({ trial_id: '', term: '', severity: 'Mild' });
    } catch (err) { alert(err.message); }
  };

  const myEvents = events.filter(e => e.patient_id === profile?.id || e.patient_name?.includes(profile?.full_name));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <User className="h-8 w-8 text-ayurGreen-600" />
        <div>
          <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Welcome, {profile?.full_name}</h1>
          <p className="text-sm text-gray-500">Patient ID: #{profile?.id}</p>
        </div>
      </div>

      {msg && <div className="p-4 bg-green-100 text-green-800 rounded-xl">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Contracts" value={contracts.length} icon={FileText} subtitle="Signed trial agreements" />
        <Card title="Informed Consent" value="Signed (E-Verified)" icon={CheckCircle2} subtitle="DPDP Act 2023 Compliant" />
        <Card title="Doctor Solutions" value={myEvents.filter(e=>e.doctor_solution).length} icon={ShieldCheck} subtitle="Prescriptions received" />
      </div>

      {/* Patient Active Contracts List (Clickable to Trial Detail Page) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Your Enrolled Clinical Trials (Click for Full Report)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.length === 0 ? <p className="text-xs text-gray-500">No active contracts found.</p> : contracts.map(c => (
            <div key={c.id} onClick={() => navigate(`/trials/${c.trial_id}`)} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:shadow-md transition space-y-2 text-xs border border-ayurGreen-100 flex flex-col justify-between">
              <div>
                <p className="font-bold text-ayurGreen-900 dark:text-white text-sm">Contract Ref: {c.contract_ref}</p>
                <p className="text-gray-500">Trial ID: #{c.trial_id}</p>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-ayurGreen-200 dark:border-gray-600">
                <span className="font-serif italic text-ayurGreen-700 dark:text-ayurGreen-300">Consent: "{c.e_signature}"</span>
                <span className="flex items-center space-x-1 text-ayurGreen-600 font-bold"><span>View Trial Report</span><ArrowRight className="h-3 w-3"/></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white flex items-center space-x-2">
            <Activity className="h-5 w-5 text-ayurGreen-600" />
            <span>Upload Daily Health & Vitals</span>
          </h3>
          <form onSubmit={handleHealthLogSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Select Contracted Trial</label>
              <select value={healthLog.trial_id} onChange={e=>setHealthLog({...healthLog, trial_id: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required>
                <option value="">-- Choose Contracted Trial --</option>
                {contractedTrials.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Vitals Summary (BP, Temperature, Pulse)</label>
              <input type="text" value={healthLog.vitals} onChange={e=>setHealthLog({...healthLog, vitals: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. BP: 120/80, Temp: 98.4°F" required />
            </div>
            <div>
              <label className="block text-sm font-medium">Notes & Symptoms</label>
              <textarea value={healthLog.notes} onChange={e=>setHealthLog({...healthLog, notes: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="How are you feeling today?" />
            </div>
            <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Submit Daily Health Log</button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <span>Raise Health Issue (Contracted Trials Only)</span>
            </h3>
            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Select Contracted Trial</label>
                <select value={aeForm.trial_id} onChange={e=>setAeForm({...aeForm, trial_id: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required>
                  <option value="">-- Choose Contracted Trial --</option>
                  {contractedTrials.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Symptom / MedDRA Term</label>
                <input type="text" value={aeForm.term} onChange={e=>setAeForm({...aeForm, term: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Mild headache" required />
              </div>
              <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Raise Alarm</button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-3">
            <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Prescriptions & Doctor Solutions</h3>
            {myEvents.length === 0 ? <p className="text-xs text-gray-500">No active health issues or prescriptions.</p> : myEvents.map(ev => (
              <div key={ev.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-ayurGreen-900 dark:text-white">Issue: {ev.meddra_preferred_term}</p>
                <p className="text-green-700 dark:text-green-300 font-semibold">Doctor Solution: {ev.doctor_solution || "Pending doctor review..."}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}