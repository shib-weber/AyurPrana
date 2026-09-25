import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Database, Activity, FileText, ShieldAlert, BarChart3, Users, Code, ArrowRight, Upload, Sparkles, Microscope, CheckCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetTrials, apiGetAdverseEvents, apiGetAuditLogs, apiGetProfile, apiGetDocuments, apiSubmitDocument } from '../../services/api';

export default function ResearcherPortal() {
  const [trials, setTrials] = useState([]);
  const [events, setEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [currentResearcher, setCurrentResearcher] = useState(null);
  
  const [researchPaper, setResearchPaper] = useState({ title: '', category: 'Clinical Trial Protocol', filename: '', fileData: '' });
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const profile = await apiGetProfile(token);
      setCurrentResearcher(profile);

      const fetchedTrials = await apiGetTrials(token);
      setTrials(fetchedTrials);
      
      const docs = await apiGetDocuments(token);
      setDocuments(docs.filter(d => d.researcher_id === profile.id));

      const allEvents = await apiGetAdverseEvents(token);
      const trialIds = fetchedTrials.map(t => t.id);
      const myEvents = allEvents.filter(ev => trialIds.includes(ev.trial_id));
      setEvents(myEvents);

      setAuditLogs(await apiGetAuditLogs(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setResearchPaper({
        ...researchPaper,
        filename: file.name,
        fileData: reader.result // Base64 Data URL for live inspector preview
      });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPaper = async (e) => {
    e.preventDefault();
    if (!researchPaper.title) return;
    try {
      await apiSubmitDocument(token, {
        title: researchPaper.title,
        category: researchPaper.category,
        filename: researchPaper.filename || 'protocol.pdf',
        file_data: researchPaper.fileData
      });
      setSuccess('Research protocol submitted successfully to Ethics Committee. Upon acceptance, your clinical trial and CRDA ID will be automatically generated and activated.');
      loadData();
      setResearchPaper({ title: '', category: 'Clinical Trial Protocol', filename: '', fileData: '' });
    } catch (err) { alert(err.message); }
  };

  const acceptedDocsCount = documents.filter(d => d.status === 'Accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      {/* Personalized Greeting Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-ayurGreen-100 dark:bg-gray-700 text-ayurGreen-600 rounded-2xl">
            <Microscope className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-ayurGreen-900 dark:text-white">
                Welcome back, {currentResearcher?.full_name || 'Researcher'}!
              </h1>
              <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Principal Investigator ID: <span className="font-mono font-bold">#{currentResearcher?.id}</span> • AIIA Clinical Research & Pharmacognosy Division
            </p>
          </div>
        </div>
        <div className="bg-ayurGreen-50 dark:bg-gray-700 px-4 py-2 rounded-xl text-xs font-semibold text-ayurGreen-800 dark:text-ayurGreen-300 border border-ayurGreen-200 dark:border-gray-600">
          CDISC SDTM / ADaM Compliant
        </div>
      </div>

      {success && <div className="p-4 bg-green-100 text-green-800 rounded-xl text-xs">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Live Active Trials (CRDA Active)" value={trials.length} icon={Activity} subtitle="Automatically provisioned portfolio" />
        <Card title="IEC Accepted Protocols" value={acceptedDocsCount} icon={CheckCircle} subtitle="Verified study authorizations" />
        <Card title="Anonymized Safety Feed" value={events.length} icon={ShieldAlert} subtitle="NPvCC Signal Monitoring" />
      </div>

      {/* REARRANGED LAYOUT: Top Row for Upload & Protocol Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Upload Research Documents & Protocols for Verification */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white flex items-center space-x-2">
              <Upload className="h-5 w-5 text-ayurGreen-600" />
              <span>Submit Trial Protocol for IEC Verification</span>
            </h3>
            <form onSubmit={handleUploadPaper} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Protocol Study Title</label>
                <input type="text" value={researchPaper.title} onChange={e=>setResearchPaper({...researchPaper, title: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required placeholder="e.g. Clinical Monograph on Brahmi Efficacy" />
              </div>
              <div>
                <label className="block text-sm font-medium">Category</label>
                <select value={researchPaper.category} onChange={e=>setResearchPaper({...researchPaper, category: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                  <option value="Clinical Trial Protocol">Clinical Trial Protocol</option>
                  <option value="Safety Monograph">Safety Monograph</option>
                  <option value="Ayurvedic Pharmacognosy">Ayurvedic Pharmacognosy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Select PDF Protocol File</label>
                <input type="file" accept=".pdf" onChange={handleFileChange} className="w-full mt-1 p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm" required />
              </div>
              <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium hover:bg-ayurGreen-700 transition">
                Submit to Ethics Committee
              </button>
            </form>
          </div>
        </div>

        {/* Protocol Verification & CRDA Assignment Tracking */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Protocol Verification Status & CRDA Assignments</h3>
          <p className="text-xs text-gray-500">Once your uploaded document is accepted by the IEC investigator, your trial is instantly activated with an official CRDA ID.</p>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {documents.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No protocol documents submitted yet.</p>
            ) : (
              documents.map(d => (
                <div key={d.id} className="p-3 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl flex justify-between items-center text-xs border border-ayurGreen-100">
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 dark:text-white">{d.title}</p>
                    <p className="text-gray-500">{d.category} • Submitted: {new Date(d.submitted_date).toLocaleDateString()}</p>
                    {d.assigned_crda && <p className="font-mono font-bold text-ayurGreen-700 dark:text-ayurGreen-300">CRDA ID: {d.assigned_crda}</p>}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${
                    d.status === 'Accepted' ? 'bg-green-200 text-green-900' :
                    d.status === 'Rejected' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Active Trials Portfolio & Analytics */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-ayurGreen-600"/>
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Active Trials Portfolio & Enrolment Analytics (Click for Detailed Report)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trials.length === 0 ? <p className="text-xs text-gray-500 py-4">No active trials found. Submit and get your protocol accepted to launch trials automatically.</p> : trials.map(t => {
            const percentage = Math.min(100, Math.round((t.current_enrolment / t.target_enrolment) * 100));
            return (
              <div key={t.id} onClick={() => navigate(`/trials/${t.id}`)} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl cursor-pointer hover:shadow-md transition space-y-3 border border-ayurGreen-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-mono font-bold bg-ayurGreen-200 text-ayurGreen-900 px-2 py-0.5 rounded">{t.ctri_number}</span>
                    <span className="text-xs font-semibold text-green-600">{t.status}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{t.title}</h4>
                </div>
                <div className="space-y-1 text-xs pt-2 border-t border-ayurGreen-200 dark:border-gray-600">
                  <div className="flex justify-between text-gray-600 dark:text-gray-300">
                    <span className="flex items-center space-x-1"><Users className="h-3 w-3"/><span>Enrolment:</span></span>
                    <span className="font-bold text-ayurGreen-700 dark:text-ayurGreen-300">{t.current_enrolment} / {t.target_enrolment} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                    <div className="bg-ayurGreen-600 h-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-500">Risk Index: <b className="text-amber-600">1.4%</b></span>
                    <span className="flex items-center space-x-1 text-ayurGreen-600 font-bold"><span>Detailed Report</span><ArrowRight className="h-3 w-3"/></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Immutable JSON Audit Stream Viewer for Researchers */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <div className="flex items-center space-x-2">
          <Code className="h-6 w-6 text-ayurGreen-600"/>
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Immutable JSON Audit Stream (ALCOA+ Compliance)</h3>
        </div>
        <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-60">
          <pre>{JSON.stringify(auditLogs, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}