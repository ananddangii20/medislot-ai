import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "./firebase";

export async function googleLoginBackend() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  const res = await fetch("http://127.0.0.1:8000/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: user.displayName,
      email: user.email,
      uid: user.uid,
    }),
  });

  const data = await res.json();

  localStorage.setItem("medislot_token", data.access_token);

  window.location.href = "/home";
}