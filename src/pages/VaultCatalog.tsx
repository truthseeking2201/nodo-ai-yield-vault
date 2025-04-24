
import { useState } from "react";
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
import { AICanvas } from "@/components/background/AICanvas";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  // Track scroll position for sticky button on mobile
  useState(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      setShowStickyButton(scrollPosition > (pageHeight - windowHeight) * 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  const activeVault = vaults?.find(vault => vault.id === activeVaultId);

  return (
    <PageContainer>
      {/* AI Canvas Background */}
      <AICanvas />
      
      <div className="flex flex-col space-y-8">
        <HeroSection />

        <div className="relative pt-8">
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
        
        <VaultActivitySection />

        {/* Mobile Sticky CTA */}
        {showStickyButton && isConnected && balance.usdc > 0 && activeVault && (
          <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
            <Button 
              className="w-full gradient-bg-nova py-6 rounded-xl shadow-lg"
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
