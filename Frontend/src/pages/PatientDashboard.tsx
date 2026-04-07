import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { getPatientAppointments, payAppointmentCharge } from "@/api";
import { toast } from "sonner";
import { useDoctors } from "@/hooks/useDoctors";

type Appointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  status: "pending" | "accepted" | "rejected";
  appointmentCharge: number | null;
  paymentStatus: "not_required" | "pending" | "paid";
};

export default function PatientDashboard() {
  const { doctors } = useDoctors();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
      try {
        setLoading(true);
        const data = await getPatientAppointments();
        if (!isMounted) return;

        const mapped: Appointment[] = (data.appointments || []).map((a: any) => ({
          id: a.id,
          doctorName: a.doctor_name,
          date: new Date(a.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: a.time,
          status: a.status,
          appointmentCharge: typeof a.appointment_charge === "number" ? a.appointment_charge : null,
          paymentStatus: a.payment_status || "not_required",
        }));

        setAppointments(mapped);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load appointments");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAppointments();
    return () => {
      isMounted = false;
    };
  }, []);

  const upcomingAppointments = useMemo(
    () => appointments.filter((a) => a.status === "pending" || a.status === "accepted"),
    [appointments]
  );
  const pastAppointments = useMemo(
    () => appointments.filter((a) => a.status === "rejected"),
    [appointments]
  );

  const totalCount = appointments.length;
  const upcomingCount = upcomingAppointments.length;
  const completedCount = appointments.filter((a) => a.status === "accepted").length;

  const findDoctor = (doctorName: string) => doctors.find((d) => d.name === doctorName);

  const handlePay = async (appointmentId: string) => {
    try {
      setPayingId(appointmentId);
      await payAppointmentCharge(appointmentId);
      setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? { ...a, paymentStatus: "paid" } : a)));
      toast.success("Payment completed successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to complete payment");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-10 min-h-screen">
          <div className="container max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-heading font-bold text-2xl">My Dashboard</h1>
                <p className="text-muted-foreground text-sm mt-1">Manage your appointments</p>
              </div>
              <Link to="/doctors">
                <Button className="rounded-xl gap-2 text-sm">
                  <Plus className="w-4 h-4" /> New Booking
                </Button>
              </Link>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Calendar, label: "Appointments", value: String(totalCount), color: "text-primary" },
                { icon: Clock, label: "Upcoming", value: String(upcomingCount), color: "text-amber-500" },
                { icon: FileText, label: "Accepted", value: String(completedCount), color: "text-green-500" },
                { icon: Plus, label: "Book New", value: "→", color: "text-primary" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-border bg-card p-4 text-center hover:card-shadow transition-shadow"
                >
                  <item.icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
                  <p className="font-heading font-bold text-xl">{item.value}</p>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Upcoming */}
            <div className="mb-10">
              <h2 className="font-heading font-semibold text-lg mb-4">Upcoming Appointments</h2>
              {loading && <p className="text-sm text-muted-foreground">Loading appointments...</p>}
              {!loading && upcomingAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground">No upcoming appointments found.</p>
              )}
              <div className="space-y-3">
                {upcomingAppointments.map((appt, i) => (
                  <motion.div
                    key={appt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
                  >
                    <img src={findDoctor(appt.doctorName)?.image || doctors[0].image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm truncate">{appt.doctorName}</h3>
                      <p className="text-xs text-muted-foreground">{findDoctor(appt.doctorName)?.specialization || "Specialist"}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">{appt.date}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${appt.status === "accepted" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                      }`}>
                      {appt.status === "accepted" ? "Accepted" : "Pending"}
                    </span>
                    {appt.status === "accepted" && appt.appointmentCharge !== null && (
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-medium">INR {appt.appointmentCharge}</span>
                        {appt.paymentStatus === "paid" ? (
                          <span className="text-[11px] px-2 py-1 rounded-full bg-green-50 text-green-700">Paid</span>
                        ) : (
                          <Button
                            size="sm"
                            className="rounded-lg h-7 text-[11px]"
                            disabled={payingId === appt.id}
                            onClick={() => handlePay(appt.id)}
                          >
                            {payingId === appt.id ? "Paying..." : "Pay Now"}
                          </Button>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Past */}
            <div>
              <h2 className="font-heading font-semibold text-lg mb-4">Rejected Requests</h2>
              {!loading && pastAppointments.length === 0 && (
                <p className="text-sm text-muted-foreground">No rejected requests.</p>
              )}
              <div className="space-y-3">
                {pastAppointments.map((appt, i) => (
                  <div key={appt.id} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card opacity-70">
                    <img src={findDoctor(appt.doctorName)?.image || doctors[0].image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm truncate">{appt.doctorName}</h3>
                      <p className="text-xs text-muted-foreground">{findDoctor(appt.doctorName)?.specialization || "Specialist"}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">{appt.date}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      Rejected
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
