import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, LogOut, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserRole, isAuthenticated, logout } from "@/utils/auth";

const baseNavLinks = [
  { label: "Home", path: "/home" },
  { label: "Doctors", path: "/doctors" },
  { label: "AI Checker", path: "/symptom-checker" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [role, setRole] = useState(getUserRole() || "patient");
  const location = useLocation();

  const navLinks = [
    ...baseNavLinks,
    { label: "Dashboard", path: role === "doctor" ? "/doctor-dashboard" : "/patient-dashboard" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const syncAuth = () => {
      setLoggedIn(isAuthenticated());
      setRole(getUserRole() || "patient");
    };
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "glass nav-shadow" : "bg-background/60 backdrop-blur-sm"
        }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="font-heading font-bold text-lg">MediSlot AI</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.path
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="rounded-xl gap-2">
                  <UserCircle2 className="w-4 h-4" /> Profile
                </Button>
              </Link>
              <Button size="sm" className="rounded-xl gap-2" onClick={logout}>
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="rounded-xl">
                  Log in
                </Button>
              </Link>
              <Link to="/login">
                <Button size="sm" className="rounded-xl">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass border-t border-border"
          >
            <div className="container py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${location.pathname === link.path
                      ? "text-primary bg-primary/5"
                      : "text-muted-foreground hover:bg-muted"
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex gap-3 pt-2">
                {loggedIn ? (
                  <>
                    <Link to="/profile" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl gap-2">
                        <UserCircle2 className="w-4 h-4" /> Profile
                      </Button>
                    </Link>
                    <Button className="flex-1 rounded-xl gap-2" onClick={logout}>
                      <LogOut className="w-4 h-4" /> Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl">Log in</Button>
                    </Link>
                    <Link to="/login" className="flex-1">
                      <Button className="w-full rounded-xl">Sign up</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
