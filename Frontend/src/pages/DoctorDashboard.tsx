import { useEffect, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Calendar, Check, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { toast } from "sonner";
import { getCurrentUser, getDoctorAppointments, updateAppointmentStatus, updateDoctorConsultationFee, updateDoctorProfile, uploadDoctorProfileImage } from "@/api";

const API_URL = import.meta.env.VITE_API_URL;


type Status = "pending" | "accepted" | "rejected";

interface Appointment {
  id: string;
  patient: string;
  date: string;
  time: string;
  reason: string;
  status: Status;
  charge: number | null;
  paymentStatus: "not_required" | "pending" | "paid";
}

export default function DoctorDashboard() {
  const [items, setItems] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [consultationFee, setConsultationFee] = useState("1000");
  const [savingFee, setSavingFee] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    specialization: "",
    experience: "5",
    location: "",
    hospitalOrClinic: "",
    bio: "",
    image: "",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAppointments() {
      try {
        setLoading(true);
        const data = await getDoctorAppointments();
        if (!isMounted) return;

        const mapped: Appointment[] = (data.appointments || []).map((a: any) => ({
          id: a.id,
          patient: a.patient_name,
          date: new Date(a.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          time: a.time,
          reason: a.reason,
          status: a.status,
          charge: typeof a.appointment_charge === "number" ? a.appointment_charge : null,
          paymentStatus: a.payment_status || "not_required",
        }));

        setItems(mapped);
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

  useEffect(() => {
    let mounted = true;

    async function loadDoctorProfile() {
      try {
        const user = await getCurrentUser();
        if (!mounted) return;

        const fee = user?.consultation_fee;
        if (typeof fee === "number" && Number.isFinite(fee)) {
          setConsultationFee(String(fee));
        }

        setProfile({
          name: user?.name || "",
          specialization: user?.specialization || "General Physician",
          experience: String(user?.experience || 5),
          location: user?.location || "Mumbai",
          hospitalOrClinic: user?.hospital_or_clinic || "City Care Clinic",
          bio: user?.bio || "",
          image: user?.image || "",
        });
      } catch {
        // Silent fail keeps dashboard usable even if profile request fails.
      }
    }

    loadDoctorProfile();
    return () => {
      mounted = false;
    };
  }, []);

  const updateStatus = async (id: string, status: Status) => {
    if (status === "pending") return;

    try {
      await updateAppointmentStatus(id, status);
      setItems((prev) => prev.map((a) => {
        if (a.id !== id) return a;

        if (status === "accepted") {
          return {
            ...a,
            status,
            charge: Number(consultationFee) || a.charge || 1000,
            paymentStatus: "pending",
          };
        }

        return {
          ...a,
          status,
          charge: null,
          paymentStatus: "not_required",
        };
      }));
      toast.success(status === "accepted" ? "Appointment accepted" : "Appointment declined");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update appointment status");
    }
  };

  const saveConsultationFee = async () => {
    const parsed = Number(consultationFee);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Please enter a valid consultation fee");
      return;
    }

    try {
      setSavingFee(true);
      await updateDoctorConsultationFee(parsed);
      toast.success("Consultation fee updated");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update consultation fee");
    } finally {
      setSavingFee(false);
    }
  };

  const saveDoctorProfile = async () => {
    const years = Number(profile.experience);
    if (!profile.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!profile.specialization.trim()) {
      toast.error("Please enter specialization");
      return;
    }

    if (!Number.isFinite(years) || years < 0) {
      toast.error("Please enter valid years of experience");
      return;
    }

    if (!profile.bio.trim()) {
      toast.error("Please add a short bio");
      return;
    }

    if (!profile.location.trim()) {
      toast.error("Please enter your location");
      return;
    }

    if (!profile.hospitalOrClinic.trim()) {
      toast.error("Please enter hospital or clinic name");
      return;
    }

    try {
      setSavingProfile(true);
      await updateDoctorProfile({
        name: profile.name.trim(),
        specialization: profile.specialization.trim(),
        experience: years,
        bio: profile.bio.trim(),
        image: profile.image.trim(),
        location: profile.location.trim(),
        hospital_or_clinic: profile.hospitalOrClinic.trim(),
      });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const onImageSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const data = await uploadDoctorProfileImage(file);
      setProfile((prev) => ({ ...prev, image: data.image || prev.image }));
      toast.success("Profile image uploaded");
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
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

            <div className="rounded-2xl border border-border bg-card p-4 mb-8">
              <h2 className="font-heading font-semibold text-sm mb-3">Doctor Profile</h2>
              {profile.image && (
                <div className="mb-3">
                  <img
  src={
    profile.image.startsWith("/uploads")
      ? `${API_URL}${profile.image}`
      : profile.image
  }
  alt="Doctor"
  className="w-20 h-20 rounded-xl object-cover border border-border"
/>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <input
                  value={profile.name}
                  onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
                <input
                  value={profile.specialization}
                  onChange={(e) => setProfile((prev) => ({ ...prev, specialization: e.target.value }))}
                  placeholder="Specialization"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  min="0"
                  value={profile.experience}
                  onChange={(e) => setProfile((prev) => ({ ...prev, experience: e.target.value }))}
                  placeholder="Experience (years)"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
                <input
                  value={profile.location}
                  onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                  placeholder="City / Location"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm"
                />
                <input
                  value={profile.hospitalOrClinic}
                  onChange={(e) => setProfile((prev) => ({ ...prev, hospitalOrClinic: e.target.value }))}
                  placeholder="Hospital / Clinic"
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageSelected}
                  className="w-full rounded-xl border border-border px-3 py-2 text-sm md:col-span-2"
                />
              </div>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="Write a short bio"
                className="w-full rounded-xl border border-border px-3 py-2 text-sm min-h-24"
              />
              <div className="mt-3 flex gap-2 items-center">
                <p className="text-xs text-muted-foreground">
                  {uploadingImage ? "Uploading image..." : "Select a photo file to upload."}
                </p>
                <Button onClick={saveDoctorProfile} disabled={savingProfile} className="rounded-xl">
                  {savingProfile ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-4 mb-8">
              <h2 className="font-heading font-semibold text-sm mb-3">Consultation Fee</h2>
              <p className="text-xs text-muted-foreground mb-3">
                This fee will be charged to patients only after you accept their appointment request.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="number"
                  min="1"
                  placeholder="Fee in INR"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className="w-full sm:w-52 rounded-xl border border-border px-3 py-2 text-sm"
                />
                <Button onClick={saveConsultationFee} disabled={savingFee} className="rounded-xl">
                  {savingFee ? "Saving..." : "Save Fee"}
                </Button>
              </div>
            </div>

            {/* Appointments */}
            <h2 className="font-heading font-semibold text-lg mb-4">Appointments</h2>
            {loading && <p className="text-sm text-muted-foreground">Loading appointment requests...</p>}
            {!loading && items.length === 0 && <p className="text-sm text-muted-foreground">No appointment requests found.</p>}
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
                    <p className="text-xs text-muted-foreground">{appt.reason}</p>
                    <p className="text-xs text-muted-foreground mt-1">{appt.date} at {appt.time}</p>
                    {appt.status === "accepted" && appt.charge !== null && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Charge: INR {appt.charge} · Payment: {appt.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </p>
                    )}
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
