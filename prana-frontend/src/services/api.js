const API_BASE_URL = "http://127.0.0.1:8000";

export async function apiLogin(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username.trim(), password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Login failed");
  }
  return response.json();
}

export async function apiRegister(userData) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Registration failed");
  }
  return response.json();
}

export async function apiGetProfile(token) {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch profile");
  return response.json();
}

export async function apiGetPatients(token) {
  const response = await fetch(`${API_BASE_URL}/auth/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch patients");
  return response.json();
}

export async function apiGetTrials(token) {
  const response = await fetch(`${API_BASE_URL}/trials/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch trials");
  return response.json();
}

export async function apiCreateTrial(token, trialData) {
  const response = await fetch(`${API_BASE_URL}/trials/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(trialData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create trial");
  }
  return response.json();
}

export async function apiGetContracts(token) {
  const response = await fetch(`${API_BASE_URL}/contracts/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch contracts");
  return response.json();
}

export async function apiCreateContract(token, contractData) {
  const response = await fetch(`${API_BASE_URL}/contracts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(contractData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to create contract");
  }
  return response.json();
}

export async function apiReportAE(token, aeData) {
  const response = await fetch(`${API_BASE_URL}/pv/report-ae`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(aeData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to report adverse event");
  }
  return response.json();
}

export async function apiGetAdverseEvents(token) {
  const response = await fetch(`${API_BASE_URL}/pv/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to fetch safety alerts");
  return response.json();
}

export async function apiProvideSolution(token, eventId, solution) {
  const response = await fetch(`${API_BASE_URL}/health/solution/${eventId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ solution }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to send solution");
  }
  return response.json();
}

export async function apiLogDailyHealth(token, logData) {
  const response = await fetch(`${API_BASE_URL}/health/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(logData),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "Failed to log health vitals");
  }
  return response.json();
}

export async function apiGetPatientHealthLogs(token, patientId) {
  const res = await fetch(`${API_BASE_URL}/health/logs/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch health logs");
  return res.json();
}

export async function apiGetAuditLogs(token, trialId = null) {
  const url = trialId ? `${API_BASE_URL}/audit/logs?trial_id=${trialId}` : `${API_BASE_URL}/audit/logs`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export async function apiExportSDTM(token, trialId) {
  const response = await fetch(`${API_BASE_URL}/interop/export-sdtm/${trialId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Failed to export CDISC SDTM dataset");
  return response.json();
}

export async function apiGetPatientDetails(token, patientId) {
  const res = await fetch(`${API_BASE_URL}/auth/patient/${patientId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch patient details");
  return res.json();
}
export async function apiGetDoctorDetails(token, doctorId) {
  const res = await fetch(`${API_BASE_URL}/auth/doctor/${doctorId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch doctor details");
  return res.json();
}

export async function apiGetMessages(token, userId) {
  const res = await fetch(`${API_BASE_URL}/chat/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function apiSendMessage(token, receiverId, message) {
  const res = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ receiver_id: receiverId, message })
  });
  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function apiGetDocuments(token) {
  const res = await fetch(`${API_BASE_URL}/documents/`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function apiSubmitDocument(token, docData) {
  const res = await fetch(`${API_BASE_URL}/documents/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(docData)
  });
  if (!res.ok) throw new Error("Failed to submit document");
  return res.json();
}

export async function apiReviewDocument(token, docId, status) {
  const res = await fetch(`${API_BASE_URL}/documents/${docId}/review`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Failed to review document");
  return res.json();
}