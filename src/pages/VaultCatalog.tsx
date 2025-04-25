
import { PageContainer } from "@/components/layout/PageContainer";
import { vaultService } from "@/services/vaultService";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/vault/HeroSection";
import { VaultGrid } from "@/components/vault/VaultGrid";
import { ActivitySection } from "@/components/vault/ActivitySection";
import { useWallet } from "@/hooks/useWallet";
import { useState } from "react";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

  const handleVaultHover = (id: string) => {
    setActiveVaultId(id);
  };

  return (
    <PageContainer>
      <div className="flex flex-col space-y-12 relative z-0">
        <section className="mt-8">
          <HeroSection />
        </section>

        <section className="relative">
          {isLoading ? (
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="vault-card animate-pulse h-[300px]" />
              ))}
            </div>
          ) : error ? (
            <div className="col-span-full text-center p-8 glass-card">
              <p className="text-red-500">Error loading vaults. Please try again later.</p>
            </div>
          ) : vaults && vaults.length > 0 ? (
            <div className="space-y-12">
              <VaultGrid 
                vaults={vaults} 
                isConnected={isConnected}
                balance={balance || { usdc: 0 }} // Provide default if balance is undefined
                activeVaultId={activeVaultId}
                onVaultHover={handleVaultHover}
              />
              <ActivitySection />
            </div>
          ) : (
            <div className="col-span-full text-center p-8 glass-card">
              <p>No vaults available at this time.</p>
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  );
}
