
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useWallet } from "@/hooks/useWallet";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { VaultCarousel } from "@/components/vault/VaultCarousel";
import { VaultActivitySection } from "@/components/vault/VaultActivitySection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RiskLegend } from "@/components/vault/RiskLegend";
import { LiveTicker } from "@/components/vault/LiveTicker";
import { TestimonialCarousel } from "@/components/vault/TestimonialCarousel";
import { HowNodoWorks } from "@/components/vault/HowNodoWorks";
import { KpiRibbon } from "@/components/vault/KpiRibbon";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  // Define testimonial items
  const testimonialItems = [
    { quote: "Best yields on Sui!", handle: "@CryptoFanSUI" },
    { quote: "Fast deposits & reliable performance.", handle: "@VaultHunter" },
    { quote: "The AI rebalancing strategy really works.", handle: "@SuiWhale42" },
    { quote: "Love the transparent fees and security.", handle: "@DeFiMaster" }
  ];

  // Track scroll position for sticky button on mobile
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      setShowStickyButton(scrollPosition > (pageHeight - windowHeight) * 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeVault = vaults?.find(vault => vault.id === activeVaultId);

  return (
    <PageContainer>
      <style>{`
        body {
          background-color: var(--bg-base, #0D0E11);
        }
        body::before, body::after {
          content: none !important;
          display: none !important;
        }
      `}</style>
      <div className="flex flex-col space-y-12 relative z-0 max-w-[1280px] mx-auto">
        <div className="space-y-6">
          <HeroSection />
          <KpiRibbon />
          
          <VaultActivitySection />
        </div>

        <div className="relative">
          {/* Small risk legend instead of big legend */}
          <div className="flex items-center justify-end mb-4 gap-4">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-state-success">🟢</span>
              <span className="text-text-secondary">Low risk</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-state-warning">🟠</span>
              <span className="text-text-secondary">Medium risk</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-state-error">🔴</span>
              <span className="text-text-secondary">High risk</span>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="glass-card animate-pulse h-[300px]" />
              ))}
            </div>
          ) : error ? (
            <div className="col-span-full text-center p-8 glass-card">
              <p className="text-red-500">Error loading vaults. Please try again later.</p>
            </div>
          ) : vaults && vaults.length > 0 ? (
            <>
              <VaultGrid 
                vaults={vaults}
                isConnected={isConnected}
                balance={balance}
                activeVaultId={activeVaultId}
                onVaultHover={setActiveVaultId}
              />
              <VaultCarousel 
                vaults={vaults}
                isConnected={isConnected}
                balance={balance}
                activeVaultId={activeVaultId}
                onVaultHover={setActiveVaultId}
                carouselApi={carouselApi}
                setCarouselApi={setCarouselApi}
              />
            </>
          ) : (
            <div className="col-span-full text-center p-8 glass-card">
              <p>No vaults available at this time.</p>
            </div>
          )}
        </div>
        
        {/* How NODO Works - Horizontal Carousel */}
        <div className="overflow-hidden py-6">
          <h2 className="text-h2 mb-6">How NODO AI Maximizes Yield</h2>
          <div className="overflow-x-auto pb-4 -mx-6 px-6 hide-scrollbar">
            <div className="flex gap-6 w-max">
              <HowNodoWorks />
            </div>
          </div>
        </div>
        
        <TestimonialCarousel items={testimonialItems} />

        {showStickyButton && isConnected && balance.usdc > 0 && activeVault && (
          <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
            <Button 
              className="w-full bg-gradient-neural-orange py-6 rounded-[14px] shadow-e-3 text-text-inverse font-semibold"
              asChild
            >
              <Link to={`/vaults/${activeVault.id}`}>
                Deposit Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
