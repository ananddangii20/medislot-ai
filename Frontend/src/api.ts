const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint: string, payload: unknown) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.detail || "Request failed. Please try again.");
  }

  return data;
}

async function authedRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("medislot_token");

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.detail || "Request failed. Please try again.");
  }

  return data;
}

export function signupUser(payload: { name: string; email: string; password: string; role: "patient" | "doctor" }) {
  return request("/auth/signup", payload);
}

export function verifyEmailOtp(payload: { email: string; otp: string }) {
  return request("/auth/verify-email", payload);
}

export function resendEmailOtp(payload: { email: string }) {
  return request("/auth/resend-otp", payload);
}

export function loginUser(payload: { email: string; password: string }) {
  return request("/auth/login", payload);
}

export function googleAuthUser(payload: { name: string; email: string; uid: string }) {
  return request("/auth/google", payload);
}

export async function getCurrentUser() {
  return authedRequest("/auth/me", { method: "GET" });
}

export function createAppointment(payload: {
  doctor_id: string;
  doctor_name: string;
  date: string;
  time: string;
  reason: string;
}) {
  return authedRequest("/auth/appointments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPatientAppointments() {
  return authedRequest("/auth/appointments/patient", { method: "GET" });
}

export function getDoctorAppointments() {
  return authedRequest("/auth/appointments/doctor", { method: "GET" });
}

export function updateAppointmentStatus(appointmentId: string, status: "accepted" | "rejected") {
  return authedRequest(`/auth/appointments/${appointmentId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}