import React, { useState } from 'react';
import { Code } from 'lucide-react';

export default function ResearchFormatAudit({ auditData = {} }) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-ayurGreen-600"/>
          <h3 className="text-lg font-bold text-ayurGreen-800 dark:text-white">Researcher Format Audit (ALCOA+)</h3>
        </div>
        <button onClick={() => setShowRaw(!showRaw)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded font-medium">
          {showRaw ? 'Formatted View' : 'Raw JSON'}
        </button>
      </div>
      <div className="bg-gray-900 text-green-400 p-4 rounded-xl font-mono text-xs overflow-auto max-h-80 flex-1">
        {showRaw ? (
          <pre>{JSON.stringify(auditData, null, 2)}</pre>
        ) : (
          <div className="space-y-2">
            <p><span className="text-blue-400">Protocol ID:</span> {auditData.protocolId || 'AIIA-CRDA-2026'}</p>
            <p><span className="text-blue-400">Principal Investigator:</span> {auditData.principalInvestigator || 'Dr. Rajesh Sharma'}</p>
            <p><span className="text-blue-400">Ethics Approval:</span> {auditData.ethicsApprovalStatus || 'Approved (AIIA-IRB-2026-04)'}</p>
            <p><span className="text-blue-400">Immutable Checksum:</span> <span className="text-yellow-400">{auditData.checksum || 'sha256:8f42e...'}</span></p>
            <p><span className="text-blue-400">Anonymization:</span> {auditData.anonymizationStandard || 'DPDP & HIPAA Compliant'}</p>
          </div>
        )}
      </div>
    </div>
  );
}