import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Clock, Award, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PageTransition } from "@/components/PageTransition";
import { doctors } from "@/data/doctors";

export default function DoctorProfile() {
  const { id } = useParams();
  const doc = doctors.find((d) => d.id === id);

  if (!doc) {
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center min-h-screen">
          <p className="text-muted-foreground">Doctor not found.</p>
          <Link to="/doctors" className="text-primary text-sm mt-2 inline-block">← Back to doctors</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-10 min-h-screen">
          <div className="container max-w-3xl">
            <Link to="/doctors" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Doctors
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card p-6 md:p-8"
            >
              <div className="flex flex-col sm:flex-row gap-6 mb-8">
                <img src={doc.image} alt={doc.name} className="w-28 h-28 rounded-2xl object-cover card-shadow" />
                <div className="space-y-2">
                  <h1 className="font-heading font-bold text-2xl">{doc.name}</h1>
                  <p className="text-primary font-medium text-sm">{doc.specialization}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                      {doc.rating} ({doc.reviews} reviews)
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {doc.experience} yrs
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" /> Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="font-heading font-semibold text-sm mb-2">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{doc.bio}</p>
              </div>

              <div className="mb-8">
                <h2 className="font-heading font-semibold text-sm mb-3">Available Slots</h2>
                <div className="flex flex-wrap gap-2">
                  {doc.slots.map((slot) => (
                    <span
                      key={slot}
                      className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                <div>
                  <p className="text-xs text-muted-foreground">Consultation Fee</p>
                  <p className="font-heading font-bold text-xl">${doc.fee}</p>
                </div>
                <Link to={`/booking/${doc.id}`}>
                  <Button size="lg" className="rounded-xl">Book Appointment</Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </main>
        <Footer />
      </PageTransition>
    </>
  );
}
