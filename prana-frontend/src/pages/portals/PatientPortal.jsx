import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ShieldCheck, FileText, CheckCircle2, AlertTriangle, User, Activity, ArrowRight, Sparkles, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetProfile, apiGetContracts, apiReportAE, apiLogDailyHealth, apiGetAdverseEvents, apiGetTrials } from '../../services/api';

export default function PatientPortal() {
  const [profile, setProfile] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [trials, setTrials] = useState([]);
  const [events, setEvents] = useState([]);
  
  const [healthLog, setHealthLog] = useState({ trial_id: '', vitals: '', notes: '' });
  const [aeForm, setAeForm] = useState({ trial_id: '', term: '', severity: 'Mild' });
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const userProfile = await apiGetProfile(token);
      setProfile(userProfile);

      const allContracts = await apiGetContracts(token);
      const myContracts = (allContracts || []).filter(c => c.patient_id === userProfile.id);
      setContracts(myContracts);

      const allTrials = await apiGetTrials(token);
      setTrials(allTrials || []);

      const allEvents = await apiGetAdverseEvents(token);
      setEvents(allEvents || []);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  // Map contracted trials to include their full titles, ctri numbers, and assigned doctor ID
  const contractedTrials = contracts.map(c => {
    const trialObj = trials.find(t => t.id === c.trial_id);
    return {
      id: c.trial_id,
      contract_id: c.id,
      doctor_id: c.doctor_id,
      title: trialObj ? trialObj.title : `Clinical Trial #${c.trial_id}`,
      ctri_number: trialObj ? trialObj.ctri_number : 'CRDA/AIIA/2026',
      contract_ref: c.contract_ref,
      e_signature: c.e_signature
    };
  });

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
    if (!aeForm.trial_id || !aeForm.term) {
      return alert('Please select a trial and describe your symptom.');
    }
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
      loadData();
    } catch (err) { alert(err.message); }
  };

  const myEvents = events.filter(e => e.patient_id === profile?.id || e.patient_name?.includes(profile?.full_name));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Personalized Greeting Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-ayurGreen-100 dark:bg-gray-700 text-ayurGreen-600 rounded-2xl">
            <User className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-ayurGreen-900 dark:text-white">
                Welcome back, {profile?.full_name || 'Participant'}!
              </h1>
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Patient ID: <span className="font-mono font-bold">#{profile?.id}</span> • Active Participant in AIIA Clinical Trials
            </p>
          </div>
        </div>
        <div className="bg-ayurGreen-50 dark:bg-gray-700 px-4 py-2 rounded-xl text-xs font-semibold text-ayurGreen-800 dark:text-ayurGreen-300 border border-ayurGreen-200 dark:border-gray-600">
          DPDP Act 2023 Secure Data Vault
        </div>
      </div>

      {msg && <div className="p-4 bg-green-100 text-green-800 rounded-xl">{msg}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Contracts" value={contracts.length} icon={FileText} subtitle="Signed trial agreements" />
        <Card title="Informed Consent" value="Signed (E-Verified)" icon={CheckCircle2} subtitle="DPDP Act 2023 Compliant" />
        <Card title="Doctor Solutions" value={myEvents.filter(e=>e.doctor_solution).length} icon={ShieldCheck} subtitle="Prescriptions received" />
      </div>

      {/* Patient Active Contracts List with Universal E-Signature (Text & Image Support) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Your Enrolled Clinical Trials & Assigned Doctors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contractedTrials.length === 0 ? <p className="text-xs text-gray-500">No active contracts found.</p> : contractedTrials.map(t => (
            <div key={t.contract_id} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-3 text-xs border border-ayurGreen-100 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold bg-ayurGreen-200 text-ayurGreen-900 px-2 py-0.5 rounded">{t.ctri_number}</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{t.title}</h4>
                <p className="text-gray-500 mt-1">Contract Ref: {t.contract_ref}</p>
                
                {/* UNIVERSAL E-SIGNATURE VIEWER (Handles both Image & Text) */}
                <div className="mt-2">
                  <span className="text-gray-400 block text-[10px]">Verified Consent E-Signature:</span>
                  {t.e_signature && t.e_signature.startsWith('data:image') ? (
                    <div className="bg-white p-1.5 rounded border inline-block mt-1">
                      <img src={t.e_signature} alt="Patient Signature" className="h-10 object-contain" />
                    </div>
                  ) : (
                    <p className="font-serif italic text-ayurGreen-700 dark:text-ayurGreen-300 mt-0.5">"{t.e_signature}"</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center pt-2 border-t border-ayurGreen-200 dark:border-gray-600 gap-2">
                <button 
                  onClick={() => navigate(`/doctor/${t.doctor_id}`)} 
                  className="bg-ayurGreen-600 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 hover:bg-ayurGreen-700 transition"
                >
                  <Stethoscope className="h-3 w-3"/><span>View Doctor Profile & DM</span>
                </button>
                <span 
                  onClick={() => navigate(`/trials/${t.id}`)} 
                  className="text-ayurGreen-700 dark:text-ayurGreen-300 font-bold cursor-pointer hover:underline flex items-center space-x-1"
                >
                  <span>Trial Report</span><ArrowRight className="h-3 w-3"/>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Daily Health & Vitals */}
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
          {/* Raise Health Issue */}
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
              <div>
                <label className="block text-sm font-medium">Severity</label>
                <select value={aeForm.severity} onChange={e=>setAeForm({...aeForm, severity: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Raise Alarm</button>
            </form>
          </div>

          {/* Prescriptions & Doctor Solutions */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-3">
            <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Prescriptions & Doctor Solutions</h3>
            {myEvents.length === 0 ? <p className="text-xs text-gray-500">No active health issues or prescriptions.</p> : myEvents.map(ev => (
              <div key={ev.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-ayurGreen-900 dark:text-white">Issue: {ev.meddra_preferred_term} ({ev.severity})</p>
                <p className="text-green-700 dark:text-green-300 font-semibold">Doctor Solution: {ev.doctor_solution || "Pending doctor review..."}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}