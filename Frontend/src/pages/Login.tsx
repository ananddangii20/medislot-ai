import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { googleAuthUser, loginUser, signupUser, verifyEmailOtp } from "@/api";
import { auth, googleProvider } from "@/firebase";
import { signInWithPopup } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<"auth" | "otp">("auth");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  // ✅ FIXED validation (button issue solved)
  const canSubmit = useMemo(() => {
    if (isLoading) return false;

    if (step === "otp") {
      return otp.trim().length >= 4;
    }

    if (isLogin) {
      return email.trim() !== "" && password.trim() !== "";
    }

    return name.trim() !== "" && email.trim() !== "" && password.trim().length >= 6;
  }, [step, otp, isLogin, email, password, name, isLoading]);

  const resetAuthForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setShowPass(false);
  };

  const switchAuthMode = () => {
    setIsLogin((prev) => !prev);
    setStep("auth");
    setOtp("");
    setPendingVerificationEmail("");
    resetAuthForm();
  };

  // ✅ SIMPLE email validation (no blocking)
  const validateEmail = (value: string) => {
    return value.includes("@");
  };

  // ✅ FIREBASE GOOGLE LOGIN (FINAL)
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (!user.email) {
        toast.error("Google email not found");
        return;
      }

      const backendResponse = await googleAuthUser({
        name: user.displayName || "Google User",
        email: user.email,
        uid: user.uid,
      });

      localStorage.setItem("medislot_token", backendResponse.access_token);
      window.dispatchEvent(new Event("auth-changed"));

      toast.success("Google login successful 🚀");
      navigate("/home");
    } catch (error: any) {
      toast.error(error?.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    if (step === "otp") {
      try {
        setIsLoading(true);

        await verifyEmailOtp({
          email: pendingVerificationEmail,
          otp: otp.trim(),
        });

        toast.success("Email verified ✅");
        setStep("auth");
        setIsLogin(true);
        setEmail(pendingVerificationEmail);
        setOtp("");
        setPendingVerificationEmail("");
      } catch (error: any) {
        toast.error(error?.message || "OTP failed");
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Enter valid email");
      return;
    }

    try {
      setIsLoading(true);

      if (isLogin) {
        const res = await loginUser({ email, password });

        localStorage.setItem("medislot_token", res.access_token);
        window.dispatchEvent(new Event("auth-changed"));
        toast.success("Login successful 🎉");
        navigate("/home");
      } else {
        await signupUser({ name, email, password });

        toast.success("Signup done → verify OTP");
        setPendingVerificationEmail(email);
        setStep("otp");
      }
    } catch (error: any) {
      toast.error(error?.message || "Auth failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex bg-gradient-to-br from-orange-50 via-rose-50 to-amber-100">

        {/* LEFT */}
        <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12">
          <div className="text-center space-y-6">
            <Heart className="w-10 h-10 text-white mx-auto" fill="white" />
            <h2 className="text-3xl text-white font-bold">MediSlot AI</h2>
            <p className="text-white">Your Health, Our Priority</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-6 bg-white p-7 rounded-2xl shadow-xl">

            <h1 className="text-2xl font-bold text-center">
              {step === "otp" ? "Verify OTP" : isLogin ? "Welcome back" : "Create account"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">

              {step === "otp" ? (
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full p-3 border rounded-xl"
                />
              ) : (
                <>
                  {!isLogin && (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full p-3 border rounded-xl"
                    />
                  )}

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="w-full p-3 border rounded-xl"
                  />

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full p-3 border rounded-xl"
                  />
                </>
              )}

              <Button disabled={!canSubmit} className="w-full">
                {isLoading ? "Loading..." : step === "otp" ? "Verify OTP" : isLogin ? "Login" : "Signup"}
              </Button>

              {/* GOOGLE BUTTON */}
              {step !== "otp" && (
                <Button type="button" variant="outline" className="w-full" onClick={handleGoogleLogin}>
                  Continue with Google
                </Button>
              )}
            </form>

            <p className="text-center text-sm">
              {isLogin ? "No account?" : "Already have account?"}
              <button onClick={switchAuthMode} className="ml-2 text-blue-500">
                {isLogin ? "Signup" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}