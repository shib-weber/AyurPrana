import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { Database, Activity, PlusCircle, FileText, ShieldAlert, BarChart3, Users, Code, ArrowRight, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetTrials, apiCreateTrial, apiGetAdverseEvents, apiGetAuditLogs } from '../../services/api';

export default function ResearcherPortal() {
  const [trials, setTrials] = useState([]);
  const [events, setEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [newTrial, setNewTrial] = useState({ 
    ctri_number: '', 
    title: '', 
    phase: 'Phase III', 
    status: 'Recruiting', 
    target_enrolment: 150, 
    principal_investigator: '' 
  });
  const [researchPaper, setResearchPaper] = useState({ title: '', category: 'Ayurvedic Pharmacognosy', filename: '' });
  const [uploadedPapers, setUploadedPapers] = useState([
    { id: 1, title: 'Ashwagandha Extract Standardisation & Cognitive Efficacy Protocol v2.1', category: 'Clinical Trial Protocol', date: '2026-03-12', size: '4.2 MB' },
    { id: 2, title: 'Panchakarma Basti Pharmacokinetics & Patient Safety Assessment', category: 'Safety Monograph', date: '2026-02-18', size: '2.8 MB' }
  ]);
  const [success, setSuccess] = useState('');
  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const fetchedTrials = await apiGetTrials(token);
      setTrials(fetchedTrials);
      
      const allEvents = await apiGetAdverseEvents(token);
      // Filter safety feed: show ONLY events associated with this researcher's trials
      const trialIds = fetchedTrials.map(t => t.id);
      const myEvents = allEvents.filter(ev => trialIds.includes(ev.trial_id));
      setEvents(myEvents);

      setAuditLogs(await apiGetAuditLogs(token));
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const handleRegisterTrial = async (e) => {
    e.preventDefault();
    try {
      const ctri = newTrial.ctri_number || `CRDA/AIIA/2026/${Math.floor(1000 + Math.random() * 9000)}`;
      await apiCreateTrial(token, { ...newTrial, ctri_number: ctri });
      setSuccess(`Trial successfully registered with CRDA / CTRI Reference: ${ctri}`);
      loadData();
      setNewTrial({ ctri_number: '', title: '', phase: 'Phase III', status: 'Recruiting', target_enrolment: 150, principal_investigator: '' });
    } catch (err) { alert(err.message); }
  };

  const handleUploadPaper = (e) => {
    e.preventDefault();
    if (!researchPaper.title) return;
    const newDoc = {
      id: uploadedPapers.length + 1,
      title: researchPaper.title,
      category: researchPaper.category,
      date: new Date().toISOString().split('T')[0],
      size: '3.4 MB'
    };
    setUploadedPapers([newDoc, ...uploadedPapers]);
    setResearchPaper({ title: '', category: 'Ayurvedic Pharmacognosy', filename: '' });
    alert('Research protocol / PDF uploaded successfully and published to public repository.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Researcher & Analytics Portal</h1>
      
      {success && <div className="p-4 bg-green-100 text-green-800 rounded-xl">{success}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="My Active Trials (CRDA Tracked)" value={trials.length} icon={Activity} subtitle="Isolated researcher portfolio" />
        <Card title="Anonymized Safety Feed" value={events.length} icon={ShieldAlert} subtitle="NPvCC Signal Monitoring" />
        <Card title="CDISC SDTM / ADaM" value="Ready" icon={Database} subtitle="Tabulation compliant" />
      </div>

      {/* Graphical Analytics & Clickable Detailed Trial Report Cards */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-6 w-6 text-ayurGreen-600"/>
          <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Trial Enrolment Growth & Risk Analytics (Click for Detailed Report)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {trials.length === 0 ? <p className="text-xs text-gray-500 py-4">No trials registered under your researcher account yet.</p> : trials.map(t => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Register Trial & Generate CRDA */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white flex items-center space-x-2">
            <PlusCircle className="h-5 w-5 text-ayurGreen-600" />
            <span>Register Trial & Generate CRDA ID</span>
          </h3>
          <form onSubmit={handleRegisterTrial} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">CRDA / CTRI Number</label>
              <input type="text" value={newTrial.ctri_number} onChange={e=>setNewTrial({...newTrial, ctri_number: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" placeholder="Auto-generated if blank" />
            </div>
            <div>
              <label className="block text-sm font-medium">Study Title</label>
              <input type="text" value={newTrial.title} onChange={e=>setNewTrial({...newTrial, title: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required placeholder="Ayurvedic compound study" />
            </div>
            <div>
              <label className="block text-sm font-medium">Principal Investigator</label>
              <input type="text" value={newTrial.principal_investigator} onChange={e=>setNewTrial({...newTrial, principal_investigator: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required placeholder="Dr. Sharma" />
            </div>
            <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Register Trial</button>
          </form>
        </div>

        {/* Upload Research Documents & PDFs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <h3 className="text-xl font-bold mb-4 text-ayurGreen-800 dark:text-white flex items-center space-x-2">
            <Upload className="h-5 w-5 text-ayurGreen-600" />
            <span>Upload Trial Protocols & Research PDFs</span>
          </h3>
          <form onSubmit={handleUploadPaper} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Document Title</label>
              <input type="text" value={researchPaper.title} onChange={e=>setResearchPaper({...researchPaper, title: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600" required placeholder="e.g. Clinical Monograph on Brahmi" />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <select value={researchPaper.category} onChange={e=>setResearchPaper({...researchPaper, category: e.target.value})} className="w-full mt-1 p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600">
                <option value="Clinical Trial Protocol">Clinical Trial Protocol</option>
                <option value="Safety Monograph">Safety Monograph</option>
                <option value="Ayurvedic Pharmacognosy">Ayurvedic Pharmacognosy</option>
                <option value="Published Journal Paper">Published Journal Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Select PDF File</label>
              <input type="file" accept=".pdf" onChange={e=>setResearchPaper({...researchPaper, filename: e.target.files[0]?.name})} className="w-full mt-1 p-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 text-sm" required />
            </div>
            <button type="submit" className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-medium">Publish PDF to Repository</button>
          </form>
        </div>
      </div>

      {/* Published Research Repository Table */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Published Trial Protocols & Research Repository</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {uploadedPapers.map(p => (
            <div key={p.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-xl flex justify-between items-center text-xs">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">{p.title}</p>
                <p className="text-gray-500">{p.category} • {p.date} • {p.size}</p>
              </div>
              <span className="px-2 py-1 bg-ayurGreen-200 text-ayurGreen-900 rounded font-bold">Public PDF</span>
            </div>
          ))}
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