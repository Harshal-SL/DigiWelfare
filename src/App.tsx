import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SchemesPage from "./pages/SchemesPage";
import SchemeDetail from "./pages/SchemeDetail";
import AboutPage from "./pages/AboutPage";
import NotFound from "./pages/NotFound";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import SchemeApplicationPage from "./pages/SchemeApplicationPage";
import AdminNewSchemePage from "./pages/AdminNewSchemePage";
import EditSchemePage from "@/pages/EditSchemePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile-setup" element={<ProfileSetupPage />} />
                <Route path="/profile" element={<ProfileUpdatePage />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/new-scheme" element={<AdminNewSchemePage />} />
                <Route path="/schemes" element={<SchemesPage />} />
                <Route path="/schemes/:schemeId" element={<SchemeDetail />} />
                <Route path="/schemes/:schemeId/apply" element={<SchemeApplicationPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin/schemes/:schemeId" element={<EditSchemePage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
