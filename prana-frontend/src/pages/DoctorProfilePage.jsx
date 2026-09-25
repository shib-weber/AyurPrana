import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stethoscope, ShieldCheck, AlertTriangle, Send, Download, ArrowLeft, MessageSquare, FileText } from 'lucide-react';
import { apiGetDoctorDetails, apiGetAdverseEvents, apiGetProfile, apiGetMessages, apiSendMessage } from '../services/api';

export default function DoctorProfilePage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('prana_token');

  useEffect(() => {
    async function loadDoctorData() {
      try {
        const userProfile = await apiGetProfile(token);
        setProfile(userProfile);

        const docData = await apiGetDoctorDetails(token, doctorId);
        setDoctor(docData);

        const allEvents = await apiGetAdverseEvents(token);
        const relevantEvents = allEvents.filter(e => e.patient_id?.toString() === userProfile.id.toString());
        setEvents(relevantEvents);

        // Fetch real-time chat messages from backend database
        try {
          const chatMsgs = await apiGetMessages(token, parseInt(doctorId));
          setMessages(chatMsgs.map(m => ({
            sender: m.sender_id === userProfile.id ? 'patient' : 'doctor',
            text: m.message,
            timestamp: m.timestamp
          })));
        } catch (chatErr) {
          console.error("Chat fetch fallback:", chatErr);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    loadDoctorData();
  }, [doctorId, token]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile) return;

    try {
      await apiSendMessage(token, parseInt(doctorId), newMessage);
      setMessages([
        ...messages,
        { sender: 'patient', text: newMessage, timestamp: new Date().toLocaleTimeString() }
      ]);
      setNewMessage('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownloadPrescription = (ev) => {
    const content = `--- AIIA OFFICIAL CLINICAL PRESCRIPTION ---
Doctor: ${doctor?.full_name}
Patient ID: #${profile?.id}
Issue / Alarm: ${ev.meddra_preferred_term}
Severity: ${ev.severity}
Prescription / Solution: ${ev.doctor_solution}
Date Issued: ${new Date(ev.reported_date).toLocaleString()}
------------------------------------------
ALCOA+ Data Integrity & DPDP Act 2023 Compliant`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${ev.event_code || 'AIIA'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading doctor clinical profile...</div>;
  if (!doctor) return <div className="p-12 text-center text-red-500">Doctor not found for ID: #{doctorId}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Back Navigation & Header */}
      <div>
        <button onClick={() => navigate(-1)} className="text-xs text-ayurGreen-600 font-bold hover:underline mb-2 flex items-center space-x-1">
          <ArrowLeft className="h-4 w-4"/><span>Back to Patient Portal</span>
        </button>
        <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700">
          <div className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-2xl text-ayurGreen-600">
            <Stethoscope className="h-10 w-10"/>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ayurGreen-900 dark:text-white">{doctor.full_name}</h1>
            <p className="text-sm text-gray-500">{doctor.email} | Investigator ID: #{doctor.id}</p>
            <p className="text-xs text-ayurGreen-700 dark:text-ayurGreen-300 font-semibold mt-1">Assigned Trial Physician & Principal Investigator</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prescriptions, Solutions & Download */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 space-y-4">
          <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white">
            <ShieldCheck className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Prescriptions, Alarms Raised & Solutions</h3>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-xs text-gray-500">No alarms raised or prescriptions issued yet.</p>
            ) : (
              events.map(ev => (
                <div key={ev.id} className="p-4 bg-ayurGreen-50 dark:bg-gray-700 rounded-xl text-xs space-y-2 border border-ayurGreen-200 dark:border-gray-600">
                  <div className="flex justify-between font-bold text-ayurGreen-900 dark:text-white">
                    <span>Alarm: {ev.meddra_preferred_term}</span>
                    <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded">{ev.severity}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-semibold">
                    Doctor Solution / Prescription: <span className="text-green-700 dark:text-green-300">{ev.doctor_solution || "Pending doctor review..."}</span>
                  </p>
                  {ev.doctor_solution && (
                    <button onClick={() => handleDownloadPrescription(ev)} className="mt-2 bg-ayurGreen-600 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1 font-medium hover:bg-ayurGreen-700">
                      <Download className="h-3 w-3"/><span>Download Prescription Summary (.txt)</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Direct Messaging Chat Area */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-ayurGreen-100 dark:border-gray-700 flex flex-col justify-between h-[450px]">
          <div className="flex items-center space-x-2 font-bold text-ayurGreen-800 dark:text-white border-b pb-3 dark:border-gray-700">
            <MessageSquare className="h-5 w-5 text-ayurGreen-600"/>
            <h3>Direct Consultation Chat with Dr. {doctor.full_name}</h3>
          </div>

          {/* Chat Messages Stream */}
          <div className="flex-grow overflow-y-auto space-y-3 py-4 pr-2">
            {messages.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No messages yet. Send a message to your doctor below.</p>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-xl max-w-[80%] text-xs ${
                    m.sender === 'patient' 
                      ? 'bg-ayurGreen-600 text-white rounded-br-none' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-none'
                  }`}>
                    <p>{m.text}</p>
                  </div>
                  <span className="text-[9px] text-gray-400 mt-1">{m.timestamp}</span>
                </div>
              ))
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex space-x-2 pt-3 border-t dark:border-gray-700">
            <input 
              type="text" 
              value={newMessage} 
              onChange={e=>setNewMessage(e.target.value)} 
              placeholder="Type message to doctor..." 
              className="flex-1 p-2.5 text-xs border rounded-xl dark:bg-gray-700 dark:border-gray-600"
            />
            <button type="submit" className="bg-ayurGreen-600 text-white px-4 py-2.5 rounded-xl text-xs font-medium flex items-center space-x-1 hover:bg-ayurGreen-700">
              <Send className="h-3 w-3"/><span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}