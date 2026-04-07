import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Calendar, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { useDoctors } from "@/hooks/useDoctors";
import { toast } from "sonner";
import { createAppointment } from "@/api";

const dates = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return d;
});

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const doc = doctors.find((d) => d.id === id);
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleBook = async () => {
    if (!selectedSlot) return;

    try {
      setSubmitting(true);
      await createAppointment({
        doctor_id: doc.id,
        doctor_name: doc.name,
        date: selectedDate.toISOString().split("T")[0],
        time: selectedSlot,
        reason: reason.trim() || "General consultation",
      });
      setBooked(true);
      toast.success("Appointment request sent successfully!");
    } catch (error: any) {
      toast.error(error?.message || "Failed to send appointment request");
    } finally {
      setSubmitting(false);
    }
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-14"
                >
                  <div className="max-w-xl mx-auto rounded-3xl border border-amber-200 bg-amber-50/70 p-6 sm:p-8 text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white border border-amber-200 flex items-center justify-center mb-4">
                      <Clock3 className="w-8 h-8 text-amber-600" />
                    </div>
                    <h2 className="font-heading font-bold text-2xl text-amber-800">Waiting For Doctor Approval</h2>
                    <p className="text-amber-900/80 text-sm mt-3">
                      Your appointment request with {doc.name} on{" "}
                      {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at {selectedSlot} is under review.
                    </p>
                    <p className="text-amber-900/80 text-sm mt-2">
                      Once approved, you will see the payment option in your dashboard.
                    </p>
                    <div className="flex justify-center gap-3 pt-6">
                      <Link to="/patient-dashboard">
                        <Button className="rounded-xl">Open Dashboard</Button>
                      </Link>
                      <Button variant="outline" className="rounded-xl" onClick={() => navigate("/home")}>Back Home</Button>
                    </div>
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
                      <p className="text-xs text-muted-foreground">{doc.specialization} · INR {doc.fee}</p>
                      <p className="text-xs text-muted-foreground">{doc.hospital_or_clinic}, {doc.location}</p>
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
                            className={`flex flex-col items-center px-4 py-3 rounded-xl border text-xs font-medium transition-all shrink-0 ${isSelected
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
                          className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all ${selectedSlot === slot
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/30"
                            }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="font-heading font-semibold text-sm mb-3">Reason for Visit</h2>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Describe your symptoms or reason"
                      className="w-full min-h-24 p-3 border rounded-xl text-sm"
                    />
                  </div>

                  <Button
                    size="lg"
                    className="w-full rounded-xl"
                    disabled={!selectedSlot || submitting}
                    onClick={handleBook}
                  >
                    {submitting ? "Sending Request..." : "Confirm Booking"}
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
