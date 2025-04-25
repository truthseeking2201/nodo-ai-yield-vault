import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useWallet } from "@/hooks/useWallet";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { RiskLegend } from "@/components/vault/RiskLegend";
import { ActivitySection } from "@/components/vault/ActivitySection";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);
  const [showPromo, setShowPromo] = useState(true);

  const testimonialItems = [
    { quote: "Best yields on Sui!", handle: "@CryptoFanSUI" },
    { quote: "Fast deposits & reliable performance.", handle: "@VaultHunter" },
    { quote: "The AI rebalancing strategy really works.", handle: "@SuiWhale42" },
    { quote: "Love the transparent fees and security.", handle: "@DeFiMaster" }
  ];

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

  const catalogV2Enabled = true;

  const activeVault = vaults?.find(vault => vault.id === activeVaultId);

  return (
    <PageContainer>
      <style>{`
        body {
          background-color: #0F1012;
        }
        body::before, body::after {
          content: none !important;
          display: none !important;
        }
      `}</style>
      <div className="flex flex-col space-y-24 relative z-0">
        <section className="mt-8">
          <HeroSection />
        </section>

        <section>
          <div className="relative">
            {catalogV2Enabled && <RiskLegend />}
            
            {isLoading ? (
              <div className="space-y-8">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="glass-card animate-pulse h-[300px]" />
                ))}
              </div>
            ) : error ? (
              <div className="col-span-full text-center p-8 glass-card">
                <p className="text-red-500">Error loading vaults. Please try again later.</p>
              </div>
            ) : vaults && vaults.length > 0 ? (
              <div className="space-y-24">
                <VaultGrid 
                  vaults={vaults}
                  isConnected={isConnected}
                  balance={balance}
                  activeVaultId={activeVaultId}
                  onVaultHover={setActiveVaultId}
                />

                <ActivitySection />
              </div>
            ) : (
              <div className="col-span-full text-center p-8 glass-card">
                <p>No vaults available at this time.</p>
              </div>
            )}
          </div>
        </section>

        {showStickyButton && isConnected && balance.usdc > 0 && activeVault && (
          <div className="fixed bottom-4 left-0 right-0 z-40 md:hidden px-4">
            <Button 
              className="w-full gradient-bg-nova py-6 rounded-xl shadow-lg text-[#0E0F11]"
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
