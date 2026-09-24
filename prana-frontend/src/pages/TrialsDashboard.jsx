import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TrialMetricsSummary from '../components/TrialMetricsSummary';
import ReportLineGraph from '../components/ReportLineGraph';
import ResearchFormatAudit from '../components/ResearchFormatAudit';
import AlarmAlertFeed from '../components/AlarmAlertFeed';

export default function TrialDetailPage() {
  const { trialId } = useParams();
  const navigate = useNavigate();
  const [trialData, setTrialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch individual trial data using the trialId route param
    fetch(`/api/trials/${trialId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrialData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.h('Error fetching trial details:', err);
        setLoading(false);
      });
  }, [trialId]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading trial audit & analytics...</div>;
  if (!trialData) return <div className="p-8 text-center text-red-500">Trial not found for ID: {trialId}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header & Navigation */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="text-sm text-blue-600 hover:underline mb-2 inline-block"
          >
            &larr; Back to Trials List
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{trialData.trialName}</h1>
          <p className="text-sm text-gray-500">Trial ID: <span className="font-mono text-gray-700">{trialId}</span></p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          trialData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {trialData.status}
        </span>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* 1. Summary Metrics Cards (Doctors, Patients, Alarms, Threats) */}
        <TrialMetricsSummary metrics={trialData.metrics} />

        {/* 2. Analytics Section: Line Graph of Reports */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Reports Generated Over Time</h2>
          <ReportLineGraph data={trialData.reportsTimeSeries} />
        </div>

        {/* 3. Alarms, Alerts & Health Threats Log */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlarmAlertFeed alarms={trialData.alarmsAndAlerts} />
          {/* 4. Researcher Format JSON Audit */}
          <ResearchFormatAudit auditData={trialData.researcherAuditJson} />
        </div>
      </div>
    </div>
  );
}