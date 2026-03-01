import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense, useEffect } from "react";
import Index from "./pages/Index";
import SkipLink from "./components/SkipLink";
import AccessibilityMenu from "./components/AccessibilityMenu";
import { I18nProvider, useI18n } from '@/hooks/I18nContext';

// Lazy-load all non-home pages to reduce initial bundle size
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Health = lazy(() => import("./pages/Health"));
const Warranty = lazy(() => import("./pages/Warranty"));
const NintendoSwitch2Manual = lazy(() => import("./pages/NintendoSwitch2Manual"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Admin pages — split into a separate chunk, loaded only when needed
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminProductForm = lazy(() => import("./pages/admin/ProductForm"));
const WarrantyRecords = lazy(() => import("./pages/admin/WarrantyRecords"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes — avoids redundant refetches on re-mount
    },
  },
});

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

const App = () => {
  return (
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
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  </I18nProvider>
  );
};

export default App;
