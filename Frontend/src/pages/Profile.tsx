import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { getCurrentUser } from "@/api";
import { logout } from "@/utils/auth";

type UserProfile = {
  name?: string;
  email?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      try {
        setLoading(true);
        const data = await getCurrentUser();

        if (isMounted) {
          setUser(data);
          setError("");
        }
      } catch (fetchError: any) {
        if (isMounted) {
          setError(fetchError?.message || "Failed to load profile.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const initials = user?.name?.trim().charAt(0)?.toUpperCase() || "U";

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 px-4">
        <div className="container max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-border bg-card p-6 md:p-8 card-shadow"
          >
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl md:text-3xl">Profile</h1>
                <p className="text-muted-foreground text-sm mt-1">Your account details from MongoDB Atlas</p>
              </div>
              <Button variant="outline" className="rounded-xl gap-2" onClick={handleLogout}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>

            {loading && (
              <div className="flex items-center gap-3 text-muted-foreground py-10 justify-center">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading profile...
              </div>
            )}

            {!loading && error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-destructive">
                {error}
              </div>
            )}

            {!loading && !error && user && (
              <div className="grid md:grid-cols-[140px_1fr] gap-6 items-start">
                <div className="flex flex-col items-center gap-4 rounded-3xl bg-muted p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-hero-gradient flex items-center justify-center text-white text-3xl font-bold">
                    {initials}
                  </div>
                  <div className="text-sm text-muted-foreground">Account details</div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-border p-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-1">
                      <User className="w-4 h-4" /> Name
                    </div>
                    <div className="font-medium">{user.name || "Unknown"}</div>
                  </div>

                  <div className="rounded-2xl border border-border p-4">
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium">{user.email || "Unknown"}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </PageTransition>
  );
}