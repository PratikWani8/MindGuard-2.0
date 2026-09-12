import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicLayout from "./components/layout/PublicLayout";
import DashboardLayout from "./components/layout/DashboardLayout";

import Landing from "./pages/public/Landing";
import About from "./pages/public/About";
import HowItWorks from "./pages/public/HowItWorks";
import Privacy from "./pages/public/Privacy";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/dashboard/Dashboard";
import Checkin from "./pages/dashboard/Checkin";
import Journal from "./pages/dashboard/Journal";
import JournalHistory from "./pages/dashboard/JournalHistory";
import JournalEntry from "./pages/dashboard/JournalEntry";
import Insights from "./pages/dashboard/Insights";
import Trends from "./pages/dashboard/Trends";
import WellnessPlan from "./pages/dashboard/WellnessPlan";
import Assistant from "./pages/dashboard/Assistant";
import Support from "./pages/dashboard/Support";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/checkin" element={<Checkin />} />
              <Route path="/dashboard/journal" element={<Journal />} />
              <Route path="/dashboard/journal/history" element={<JournalHistory />} />
              <Route path="/dashboard/journal/:id" element={<JournalEntry />} />
              <Route path="/dashboard/insights" element={<Insights />} />
              <Route path="/dashboard/trends" element={<Trends />} />
              <Route path="/dashboard/wellness-plan" element={<WellnessPlan />} />
              <Route path="/dashboard/assistant" element={<Assistant />} />
              <Route path="/dashboard/support" element={<Support />} />
              <Route path="/dashboard/profile" element={<Profile />} />
              <Route path="/dashboard/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
