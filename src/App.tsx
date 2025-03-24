
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Public pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Auth pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import ForgotPassword from "./pages/admin/ForgotPassword";

// Admin Dashboard pages
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import UsersPage from "./pages/admin/UsersPage";
import ProductsPage from "./pages/admin/ProductsPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            
            {/* Admin Auth Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="orders" element={<Dashboard />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<Dashboard />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
