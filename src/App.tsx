import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HowItWorks from "./pages/HowItWorks";
import WhyAfrinexus from "./pages/WhyAfrinexus";
import Security from "./pages/Security";
import WhoItsFor from "./pages/WhoItsFor";
import EarlyAccess from "./pages/EarlyAccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Platform from "./pages/Platform";
import Pricing from "./pages/Pricing";
import Vision from "./pages/Vision";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/why-afrinexus" element={<WhyAfrinexus />} />
          <Route path="/security" element={<Security />} />
          <Route path="/who-its-for" element={<WhoItsFor />} />
          <Route path="/early-access" element={<EarlyAccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
