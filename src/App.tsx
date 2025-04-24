
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import VaultCatalog from "./pages/VaultCatalog";
import VaultDetail from "./pages/VaultDetail";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Map of old vault IDs to new ones for backwards compatibility
const vaultIdMap = {
  "nova-yield": "deep-sui",
  "orion-stable": "cetus-sui",
  "emerald-growth": "sui-usdc"
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <MainLayout>
              <VaultCatalog />
            </MainLayout>
          } />
          {/* Routes for backward compatibility with old URLs */}
          <Route path="/vaults/orion-stable" element={<Navigate to="/vaults/cetus-sui" replace />} />
          <Route path="/vaults/nova-yield" element={<Navigate to="/vaults/deep-sui" replace />} />
          <Route path="/vaults/emerald-growth" element={<Navigate to="/vaults/sui-usdc" replace />} />
          {/* Regular vault detail route */}
          <Route path="/vaults/:vaultId" element={
            <MainLayout>
              <VaultDetail />
            </MainLayout>
          } />
          <Route path="/dashboard" element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
