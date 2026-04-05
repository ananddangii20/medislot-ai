import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { SkeletonCard } from "@/components/SkeletonCard";
import { doctors, specializations } from "@/data/doctors";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Doctors() {
  const [loading, setLoading] = useState(true);
  const [activeSpec, setActiveSpec] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeSpec === "All"
    ? doctors
    : doctors.filter((d) => d.specialization === activeSpec);

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-10 min-h-screen">
          <div className="container">
            <div className="mb-8">
              <h1 className="font-heading font-bold text-2xl md:text-3xl">Find a Doctor</h1>
              <p className="text-muted-foreground text-sm mt-1">Browse our network of specialists</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Filters sidebar */}
              <div className="lg:w-56 shrink-0">
                <button
                  className="lg:hidden flex items-center gap-2 text-sm font-medium mb-4"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <div className={`${showFilters ? "block" : "hidden"} lg:block space-y-2`}>
                  <h3 className="font-heading font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-3">
                    Specialization
                  </h3>
                  {specializations.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSpec(s)}
                      className={`w-full text-left px-4 py-2.5 rounded-xl text-sm transition-colors ${
                        activeSpec === s
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Doctor grid */}
              <div className="flex-1">
                {loading ? (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial="hidden"
                    animate="show"
                    variants={{ show: { transition: { staggerChildren: 0.08 } } }}
                    className="grid sm:grid-cols-2 gap-5"
                  >
                    {filtered.map((doc) => (
                      <motion.div key={doc.id} variants={fadeUp}>
                        <Link to={`/doctor/${doc.id}`}>
                          <div className="group rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:card-shadow-hover hover:-translate-y-1">
                            <div className="flex items-center gap-4 mb-4">
                              <img src={doc.image} alt={doc.name} className="w-16 h-16 rounded-xl object-cover" />
                              <div className="min-w-0">
                                <h3 className="font-heading font-semibold truncate">{doc.name}</h3>
                                <p className="text-sm text-muted-foreground">{doc.specialization}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Star className="w-3.5 h-3.5 text-amber-400" fill="currentColor" />
                                  <span className="text-xs font-medium">{doc.rating}</span>
                                  <span className="text-xs text-muted-foreground">({doc.reviews})</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                              <span>{doc.experience} yrs experience</span>
                              <span className="font-semibold text-foreground">${doc.fee}</span>
                            </div>
                            <Button variant="outline" className="w-full rounded-xl text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              View Profile
                            </Button>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
                {!loading && filtered.length === 0 && (
                  <div className="text-center py-20 text-muted-foreground">
                    <p>No doctors found for this specialization.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
}
