import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { ShieldCheck, FileText, CheckCircle, XCircle, User, ArrowRight, Activity, AlertTriangle, Users, Download, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiGetDocuments, apiReviewDocument, apiGetProfile, apiGetTrials, apiGetContracts, apiGetAdverseEvents } from '../../services/api';

export default function InvestigatorReviewPortal() {
  const [documents, setDocuments] = useState([]);
  const [trials, setTrials] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [events, setEvents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [msg, setMsg] = useState('');
  
  // Detailed Modal Inspection State
  const [selectedDoc, setSelectedDoc] = useState(null);

  const token = localStorage.getItem('prana_token');
  const navigate = useNavigate();

  async function loadData() {
    try {
      const userProfile = await apiGetProfile(token);
      setProfile(userProfile);
      
      const docs = await apiGetDocuments(token);
      setDocuments(docs);

      const allTrials = await apiGetTrials(token);
      setTrials(allTrials);

      const allContracts = await apiGetContracts(token);
      setContracts(allContracts);

      const allEvents = await apiGetAdverseEvents(token);
      setEvents(allEvents);
    } catch (err) { console.error(err); }
  }

  useEffect(() => { loadData(); }, [token]);

  const handleReview = async (docId, status) => {
    try {
      await apiReviewDocument(token, docId, status);
      setMsg(`Document successfully marked as ${status}. CRDA generated if accepted.`);
      setSelectedDoc(null);
      loadData();
    } catch (err) { alert(err.message); }
  };

  const handleDownloadDoc = (doc) => {
    if (doc.file_data) {
      const a = document.createElement('a');
      a.href = doc.file_data;
      a.download = doc.filename || 'protocol.pdf';
      a.click();
    } else {
      alert("No raw file payload found for this legacy record.");
    }
  };

  const pendingDocsCount = documents.filter(d => d.status === 'Pending').length;
  const acceptedDocsCount = documents.filter(d => d.status === 'Accepted').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 relative">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ayurGreen-900 dark:text-white">Institutional Ethics Committee & Investigator Review Portal</h1>
          <p className="text-sm text-gray-500 mt-1">Review researcher protocol submissions, inspect live uploaded documents, and issue AIIA CRDA numbers.</p>
        </div>
        <div className="bg-ayurGreen-50 dark:bg-gray-700 px-4 py-2 rounded-xl text-xs font-semibold text-ayurGreen-800 dark:text-ayurGreen-300 border border-ayurGreen-200">
          IEC Protocol Verification Active
        </div>
      </div>

      {msg && <div className="p-4 bg-green-100 text-green-800 rounded-xl text-xs">{msg}</div>}

      {/* Summary Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="Pending Protocol Reviews" value={pendingDocsCount} icon={FileText} subtitle="Awaiting IEC evaluation" />
        <Card title="Accepted Protocols (CRDA Live)" value={acceptedDocsCount} icon={CheckCircle} subtitle="Active trial authorizations" />
        <Card title="System Patient Alarms" value={events.length} icon={AlertTriangle} subtitle="Active safety flags across trials" />
      </div>

      {/* Submitted Research Protocols & Documentation Review Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
        <h3 className="text-xl font-bold text-ayurGreen-800 dark:text-white">Submitted Research Protocols & Documentation</h3>
        <div className="space-y-3">
          {documents.length === 0 ? (
            <p className="text-xs text-gray-500 py-6 text-center">No protocol documents pending review.</p>
          ) : (
            documents.map(doc => (
              <div key={doc.id} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs border border-ayurGreen-200 dark:border-gray-600">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      doc.status === 'Accepted' ? 'bg-green-200 text-green-900' :
                      doc.status === 'Rejected' ? 'bg-red-200 text-red-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {doc.status}
                    </span>
                    <span className="font-mono text-gray-500">ID: #{doc.id} | Researcher ID: #{doc.researcher_id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white">{doc.title}</h4>
                  <p className="text-gray-500">Category: {doc.category} • File: {doc.filename} • Submitted: {new Date(doc.submitted_date).toLocaleDateString()}</p>
                  {doc.assigned_crda && <p className="font-mono font-bold text-ayurGreen-700 dark:text-ayurGreen-300">Assigned CRDA: {doc.assigned_crda}</p>}
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => setSelectedDoc(doc)} className="bg-ayurGreen-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-1 hover:bg-ayurGreen-700 transition">
                    <Eye className="h-3.5 w-3.5"/><span>Inspect & Review Document</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* DETAILED DOCUMENT INSPECTION & EMBEDDED PREVIEW MODAL */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-gray-800 max-w-4xl w-full rounded-3xl shadow-2xl border border-ayurGreen-100 dark:border-gray-700 overflow-hidden flex flex-col h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-ayurGreen-900 text-white p-6 flex justify-between items-center shrink-0">
              <div>
                <span className="text-xs bg-ayurGreen-700 text-amber-300 px-2.5 py-0.5 rounded-full font-mono font-semibold">
                  Live Document Inspection #{selectedDoc.id}
                </span>
                <h2 className="text-xl font-bold mt-1">{selectedDoc.title}</h2>
              </div>
              <button onClick={() => setSelectedDoc(null)} className="p-2 hover:bg-white/10 rounded-full transition">
                <X className="h-6 w-6"/>
              </button>
            </div>

            {/* Modal Body: Embedded Document Viewer & Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 flex-grow overflow-hidden">
              
              {/* Left Column: Metadata & Actions */}
              <div className="lg:col-span-4 p-6 space-y-6 overflow-y-auto border-r border-gray-200 dark:border-gray-700 text-xs sm:text-sm bg-gray-50 dark:bg-gray-900/50">
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-500 font-medium">Category</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedDoc.category}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Researcher ID</p>
                    <p className="font-bold text-gray-900 dark:text-white">#{selectedDoc.researcher_id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Submission Date</p>
                    <p className="font-bold text-gray-900 dark:text-white">{new Date(selectedDoc.submitted_date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Current Status</p>
                    <p className={`font-bold ${selectedDoc.status === 'Accepted' ? 'text-green-600' : selectedDoc.status === 'Rejected' ? 'text-red-600' : 'text-amber-600'}`}>
                      {selectedDoc.status}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button onClick={() => handleDownloadDoc(selectedDoc)} className="w-full bg-ayurGreen-600 text-white p-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-ayurGreen-700 transition shadow">
                    <Download className="h-4 w-4"/><span>Download Original File</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Embedded Live Document Viewer */}
              <div className="lg:col-span-8 bg-gray-100 dark:bg-gray-950 flex flex-col h-full overflow-hidden p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">Live Uploaded Document Preview ({selectedDoc.filename})</p>
                <div className="flex-grow rounded-2xl overflow-hidden border border-gray-300 dark:border-gray-700 bg-white shadow-inner flex items-center justify-center">
                  {selectedDoc.file_data ? (
                    <iframe 
                      src={selectedDoc.file_data} 
                      title={selectedDoc.title} 
                      className="w-full h-full"
                    />
                  ) : (
                    <div className="p-8 text-center text-gray-400 space-y-2">
                      <FileText className="h-12 w-12 mx-auto opacity-40"/>
                      <p className="text-xs">No direct preview stream available for this file. Please use the download button on the left.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer (Action Controls) */}
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center shrink-0">
              <button onClick={() => setSelectedDoc(null)} className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition text-xs sm:text-sm">
                Close
              </button>
              
              <div className="flex space-x-3">
                {selectedDoc.status === 'Pending' ? (
                  <>
                    <button onClick={() => handleReview(selectedDoc.id, 'Rejected')} className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition text-xs sm:text-sm">
                      Reject Protocol
                    </button>
                    <button onClick={() => handleReview(selectedDoc.id, 'Accepted')} className="px-5 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition text-xs sm:text-sm">
                      Accept & Issue CRDA
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-500 italic flex items-center">Review already completed.</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}