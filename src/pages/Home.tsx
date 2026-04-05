import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Calendar, CheckCircle, ArrowRight, Star, Brain, Stethoscope, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { doctors } from "@/data/doctors";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-16">
          {/* Hero */}
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
            <div className="container py-20 md:py-28">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
                  <motion.div variants={fadeUp}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <Activity className="w-3.5 h-3.5" /> AI-Powered Healthcare
                    </span>
                  </motion.div>
                  <motion.h1 variants={fadeUp} className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
                    Book Doctors<br />
                    <span className="text-gradient">Instantly</span>
                  </motion.h1>
                  <motion.p variants={fadeUp} className="text-muted-foreground text-lg max-w-md leading-relaxed">
                    Find top-rated doctors, check symptoms with AI, and book appointments in seconds. Your health journey starts here.
                  </motion.p>
                  <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                    <Link to="/doctors">
                      <Button size="lg" className="rounded-xl gap-2 text-sm">
                        <Calendar className="w-4 h-4" /> Book Appointment
                      </Button>
                    </Link>
                    <Link to="/symptom-checker">
                      <Button variant="outline" size="lg" className="rounded-xl gap-2 text-sm">
                        <Brain className="w-4 h-4" /> Check Symptoms
                      </Button>
                    </Link>
                  </motion.div>
                  <motion.div variants={fadeUp} className="flex items-center gap-6 pt-2">
                    <div className="text-center">
                      <p className="font-heading font-bold text-2xl">500+</p>
                      <p className="text-xs text-muted-foreground">Doctors</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="text-center">
                      <p className="font-heading font-bold text-2xl">50K+</p>
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
                    src="https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=600&h=600&fit=crop"
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

          {/* Featured Doctors */}
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
                  <p className="text-muted-foreground text-sm mt-1">Top-rated specialists near you</p>
                </div>
                <Link to="/doctors" className="text-primary text-sm font-medium hover:underline hidden sm:block">
                  View all →
                </Link>
              </motion.div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {doctors.slice(0, 3).map((doc) => (
                  <motion.div key={doc.id} variants={fadeUp}>
                    <Link to={`/doctor/${doc.id}`}>
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
                        <Button variant="outline" className="w-full rounded-xl text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          View Profile
                        </Button>
                      </div>
                    </Link>
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
                  <p className="text-muted-foreground text-sm mt-2">Three simple steps to better healthcare</p>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { icon: Search, title: "Search", desc: "Find doctors by specialization or name" },
                    { icon: Calendar, title: "Book", desc: "Choose a convenient time slot" },
                    { icon: CheckCircle, title: "Visit", desc: "Get expert medical care" },
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
                  Not sure what's wrong?
                </h2>
                <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                  Our AI symptom checker analyzes your symptoms and suggests the right specialist. Fast, private, and free.
                </p>
                <Link to="/symptom-checker">
                  <Button size="lg" variant="secondary" className="rounded-xl gap-2 text-sm">
                    <Brain className="w-4 h-4" /> Try AI Checker
                  </Button>
                </Link>
              </div>
            </motion.div>
          </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
