import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/components/ScrollToTop";
import { AuthProvider } from "@/lib/auth";
import AdminLoginDialog from "@/components/admin/AdminLoginDialog";
import Home from "./pages/Home";

// Everything except the home page is split into its own chunk, so the first
// visit downloads as little as possible. Later pages are cached by the browser.
const Services = lazy(() => import("./pages/Services"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Pricing = lazy(() => import("./pages/Pricing"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Help = lazy(() => import("./pages/Help"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Reports = lazy(() => import("./pages/Reports"));
const AdminLogins = lazy(() => import("./pages/AdminLogins"));
const AdminInvoices = lazy(() => import("./pages/AdminInvoices"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center" role="status" aria-label="Loading">
      <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-gold-text/25 border-t-gold-text" />
    </div>
  );
}

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <ScrollToTop />
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/admin/reports" element={<Reports />} />
                <Route path="/admin/logins" element={<AdminLogins />} />
                <Route path="/admin/invoices/*" element={<AdminInvoices />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <AdminLoginDialog />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
