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
import Chat from "./pages/Chat";
import NotFound from "./pages/NotFound";
import Verification from "./pages/journey/Verification";
import DealRoom from "./pages/journey/DealRoom";
import Contracts from "./pages/journey/Contracts";
import JourneyLogistics from "./pages/journey/Logistics";
import Tracking from "./pages/journey/Tracking";
import { ChatWidget } from "./components/chat/ChatWidget";

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
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/journey/verification" element={<Verification />} />
          <Route path="/journey/deal-room" element={<DealRoom />} />
          <Route path="/journey/contracts" element={<Contracts />} />
          <Route path="/journey/logistics" element={<JourneyLogistics />} />
          <Route path="/journey/tracking" element={<Tracking />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ChatWidget />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
