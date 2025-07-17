import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import QuotationPage from "./pages/quotation";
import CreateQuotationPage from "./pages/quotation/create";
import SalesOrderPage from "./pages/sales-order";
import LoginPage from "./pages/login";
import { ThemeProvider } from "@/components/theme-provider";
import { MainLayout } from "@/components/layout/main-layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthRoute from "./lib/auth-router";

const queryClient = new QueryClient();

function App() {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<AuthRoute type="Guest" />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>

              <Route element={<AuthRoute type="Private" />}>
                <Route element={<MainLayout />}>
                  <Route path="/">
                    <Route index element={<QuotationPage />} />
                    <Route path="create" element={<CreateQuotationPage />} />
                  </Route>
                  <Route path="/sales-order" element={<SalesOrderPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
