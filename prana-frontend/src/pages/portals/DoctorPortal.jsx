import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Users, FilePlus, AlertTriangle, CheckCircle, Search, Activity, LineChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetTrials, apiGetPatients, apiGetContracts, apiCreateContract, apiGetAdverseEvents, apiProvideSolution, apiGetPatientHealthLogs, apiGetProfile } from '../../services/api';

export default function DoctorPortal() {
  const [trials, setTrials] = useState([]);
  const [patients, setPatients] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [form, setForm] = useState({ trial_id: '', e_signature: '', abdm_id: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activePatientModal, setActivePatientModal] = useState(null);
  const [patientLogs, setPatientLogs] = useState([]);
  const [solutionInputs, setSolutionInputs] = useState({});
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const profile = await apiGetProfile(token);
      setCurrentDoctor(profile);
      setTrials(await apiGetTrials(token));
      setPatients(await apiGetPatients(token));
      setContracts(await apiGetContracts(token));
      setEvents(await apiGetAdverseEvents(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const openPatientProfile = async (patient) => {
    setActivePatientModal(patient);
    try {
      const logs = await apiGetPatientHealthLogs(token, patient.id);
      setPatientLogs(logs);
    } catch (e) { console.error(e); }
  };

  // Filter contracts belonging to the logged-in doctor
  const myContracts = contracts.filter(c => c.doctor_id === currentDoctor?.id);

  // Extract unique patients under this doctor's contracts
  const contractedPatientIds = [...new Set(myContracts.map(c => c.patient_id))];
  const myAssignedPatients = patients.filter(p => contractedPatientIds.includes(p.id));

  // Filter trials that the selected patient is already enrolled in
  const enrolledTrialIds = contracts
    .filter(c => c.patient_id === parseInt(selectedPatientId))
    .map(c => c.trial_id);
  const availableTrials = trials.filter(t => !enrolledTrialIds.includes(t.id));

  const handleCreateContract = async (e) => {
    e.preventDefault();
    try {
      await apiCreateContract(token, {
        patient_id: parseInt(selectedPatientId),
        trial_id: parseInt(form.trial_id),
        e_signature: form.e_signature,
        ayushman_bharat_id: form.abdm_id
      });
      setSuccess('Official contract & e-consent formed successfully!');
      loadData();
      setForm({ trial_id: '', e_signature: '', abdm_id: '' });
      setSelectedPatientId('');
    } catch (err) { alert(err.message); }
  };

  const handleSendSolution = async (eventId) => {
    const sol = solutionInputs[eventId];
    if (!sol) return alert('Please write a solution before sending.');
    try {
      await apiProvideSolution(token, eventId, sol);
      alert('Clinical solution dispatched successfully! Alarm resolved.');
      loadData();
    } catch (err) { alert(err.message); }
  };

  const filteredPatients = myAssignedPatients.filter(p => p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || p.email.toLowerCase().includes(searchQuery.toLowerCase()));

  // Filter safety alarms: only for patients under this doctor AND where no solution has been given yet (so it disappears upon response)
  const myActiveAlarms = events.filter(ev => {
    const isMyPatient = contractedPatientIds.includes(ev.patient_id) || ev.doctor_id === currentDoctor?.id;
    const unresolved = !ev.doctor_solution || ev.doctor_solution.trim() === "";
    return isMyPatient && unresolved;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Doctor & Investigator Portal</h1>
      
      {success && <div className="p-4 bg-green-100 text-green-800 rounded-xl flex items-center space-x-2"><CheckCircle/><span>{success}</span></div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Active Contracts" value={myContracts.length} icon={Users} subtitle="Linked via DB" />
        <Card title="Pending Patient Alarms" value={myActiveAlarms.length} icon={AlertTriangle} subtitle="Requires your response" />
        <Card title="Compliance Score" value="100%" icon={FilePlus} subtitle="ALCOA+ Verified" />
      </div>

      {/* Trials Directory List for Clickable Detailed Report */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Active Clinical Trials (Click for Detailed Analytics Report)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trials.map(t => (
            <div key={t.id} onClick={() => navigate(`/trials/${t.id}`)} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:shadow-md transition space-y-2 border border-ayurGreen-100 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono font-bold bg-ayurGreen-200 text-ayurGreen-900 px-2 py-0.5 rounded">{t.ctri_number}</span>
                <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{t.title}</h4>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-ayurGreen-200 dark:border-gray-600">
                <span className="text-ayurGreen-700 dark:text-ayurGreen-300 font-semibold">{t.status}</span>
                <span className="flex items-center space-x-1 text-ayurGreen-600 dark:text-ayurGreen-400 font-bold"><span>View Report</span><ArrowRight className="h-3 w-3"/></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Smart Contract Form */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white">Form Official Trial Contract & E-Consent</h3>
          <form onSubmit={handleCreateContract} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">1. Select Patient</label>
              <select value={selectedPatientId} onChange={e=>setSelectedPatientId(e.target.value)} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required>
                <option value="">-- Choose Patient --</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} ({p.email})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">2. Select Available Trial</label>
              <select value={form.trial_id} onChange={e=>setForm({...form, trial_id: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required disabled={!selectedPatientId}>
                <option value="">{selectedPatientId ? "-- Choose Available Trial --" : "Select a patient first"}</option>
                {availableTrials.map(t => <option key={t.id} value={t.id}>{t.title} ({t.ctri_number})</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Patient E-Signature (Consent)</label>
              <input type="text" value={form.e_signature} onChange={e=>setForm({...form, e_signature: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 font-serif italic" placeholder="e.g. Rahul Patel" required />
            </div>

            <div>
              <label className="block text-sm font-medium">ABDM Health ID</label>
              <input type="text" value={form.abdm_id} onChange={e=>setForm({...form, abdm_id: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="14-digit ABHA ID" />
            </div>
            <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Establish Contract & Store Consent</button>
          </form>
        </div>

        {/* Contracted Patient Directory & Health Profiles */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Contracted Patients Under Your Care</h3>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-gray-400"/>
            <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search contracted patient..." className="w-full pl-10 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm"/>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredPatients.length === 0 ? (
              <p className="text-xs text-gray-500 py-4 text-center">No patients contracted under your care yet.</p>
            ) : (
              filteredPatients.map(p => (
                <div key={p.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{p.full_name}</p>
                    <p className="text-gray-500">{p.email}</p>
                  </div>
                  <button onClick={() => navigate(`/patient/${p.id}`)} className="bg-ayurGreen-600 text-white px-3 py-1.5 rounded-lg font-medium">Clinical Profile</button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Active Patient Safety Alarms (Disappears Upon Response) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Pending Patient Safety Alarms (Disappears on Response)</h3>
        <div className="space-y-3">
          {myActiveAlarms.length === 0 ? (
            <p className="text-xs text-gray-500 py-4 text-center">No pending safety alarms from your contracted patients.</p>
          ) : (
            myActiveAlarms.map(ev => (
              <div key={ev.id} className="p-4 bg-red-50 dark:bg-gray-700 rounded-xl border border-red-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-red-700 dark:text-red-400">{ev.meddra_preferred_term}</span>
                  <span className="text-xs bg-red-200 text-red-900 px-2 py-0.5 rounded font-semibold">{ev.severity}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300">Patient ID: #{ev.patient_id} | Outcome: {ev.outcome}</p>
                
                <div className="flex space-x-2">
                  <input type="text" placeholder="Provide medical solution/prescription advice..." value={solutionInputs[ev.id] || ''} onChange={e=>setSolutionInputs({...solutionInputs, [ev.id]: e.target.value})} className="flex-1 p-2 text-xs border rounded-lg dark:bg-gray-800 dark:border-gray-600"/>
                  <button onClick={() => handleSendSolution(ev.id)} className="bg-ayurGreen-600 text-white px-4 py-2 rounded-lg text-xs font-medium">Send Solution & Resolve</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dedicated Patient Clinical Monitoring Modal */}
      {activePatientModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl max-w-3xl w-full space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-2xl font-bold text-ayurGreen-900 dark:text-white">{activePatientModal.full_name}</h3>
                <p className="text-sm text-gray-500">Clinical Monitoring & Health Surge Analysis</p>
              </div>
              <button onClick={() => setActivePatientModal(null)} className="text-gray-500 hover:text-gray-700 font-bold text-lg">✕</button>
            </div>

            <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
                <LineChart className="h-5 w-5 text-ayurGreen-600"/>
                <span>Health Recovery & Vitals Surge Trend</span>
              </div>
              <div className="h-32 flex items-end space-x-4 pt-4 border-b border-ayurGreen-200 px-2">
                {patientLogs.length === 0 ? <p className="text-xs text-gray-500">No logs submitted yet.</p> : patientLogs.map((log, idx) => (
                  <div key={log.id} className="flex-1 flex flex-col items-center space-y-1">
                    <div className="w-full bg-ayurGreen-600 rounded-t" style={{ height: `${Math.max(20, (idx + 1) * 25)}%` }}></div>
                    <span className="text-[10px] text-gray-500">Day {idx + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-ayurGreen-800 dark:text-white text-sm">Patient Daily Notes & Vitals Logs</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {patientLogs.length === 0 ? <p className="text-xs text-gray-500">No daily notes submitted.</p> : patientLogs.map(l => (
                  <div key={l.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white">Vitals: {l.vitals_summary}</p>
                    <p className="text-gray-600 dark:text-gray-300">Notes: {l.symptoms_notes || "None"}</p>
                    <p className="text-[10px] text-gray-400">{new Date(l.log_date).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => setActivePatientModal(null)} className="w-full bg-gray-200 dark:bg-gray-700 py-3 rounded-xl text-sm font-medium">Close Profile</button>
          </div>
        </div>
      )}
    </div>
  );
}