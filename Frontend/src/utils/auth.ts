export function isAuthenticated() {
  return Boolean(localStorage.getItem("medislot_token"));
}

export function getToken() {
  return localStorage.getItem("medislot_token");
}

export function getUserRole() {
  return localStorage.getItem("medislot_role");
}

export function setAuthSession(token: string, role: string) {
  localStorage.setItem("medislot_token", token);
  localStorage.setItem("medislot_role", role);
  window.dispatchEvent(new Event("auth-changed"));
}

export function logout() {
  localStorage.removeItem("medislot_token");
  localStorage.removeItem("medislot_role");
  window.dispatchEvent(new Event("auth-changed"));
  window.location.href = "/login";
}