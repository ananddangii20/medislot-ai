import { motion } from "framer-motion";
import { Calendar, Clock, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { Link } from "react-router-dom";
import { doctors } from "@/data/doctors";

const upcomingAppointments = [
  { doctor: doctors[0], date: "Apr 10, 2026", time: "10:00 AM", status: "Confirmed" },
  { doctor: doctors[2], date: "Apr 14, 2026", time: "2:00 PM", status: "Pending" },
];

const pastAppointments = [
  { doctor: doctors[5], date: "Mar 28, 2026", time: "11:30 AM", status: "Completed" },
];

export default function PatientDashboard() {
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
                { icon: Calendar, label: "Appointments", value: "3", color: "text-primary" },
                { icon: Clock, label: "Upcoming", value: "2", color: "text-amber-500" },
                { icon: FileText, label: "Completed", value: "1", color: "text-green-500" },
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
              <div className="space-y-3">
                {upcomingAppointments.map((appt, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
                  >
                    <img src={appt.doctor.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm truncate">{appt.doctor.name}</h3>
                      <p className="text-xs text-muted-foreground">{appt.doctor.specialization}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">{appt.date}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      appt.status === "Confirmed" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                    }`}>
                      {appt.status}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Past */}
            <div>
              <h2 className="font-heading font-semibold text-lg mb-4">Booking History</h2>
              <div className="space-y-3">
                {pastAppointments.map((appt, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card opacity-70">
                    <img src={appt.doctor.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-semibold text-sm truncate">{appt.doctor.name}</h3>
                      <p className="text-xs text-muted-foreground">{appt.doctor.specialization}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-medium">{appt.date}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                      {appt.status}
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
