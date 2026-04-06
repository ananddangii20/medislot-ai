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

export function signupUser(payload: { name: string; email: string; password: string }) {
  return request("/auth/signup", payload);
}

export function verifyEmailOtp(payload: { email: string; otp: string }) {
  return request("/auth/verify-email", payload);
}

export function loginUser(payload: { email: string; password: string }) {
  return request("/auth/login", payload);
}

export function googleAuthUser(payload: { name: string; email: string; uid: string }) {
  return request("/auth/google", payload);
}

export async function getCurrentUser() {
  const token = localStorage.getItem("medislot_token");

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user");

  return res.json();
}