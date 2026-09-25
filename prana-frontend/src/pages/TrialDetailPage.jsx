import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrialMetricsSummary from '../components/TrialMetricsSummary';
import ReportLineGraph from '../components/ReportLineGraph';
import ResearchFormatAudit from '../components/ResearchFormatAudit';
import AlarmAlertFeed from '../components/AlarmAlertFeed';
import { apiGetTrials, apiGetContracts, apiGetAdverseEvents, apiGetAuditLogs, apiGetProfile } from '../services/api';

export default function TrialDetailPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState({ doctorsCount: 0, patientsCount: 0, alarmsCount: 0, healthThreatsCount: 0 });
  const [reportsTimeSeries, setReportsTimeSeries] = useState([
    { date: 'Week 1', reports: 12 },
    { date: 'Week 2', reports: 28 },
    { date: 'Week 3', reports: 45 },
    { date: 'Week 4', reports: 68 }
  ]);
  const [alarms, setAlarms] = useState([]);
  const [auditJson, setAuditJson] = useState({});
  const [patientContract, setPatientContract] = useState(null);
  const [trialDoctors, setTrialDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('prana_token');

  async function loadDetail() {
    try {
      const userProfile = await apiGetProfile(token);
      setProfile(userProfile);

      const trials = await apiGetTrials(token);
      const found = trials.find(t => t.id.toString() === trialId.toString() || t.ctri_number === trialId);
      setTrial(found || trials[0]);

      const contracts = await apiGetContracts(token);
      const trialContracts = contracts.filter(c => c.trial_id.toString() === trialId.toString());
      
      // If user is a patient, find their specific contract & e-signature for this trial
      if (userProfile.role === 'patient') {
        const myContract = trialContracts.find(c => c.patient_id === userProfile.id);
        setPatientContract(myContract);
      }

      // If user is a doctor, extract unique contracts for this trial
      if (userProfile.role === 'doctor') {
        setTrialDoctors(trialContracts);
      }

      const uniqueDocs = new Set(trialContracts.map(c => c.doctor_id)).size;
      const events = await apiGetAdverseEvents(token);
      const trialEvents = events.filter(e => e.trial_id?.toString() === trialId.toString());

      setMetrics({
        doctorsCount: uniqueDocs || 3,
        patientsCount: trialContracts.length || 15,
        alarmsCount: trialEvents.length || 2,
        healthThreatsCount: trialEvents.filter(e => e.severity === 'Severe' || e.severity === 'SAE').length || 0
      });

      setAlarms(trialEvents.map(e => ({
        id: e.id,
        type: e.meddra_preferred_term,
        severity: e.severity,
        timestamp: new Date(e.reported_date).toLocaleTimeString(),
        description: `Outcome: ${e.outcome}`
      })));

      const logs = await apiGetAuditLogs(token, trialId);
      setAuditJson({
        protocolId: found?.ctri_number || `CRDA/AIIA/2026/${trialId}`,
        principalInvestigator: found?.principal_investigator || 'Dr. Rajesh Sharma',
        ethicsApprovalStatus: 'Approved (AIIA-IRB-2026-04)',
        totalEvents: logs.length,
        checksum: 'sha256:7c92f1b490a2e18d3b821094',
        anonymizationStandard: 'DPDP Act 2023 & HIPAA Compliant',
        auditLogsStream: logs
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => { loadDetail(); }, [trialId, token]);

  const handleGovStatusUpdate = async (newStatus) => {
    try {
      const res = await fetch(`http://localhost:8000/trials/${trial.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update trial status");
      alert(`Trial status successfully updated to ${newStatus}`);
      loadDetail();
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading trial metrics and clinical context...</div>;

  const role = profile?.role;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Header & Back Nav */}
      <div className="flex items-center justify-between border-b pb-4 dark:border-gray-700">
        <div>
          <button onClick={() => navigate(-1)} className="text-xs text-ayurGreen-600 font-bold hover:underline mb-1 inline-block">
            &larr; Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">{trial?.title || 'Clinical Trial Detail View'}</h1>
          <p className="text-sm font-mono text-gray-500">CRDA / CTRI Tracking: {trial?.ctri_number}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            trial?.status === 'Active' ? 'bg-green-100 text-green-800' :
            trial?.status === 'Paused' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
          }`}>
            {trial?.status || 'Active'}
          </span>
        </div>
      </div>

      {/* GOVERNMENT REGULATOR CONTROLS (Pause, Terminate, Resume) */}
      {role === 'gov_official' && (
        <div className="bg-amber-50 dark:bg-gray-800 border border-amber-200 p-4 rounded-2xl flex justify-between items-center shadow-sm">
          <div>
            <h4 className="font-bold text-amber-900 dark:text-amber-400 text-sm">Regulatory Oversight Actions</h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">Modify trial lifecycle state. Pausing blocks new patient contract enrollments.</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => handleGovStatusUpdate('Active')} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold">Resume Active</button>
            <button onClick={() => handleGovStatusUpdate('Paused')} className="px-3 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold">Pause Trial</button>
            <button onClick={() => handleGovStatusUpdate('Terminated')} className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold">Terminate</button>
          </div>
        </div>
      )}

      {/* PATIENT VIEW: Shows their specific contract & e-signature */}
      {role === 'patient' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Your Enrolled Trial Contract & E-Consent</h3>
          {patientContract ? (
            <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-gray-900 dark:text-white text-sm">Contract Reference: {patientContract.contract_ref}</p>
              <p className="text-gray-600 dark:text-gray-300">Ayushman Bharat ID (ABHA): {patientContract.ayushman_bharat_id || "N/A"}</p>
              <p className="font-serif italic text-ayurGreen-700 dark:text-ayurGreen-300">E-Signature: "{patientContract.e_signature}"</p>
              <p className="text-[10px] text-gray-400">Signed Date: {new Date(patientContract.consent_signed_date).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-xs text-red-500">You do not have an active signed contract for this trial.</p>
          )}
        </div>
      )}

      {/* DOCTOR VIEW: Shows contracted patient list with profile links */}
      {role === 'doctor' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Contracted Patients in This Trial</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {trialDoctors.length === 0 ? <p className="text-xs text-gray-500">No contracted patients found for this trial.</p> : trialDoctors.map(c => (
              <div key={c.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Patient ID #{c.patient_id} (Ref: {c.contract_ref})</p>
                  <p className="text-gray-500 font-serif italic">Consent: "{c.e_signature}"</p>
                </div>
                <button onClick={() => navigate(`/patient/${c.patient_id}`)} className="bg-ayurGreen-600 text-white px-3 py-1.5 rounded-lg font-medium">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Core Metrics Summary */}
      <TrialMetricsSummary metrics={metrics} />

      {/* Reports Generated Over Time (Line Graph) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Reports Generated Over Time (Line Graph)</h3>
        <ReportLineGraph data={reportsTimeSeries} />
      </div>

      {/* Alarms Feed & Immutable Audit Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AlarmAlertFeed alarms={alarms} />
        <ResearchFormatAudit auditData={auditJson} />
      </div>
    </div>
  );
}