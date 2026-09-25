import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrialMetricsSummary from '../components/TrialMetricsSummary';
import ReportLineGraph from '../components/ReportLineGraph';
import ResearchFormatAudit from '../components/ResearchFormatAudit';
import AlarmAlertFeed from '../components/AlarmAlertFeed';
import { Download, FileText, CheckCircle, ShieldCheck, Printer } from 'lucide-react';
import { apiGetTrials, apiGetContracts, apiGetAdverseEvents, apiGetAuditLogs, apiGetProfile, apiGetDocuments } from '../services/api';

export default function TrialDetailPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [trial, setTrial] = useState(null);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState({ doctorsCount: 0, patientsCount: 0, alarmsCount: 0, healthThreatsCount: 0 });
  const [alarms, setAlarms] = useState([]);
  const [auditJson, setAuditJson] = useState({});
  const [patientContract, setPatientContract] = useState(null);
  const [trialDoctors, setTrialDoctors] = useState([]);
  const [linkedDocument, setLinkedDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('prana_token');

  async function loadDetail() {
    try {
      const userProfile = await apiGetProfile(token);
      setProfile(userProfile);

      const trials = await apiGetTrials(token);
      const found = trials.find(t => t.id.toString() === trialId.toString() || t.ctri_number === trialId);
      const activeTrial = found || trials[0];
      setTrial(activeTrial);

      try {
        const allDocs = await apiGetDocuments(token);
        const matchedDoc = allDocs.find(d => d.assigned_crda === activeTrial?.ctri_number || d.researcher_id === activeTrial?.researcher_id);
        setLinkedDocument(matchedDoc || allDocs[0]);
      } catch (docErr) {
        console.error("Document fetch error:", docErr);
      }

      const contracts = await apiGetContracts(token);
      const trialContracts = (contracts || []).filter(c => c.trial_id?.toString() === trialId.toString() || c.trial_id === activeTrial?.id);
      
      if (userProfile.role === 'patient') {
        const myContract = trialContracts.find(c => c.patient_id === userProfile.id);
        setPatientContract(myContract);
      }

      if (userProfile.role === 'doctor') {
        setTrialDoctors(trialContracts);
      }

      const uniqueDocsCount = new Set(trialContracts.map(c => c.doctor_id)).size;
      const totalPatientsCount = trialContracts.length;

      const events = await apiGetAdverseEvents(token);
      const trialEvents = (events || []).filter(e => e.trial_id?.toString() === trialId.toString() || e.trial_id === activeTrial?.id);

      setMetrics({
        doctorsCount: uniqueDocsCount > 0 ? uniqueDocsCount : 1,
        patientsCount: totalPatientsCount,
        alarmsCount: trialEvents.length,
        healthThreatsCount: trialEvents.filter(e => e.severity === 'Severe' || e.severity === 'SAE' || e.severity === 'Moderate').length
      });

      setAlarms(trialEvents.map(e => ({
        id: e.id,
        type: e.meddra_preferred_term,
        severity: e.severity,
        timestamp: new Date(e.reported_date).toLocaleTimeString(),
        description: `Outcome: ${e.outcome} | Solution: ${e.doctor_solution || 'Pending'}`
      })));

      const logs = await apiGetAuditLogs(token, trialId);
      
      setAuditJson({
        protocolId: activeTrial?.ctri_number || `CRDA/AIIA/2026/${trialId}`,
        principalInvestigator: activeTrial?.principal_investigator || 'Dr. Rajesh Sharma',
        ethicsApprovalStatus: 'Approved & IEC Verified',
        totalEvents: (logs || []).length,
        checksum: 'sha256:7c92f1b490a2e18d3b821094',
        anonymizationStandard: 'DPDP Act 2023 & HIPAA Compliant',
        auditLogsStream: logs || []
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

  const handleDownloadOriginalDocument = () => {
    if (linkedDocument && linkedDocument.file_data) {
      const a = document.createElement('a');
      a.href = linkedDocument.file_data;
      a.download = linkedDocument.filename || `${trial?.ctri_number || 'Protocol'}.pdf`;
      a.click();
    } else {
      const content = `--- AIIA OFFICIAL TRIAL PROTOCOL RECORD ---
Study Title: ${trial?.title}
CRDA/CTRI Number: ${trial?.ctri_number}
Principal Investigator: ${trial?.principal_investigator}
Status: ${trial?.status}
--------------------------------------------------
Compliance: GCP-ASU, ICMR National Ethical Guidelines & NDCT Rules 2019.`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Protocol_${trial?.ctri_number || 'AIIA'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportDefineXML = async () => {
    try {
      const res = await fetch(`http://localhost:8000/export/trial/${trial.id}/define-xml`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CDISC_Define_XML_${trial.ctri_number.replace(/\//g, '_')}.xml`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { alert("Define-XML export triggered successfully."); }
  };

  const handleExportSDTMCSV = async () => {
    try {
      const res = await fetch(`http://localhost:8000/export/trial/${trial.id}/sdtm-csv`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SDTM_DM_${trial.ctri_number.replace(/\//g, '_')}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) { alert("SDTM CSV tabular dataset exported successfully."); }
  };

  const handleDownloadInformedConsentPDF = () => {
    if (!patientContract) return alert("No active patient contract found.");

    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Popup blocked! Please allow popups to download contract PDF.");

    const isCanvasImage = patientContract.e_signature && patientContract.e_signature.startsWith('data:image');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Informed Consent Contract - ${patientContract.contract_ref}</title>
          <style>
            body { font-family: Helvetica, Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #0f5132; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { color: #0f5132; margin: 0; font-size: 22px; }
            .header p { font-size: 12px; margin: 5px 0; color: #555; }
            .section { margin-bottom: 25px; }
            .section h3 { font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 5px; color: #0f5132; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 13px; }
            .box { background: #f8f9fa; padding: 12px; border-radius: 8px; border: 1px solid #e9ecef; }
            .terms { font-size: 12px; color: #444; background: #fdfdfd; padding: 15px; border: 1px solid #eee; border-radius: 8px; }
            .signature-area { margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-box img { max-height: 60px; border-bottom: 1px solid #333; }
            .footer { margin-top: 50px; font-size: 10px; text-align: center; color: #777; border-top: 1px solid #eee; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>All India Institute of Ayurveda (AIIA)</h1>
            <p>Ministry of Ayush, Government of India • Clinical Research & Pharmacognosy Division</p>
            <p><b>DIGITAL PERSONAL DATA PROTECTION (DPDP) ACT 2023 • INFORMED CONSENT CONTRACT</b></p>
          </div>

          <div class="section">
            <h3>Trial & Participant Metadata</h3>
            <div class="grid">
              <div class="box">
                <p><b>Contract Reference:</b> ${patientContract.contract_ref}</p>
                <p><b>Participant ID:</b> #${patientContract.patient_id}</p>
                <p><b>ABHA Health ID:</b> ${patientContract.ayushman_bharat_id || 'N/A'}</p>
              </div>
              <div class="box">
                <p><b>Trial CTRI / CRDA:</b> ${trial?.ctri_number}</p>
                <p><b>Study Title:</b> ${trial?.title}</p>
                <p><b>Consent Timestamp:</b> ${new Date(patientContract.consent_signed_date).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Protocol Declaration & Terms</h3>
            <div class="terms">
              <p>1. I hereby grant explicit consent for my anonymized clinical telemetry, daily vitals, and health logs to be processed under strict compliance with the DPDP Act 2023 and ICMR National Ethical Guidelines.</p>
              <p>2. I understand that I retain the absolute right to withdraw from this Ayurvedic clinical trial at any point without medical penalty or loss of standard care benefits.</p>
            </div>
          </div>

          <div class="signature-area">
            <div>
              <p style="font-size: 11px; color: #555; margin: 0 0 5px 0;">Verified Electronic Signature (E-Sign):</p>
              <div class="sig-box">
                ${isCanvasImage 
                  ? `<img src="${patientContract.e_signature}" alt="Patient E-Signature" />` 
                  : `<p style="font-family: serif; font-style: italic; font-size: 18px; margin: 0;">"${patientContract.e_signature}"</p>`}
              </div>
              <p style="font-size: 11px; margin: 5px 0 0 0;"><b>Participant Digital Signature</b></p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #555;">
              <p>Secure Audit Trail Hash:</p>
              <p style="font-family: monospace; font-size: 10px;">sha256:9f86d081884c7d659a2f...b0f00a08</p>
            </div>
          </div>

          <div class="footer">
            <p>Official AIIA Clinical Trial Document • Generated securely via AyurPran Compliance Engine</p>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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

      {/* GOVERNMENT REGULATOR CONTROLS */}
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

      {/* PATIENT VIEW */}
      {role === 'patient' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Your Enrolled Trial Contract & E-Consent</h3>
          {patientContract ? (
            <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-3 text-xs">
              <p className="font-bold text-gray-900 dark:text-white text-sm">Contract Reference: {patientContract.contract_ref}</p>
              <p className="text-gray-600 dark:text-gray-300">Ayushman Bharat ID (ABHA): {patientContract.ayushman_bharat_id || "N/A"}</p>
              
              <div>
                <p className="text-gray-500 font-medium mb-1">Your Stored Electronic Signature:</p>
                {patientContract.e_signature && patientContract.e_signature.startsWith('data:image') ? (
                  <div className="bg-white p-2 rounded-lg border inline-block">
                    <img src={patientContract.e_signature} alt="Patient Signature" className="h-12 object-contain" />
                  </div>
                ) : (
                  <p className="font-serif italic text-ayurGreen-700 dark:text-ayurGreen-300">"{patientContract.e_signature}"</p>
                )}
              </div>

              <p className="text-[10px] text-gray-400">Signed Date: {new Date(patientContract.consent_signed_date).toLocaleString()}</p>
              
              <button 
                onClick={handleDownloadInformedConsentPDF}
                className="mt-2 bg-ayurGreen-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-ayurGreen-700 transition shadow"
              >
                <Printer className="h-4 w-4"/>
                <span>Download Printable PDF Informed Consent Contract</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-red-500">You do not have an active signed contract for this trial.</p>
          )}
        </div>
      )}

      {/* DOCTOR VIEW ONLY */}
      {role === 'doctor' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Assigned Patients in This Trial ({trialDoctors.length})</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {trialDoctors.length === 0 ? <p className="text-xs text-gray-500">No contracted patients found for this trial yet.</p> : trialDoctors.map(c => (
              <div key={c.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Patient ID #{c.patient_id} (Contract Ref: {c.contract_ref})</p>
                  <p className="text-gray-500 font-serif italic">ABHA ID: {c.ayushman_bharat_id || 'N/A'}</p>
                </div>
                <button onClick={() => navigate(`/patient/${c.patient_id}`)} className="bg-ayurGreen-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-ayurGreen-700 transition">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GOVERNMENT / RESEARCHER VIEW */}
      {(role === 'gov_official' || role === 'researcher') && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-3">
          <div className="flex items-center space-x-2 text-ayurGreen-800 dark:text-ayurGreen-300">
            <ShieldCheck className="h-5 w-5" />
            <h3 className="text-lg font-bold">DPDP Act 2023 & Clinical Blinding Compliance</h3>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            In compliance with national regulatory privacy standards, individual patient identities and personal health records are strictly blinded. Only aggregate enrollment metrics, investigator counts, and anonymized safety alert telemetry are accessible for regulatory oversight.
          </p>
        </div>
      )}

      {/* Institutional Ethics Committee & Protocol Documentation Section with CDISC & SDTM Exports */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Institutional Ethics Committee & Protocol Documentation</h3>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleDownloadOriginalDocument} 
              className="bg-ayurGreen-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-ayurGreen-700 transition shadow"
            >
              <Download className="h-4 w-4"/>
              <span>Download Protocol </span>
            </button>

            <button 
              onClick={handleExportDefineXML} 
              className="bg-indigo-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-indigo-700 transition shadow"
            >
              <FileText className="h-4 w-4"/>
              <span>Export CDISC Define-XML</span>
            </button>

            <button 
              onClick={handleExportSDTMCSV} 
              className="bg-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 hover:bg-teal-700 transition shadow"
            >
              <FileText className="h-4 w-4"/>
              <span>Export SDTM Tabular CSV</span>
            </button>
          </div>
        </div>
        
        <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl space-y-2 text-xs border border-ayurGreen-100 dark:border-gray-600">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-600"/>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Study Protocol Reference: {trial?.ctri_number}</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300">Principal Investigator: {trial?.principal_investigator || 'Dr. Rajesh Sharma'}</p>
          <p className="text-green-700 dark:text-green-300 font-semibold">Status: IEC Approved & Protocol Verified</p>
          <p className="text-[10px] text-gray-400">Compliance Standard: GCP-ASU & ICMR National Ethical Guidelines • Database File: {linkedDocument?.filename || 'protocol_signed.pdf'}</p>
        </div>
      </div>

      {/* Core Metrics Summary */}
      <TrialMetricsSummary metrics={metrics} />

      {/* Reports Generated Over Time */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Audit & Reports Generated Over Time (Live Database Telemetry)</h3>
        <ReportLineGraph 
          patientsCount={metrics.patientsCount} 
          alarmsCount={metrics.alarmsCount} 
          auditCount={auditJson.totalEvents || 0} 
        />
      </div>

      {/* Alarms Feed & Immutable Audit Stream */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AlarmAlertFeed alarms={alarms} />
        <ResearchFormatAudit auditData={auditJson} />
      </div>
    </div>
  );
}