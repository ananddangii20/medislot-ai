import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { doctors } from "@/data/doctors";
import { toast } from "sonner";

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

export default function Booking() {
  const { id } = useParams();
  const doc = doctors.find((d) => d.id === id);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);

  if (!doc) {
    return (
      <>
        <Navbar />
        <div className="pt-24 text-center min-h-screen">
          <p className="text-muted-foreground">Doctor not found.</p>
        </div>
      </>
    );
  }

  const handleBook = () => {
    if (!selectedSlot) return;
    setBooked(true);
    toast.success("Appointment booked successfully!");
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-10 min-h-screen">
          <div className="container max-w-2xl">
            <Link to={`/doctor/${doc.id}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Profile
            </Link>

            <AnimatePresence mode="wait">
              {booked ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20 space-y-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 mx-auto rounded-full bg-green-50 flex items-center justify-center"
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </motion.div>
                  <h2 className="font-heading font-bold text-2xl">Booking Confirmed!</h2>
                  <p className="text-muted-foreground text-sm">
                    Your appointment with {doc.name} on{" "}
                    {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {selectedSlot} is confirmed.
                  </p>
                  <div className="flex justify-center gap-3 pt-4">
                    <Link to="/patient-dashboard">
                      <Button className="rounded-xl">View Dashboard</Button>
                    </Link>
                    <Link to="/home">
                      <Button variant="outline" className="rounded-xl">Go Home</Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <h1 className="font-heading font-bold text-2xl">Book Appointment</h1>

                  {/* Doctor card */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card">
                    <img src={doc.image} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-heading font-semibold text-sm">{doc.name}</h3>
                      <p className="text-xs text-muted-foreground">{doc.specialization} · ${doc.fee}</p>
                    </div>
                  </div>

                  {/* Date picker */}
                  <div>
                    <h2 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" /> Select Date
                    </h2>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {dates.map((d) => {
                        const isSelected = d.toDateString() === selectedDate.toDateString();
                        return (
                          <button
                            key={d.toISOString()}
                            onClick={() => { setSelectedDate(d); setSelectedSlot(null); }}
                            className={`flex flex-col items-center px-4 py-3 rounded-xl border text-xs font-medium transition-all shrink-0 ${
                              isSelected
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <span className="text-[10px] uppercase text-muted-foreground">
                              {d.toLocaleDateString("en-US", { weekday: "short" })}
                            </span>
                            <span className="text-lg font-bold mt-0.5">{d.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div>
                    <h2 className="font-heading font-semibold text-sm mb-3">Select Time</h2>
                    <div className="flex flex-wrap gap-2">
                      {doc.slots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                            selectedSlot === slot
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-xl"
                    disabled={!selectedSlot}
                    onClick={handleBook}
                  >
                    Confirm Booking
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
