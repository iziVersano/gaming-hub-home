import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Health from "./pages/Health";
import Warranty from "./pages/Warranty";
import NintendoSwitch2Manual from "./pages/NintendoSwitch2Manual";
import Accessibility from "./pages/Accessibility";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminProductForm from "./pages/admin/ProductForm";
import WarrantyRecords from "./pages/admin/WarrantyRecords";
import SkipLink from "./components/SkipLink";
import AccessibilityMenu from "./components/AccessibilityMenu";
import { I18nProvider, useI18n } from './hooks/I18nContext';

import { useEffect } from "react";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
};

// Component to set HTML dir and lang attributes for RTL support
const HtmlDirectionSetter = () => {
  const { lang } = useI18n();

  useEffect(() => {
    const htmlElement = document.documentElement;
    // Set language attribute
    htmlElement.setAttribute('lang', lang);
    // Set direction: RTL for Hebrew, LTR for English
    htmlElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
  }, [lang]);

  return null;
};

const App = () => (
  <I18nProvider>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SkipLink />
            <AccessibilityMenu />
            <ScrollToTop />
            <HtmlDirectionSetter />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/health" element={<Health />} />
              <Route path="/warranty" element={<Warranty />} />
              <Route path="/nintendo-switch-2" element={<NintendoSwitch2Manual />} />
              <Route path="/accessibility" element={<Accessibility />} />
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/edit/:id" element={<AdminProductForm />} />
              <Route path="/admin/warranty-records" element={<WarrantyRecords />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </I18nProvider>
);

export default App;
