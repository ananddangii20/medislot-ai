import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import DoctorProfile from "./pages/DoctorProfile";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import SymptomChecker from "./pages/SymptomChecker";
import NotFound from "./pages/NotFound";
import { DoctorDashboardOnlyGate, ProtectedRoute } from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route
            path="/home"
            element={
              <DoctorDashboardOnlyGate>
                <Home />
              </DoctorDashboardOnlyGate>
            }
          />
          <Route
            path="/doctors"
            element={
              <DoctorDashboardOnlyGate>
                <Doctors />
              </DoctorDashboardOnlyGate>
            }
          />
          <Route
            path="/doctor/:id"
            element={
              <DoctorDashboardOnlyGate>
                <DoctorProfile />
              </DoctorDashboardOnlyGate>
            }
          />
          <Route
            path="/booking/:id"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctor-dashboard"
            element={
              <ProtectedRoute allowedRoles={["doctor"]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/symptom-checker"
            element={
              <DoctorDashboardOnlyGate>
                <SymptomChecker />
              </DoctorDashboardOnlyGate>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
