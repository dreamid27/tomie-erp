import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import QuotationPage from './pages/quotation';
import CreateQuotationPage from './pages/quotation/create';
import QuotationDetailPage from './pages/quotation/detail';
import SalesOrderPage from './pages/sales-order';
import InvoicePage from './pages/sales-order/invoice';
import SettingsPage from './pages/settings';
import LoginPage from './pages/login';
import { ThemeProvider } from '@/components/theme-provider';
import { MainLayout } from '@/components/layout/main-layout';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthRoute from './lib/auth-router';
import { LayoutProvider } from '@/contexts/layout-context';
import { AuthProvider } from '@/contexts/auth-context';

const queryClient = new QueryClient();

function App() {
  return (
    <TooltipProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Toaster />
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LayoutProvider>
              <BrowserRouter>
                <Routes>
                  <Route element={<AuthRoute type="Guest" />}>
                    <Route path="/login" element={<LoginPage />} />
                  </Route>

                  <Route element={<AuthRoute type="Private" />}>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<QuotationPage />} />
                      <Route path="/quotation" element={<QuotationPage />} />
                      <Route
                        path="/quotation/create"
                        element={<CreateQuotationPage />}
                      />
                      <Route
                        path="/quotation/:id"
                        element={<QuotationDetailPage />}
                      />
                      <Route path="/sales-order" element={<SalesOrderPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                    </Route>
                    {/* Standalone invoice page without layout */}
                    <Route path="/sales-order/:id" element={<InvoicePage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
              </BrowserRouter>
            </LayoutProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </TooltipProvider>
  );
}

export default App;
