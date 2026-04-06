export function isAuthenticated() {
  return Boolean(localStorage.getItem("medislot_token"));
}

export function getToken() {
  return localStorage.getItem("medislot_token");
}

export function logout() {
  localStorage.removeItem("medislot_token");
  window.dispatchEvent(new Event("auth-changed"));
  window.location.href = "/login";
}