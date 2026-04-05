import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex">
        {/* Left */}
        <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6 max-w-md"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary-foreground" fill="currentColor" />
            </div>
            <h2 className="font-heading font-bold text-3xl text-primary-foreground">MediSlot AI</h2>
            <p className="text-primary-foreground/80 leading-relaxed">
              Your health journey starts here. Book appointments, check symptoms, and connect with top doctors.
            </p>
          </motion.div>
        </div>

        {/* Right */}
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm space-y-6"
          >
            <div className="lg:hidden flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                <Heart className="w-4 h-4 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="font-heading font-bold">MediSlot AI</span>
            </div>

            <div>
              <h1 className="font-heading font-bold text-2xl">
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLogin ? "Enter your credentials to continue" : "Start your health journey today"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Password"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full rounded-xl" size="lg">
                {isLogin ? "Log in" : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-medium hover:underline">
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
            <Link to="/home" className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
