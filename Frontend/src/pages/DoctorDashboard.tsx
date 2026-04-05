import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";

type Status = "pending" | "accepted" | "rejected";

interface Appointment {
  id: number;
  patient: string;
  age: number;
  date: string;
  time: string;
  reason: string;
  status: Status;
}

const appointments: Appointment[] = [
  { id: 1, patient: "Alex Johnson", age: 34, date: "Apr 10, 2026", time: "10:00 AM", reason: "Chest pain", status: "pending" },
  { id: 2, patient: "Maria Garcia", age: 28, date: "Apr 10, 2026", time: "11:30 AM", reason: "Follow-up", status: "pending" },
  { id: 3, patient: "David Lee", age: 45, date: "Apr 10, 2026", time: "2:00 PM", reason: "Annual checkup", status: "accepted" },
];

export default function DoctorDashboard() {
  const [items, setItems] = useState(appointments);

  const updateStatus = (id: number, status: Status) => {
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    toast.success(status === "accepted" ? "Appointment accepted" : "Appointment declined");
  };

  const statusColors: Record<Status, string> = {
    pending: "bg-amber-50 text-amber-600",
    accepted: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-600",
  };

  return (
    <>
      <Navbar />
      <PageTransition>
        <main className="pt-20 pb-10 min-h-screen">
          <div className="container max-w-4xl">
            <div className="mb-8">
              <h1 className="font-heading font-bold text-2xl">Doctor Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Manage your appointments and availability</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { label: "Today", value: items.length, icon: Calendar },
                { label: "Pending", value: items.filter((a) => a.status === "pending").length, icon: Clock },
                { label: "Accepted", value: items.filter((a) => a.status === "accepted").length, icon: Check },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <s.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="font-heading font-bold text-xl">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Appointments */}
            <h2 className="font-heading font-semibold text-lg mb-4">Appointments</h2>
            <div className="space-y-3">
              {items.map((appt, i) => (
                <motion.div
                  key={appt.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl border border-border bg-card"
                >
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-sm">{appt.patient}</h3>
                    <p className="text-xs text-muted-foreground">Age {appt.age} · {appt.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appt.date} at {appt.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${statusColors[appt.status]}`}>
                      {appt.status}
                    </span>
                    {appt.status === "pending" && (
                      <>
                        <Button size="sm" className="rounded-xl gap-1 text-xs" onClick={() => updateStatus(appt.id, "accepted")}>
                          <Check className="w-3.5 h-3.5" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-xl gap-1 text-xs" onClick={() => updateStatus(appt.id, "rejected")}>
                          <X className="w-3.5 h-3.5" /> Decline
                        </Button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </PageTransition>
    </>
  );
}
