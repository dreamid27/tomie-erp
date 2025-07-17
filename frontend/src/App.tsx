import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/index";
import QuotationPage from "./pages/quotation";
import SalesOrderPage from "./pages/sales-order";
import LoginPage from "./pages/login";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";

// This would be replaced with actual auth check
const isAuthenticated = false;

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Index />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/quotation"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <QuotationPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales-order"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <SalesOrderPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
