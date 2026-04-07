import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, Calendar, CheckCircle, ArrowRight, Star, Brain, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/utils/auth";
import { getCurrentUser } from "@/api";
import { useDoctors } from "@/hooks/useDoctors";


const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const { doctors } = useDoctors();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const syncAuth = () => setLoggedIn(isAuthenticated());
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      if (!loggedIn) {
        if (isMounted) {
          setUserName("");
        }
        return;
      }

      try {
        const user = await getCurrentUser();
        if (isMounted) {
          setUserName(user?.name || "");
        }
      } catch {
        if (isMounted) {
          setUserName("");
        }
      }
    }

    loadUser();

    return () => {
      isMounted = false;
    };
  }, [loggedIn]);

  const greetingName = userName ? userName.split(" ")[0] : "there";

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-16">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-gradient opacity-[0.03] pointer-events-none" />
            <div className="container py-20 md:py-28">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
                  {loggedIn && (
                    <motion.div variants={fadeUp} className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                      Welcome, {greetingName}
                    </motion.div>
                  )}
                  <motion.div variants={fadeUp}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Activity className="w-3.5 h-3.5" /> MediSlot AI Care Platform
                    </span>
                  </motion.div>
                  <motion.h1 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                    Healthcare Booking<br />
                    <span className="text-gradient">Made Simple</span>
                  </motion.h1>
                  <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-md leading-relaxed">
                    Discover trusted doctors, request appointments, and manage approvals and payments in one seamless patient journey.
                  </motion.p>
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                    <Button size="lg" className="rounded-xl gap-2 text-sm" onClick={() => navigate("/doctors")}>
                      <Calendar className="w-4 h-4" /> Book Appointment
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-xl gap-2 text-sm" onClick={() => navigate("/symptom-checker")}>
                      <Brain className="w-4 h-4" /> Check Symptoms
                    </Button>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
                    <div className="text-center">
                      <p className="font-heading font-bold text-2xl">700+</p>
                      <p className="text-xs text-muted-foreground">Doctors</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-2xl">1L+</p>
                      <p className="text-xs text-muted-foreground">Patients</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-2xl">4.9</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative hidden md:block"
                >
                  <div className="w-full aspect-square rounded-3xl bg-hero-gradient opacity-10 absolute -right-8 -top-8" />
                  <img
                    src="homepage.jpg"
                    alt="Healthcare professional"
                    className="relative rounded-3xl card-shadow w-full max-w-md ml-auto object-cover aspect-[4/5]"
                  />
                </motion.div>
              </div>
            </div>
          </section>

          {/* Search */}
          <section className="container -mt-4 mb-16 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl card-shadow border border-border p-4 flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-muted rounded-xl">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  placeholder="Search by specialization, doctor name..."
                  className="bg-transparent w-full outline-none text-sm placeholder:text-muted-foreground"
                />
              </div>
              <Link to="/doctors">
                <Button className="rounded-xl w-full sm:w-auto gap-2">
                  Find Doctors <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </section>

          {/* Fe */}
          <section className="container pb-20">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-10"
            >
              <motion.div variants={fadeUp} className="flex items-end justify-between">
                <div>
                  <h2 className="font-heading font-bold text-2xl md:text-3xl">Featured Doctors</h2>
                  <p className="text-muted-foreground text-sm mt-1">Verified specialists available for online and clinic consultations</p>
                </div>
                <Link to="/doctors" className="text-primary text-sm font-medium hover:underline hidden sm:block">
                  View all →
                </Link>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.slice(0, 6).map((doc) => (
                  <motion.div key={doc.id} variants={fadeUp}>
                    <div className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
                        <div className="min-w-0">
                          <h3 className="font-heading font-semibold text-sm truncate">{doc.name}</h3>
                          <p className="text-xs text-muted-foreground">{doc.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span>{doc.experience} yrs exp</span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                          {doc.rating}
                        </span>
                        <span>{doc.reviews} reviews</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="w-full rounded-xl text-xs" onClick={() => navigate(`/doctor/${doc.id}`)}>
                          View Profile
                        </Button>
                        <Button className="w-full rounded-xl text-xs" onClick={() => navigate(`/booking/${doc.id}`)}>
                          Book Appointment
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* How it works */}
          <section className="bg-muted/50 py-20">
            <div className="container">
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="space-y-12"
              >
                <motion.div variants={fadeUp} className="text-center">
                  <h2 className="font-heading font-bold text-2xl md:text-3xl">How It Works</h2>
                  <p className="text-muted-foreground text-sm mt-2">Simple, reliable flow designed for real clinic operations</p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Search, title: "Discover", desc: "Browse doctors by speciality, city, and clinic" },
                    { icon: Calendar, title: "Request", desc: "Send appointment request and wait for doctor approval" },
                    { icon: CheckCircle, title: "Consult", desc: "Pay securely and attend your confirmed consultation" },
                  ].map((step, i) => (
                    <motion.div key={step.title} variants={fadeUp} className="text-center space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                        <step.icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="font-heading font-bold text-xs text-primary">Step {i + 1}</div>
                      <h3 className="font-heading font-semibold text-lg">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* AI CTA */}
          <section className="container py-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl bg-hero-gradient p-10 md:p-16 overflow-hidden"
            >
              <div className="relative z-10 max-w-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" />
                  <span className="text-primary-foreground/80 text-sm font-medium">AI-Powered</span>
                </div>
                <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary-foreground mb-3">
                  Need help choosing a specialist?
                </h2>
                <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                  Use the MediSlot AI symptom checker to understand symptoms early and connect with the right doctor faster.
                </p>
                <Button size="lg" variant="secondary" className="rounded-xl gap-2 text-sm" onClick={() => navigate("/symptom-checker")}>
                  <Brain className="w-4 h-4" /> Try AI Checker
                </Button>
              </div>
            </motion.div>
          </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
