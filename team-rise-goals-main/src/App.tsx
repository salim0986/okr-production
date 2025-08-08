import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import OKRs from "./pages/OKRs";
import Calendar from "./pages/Calendar";
import Teams from "./pages/Teams";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="okrs" element={<OKRs />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="teams" element={<Teams />} />
            <Route path="team" element={<Teams />} />
            <Route path="reports" element={<Reports />} />
            <Route path="history" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
