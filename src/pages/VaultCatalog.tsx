
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { vaultService } from "@/services/vaultService";
import type { VaultData } from "@/types/vault";
import { ArrowRight } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { VaultCard } from "@/components/vault/VaultCard";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

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
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const pageHeight = document.body.scrollHeight;
      const windowHeight = window.innerHeight;
      
      // Show sticky button when scrolled past 80% of the page
      setShowStickyButton(scrollPosition > (pageHeight - windowHeight) * 0.8);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Find the active vault data
  const activeVault = vaults?.find(vault => vault.id === activeVaultId);

  // Skeleton loader for cards
  const VaultCardSkeleton = () => (
    <div className="glass-card rounded-[20px] animate-pulse">
      <div className="h-1 bg-white/10"></div>
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <div className="h-6 bg-white/10 rounded w-1/3"></div>
          <div className="h-5 bg-white/10 rounded-full w-16"></div>
        </div>
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        
        <div className="grid grid-cols-3 gap-2 py-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 bg-white/10 rounded w-12"></div>
              <div className="h-5 bg-white/10 rounded w-16"></div>
            </div>
          ))}
        </div>
        
        <div className="h-px bg-white/10 my-4"></div>
        <div className="h-12 bg-white/10 rounded-full"></div>
        <div className="h-4 bg-white/10 rounded w-2/3 mx-auto"></div>
      </div>
    </div>
  );

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        {/* Hero section with radial glow */}
        <div className="text-center space-y-6 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-[#FF8800]/20 to-transparent opacity-80 mix-blend-screen -z-10 animate-fade-in"></div>
          <h1 className="text-3xl md:text-4xl font-bold font-sans tracking-tight">
            Discover <span className="gradient-text-nova">NODO AI</span> Vaults
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-base">
            AI-powered yield-generating vaults designed to maximize your returns while managing risk.
          </p>
        </div>

        <div className="relative pt-8">
          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <VaultCardSkeleton key={index} />
              ))
            ) : error ? (
              <div className="col-span-full text-center p-8 glass-card">
                <p className="text-red-500">Error loading vaults. Please try again later.</p>
              </div>
            ) : vaults && vaults.length > 0 ? (
              vaults.map((vault: VaultData) => (
                <VaultCard 
                  key={vault.id} 
                  vault={vault} 
                  isConnected={isConnected} 
                  hasBalance={balance.usdc > 0}
                  isActive={activeVaultId === vault.id}
                  onHover={() => setActiveVaultId(vault.id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center p-8 glass-card">
                <p>No vaults available at this time.</p>
              </div>
            )}
          </div>

          {/* Mobile carousel layout */}
          <div className="md:hidden w-full px-4">
            {isLoading ? (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <VaultCardSkeleton key={index} />
                ))}
              </div>
            ) : error ? (
              <div className="w-full text-center p-8 glass-card">
                <p className="text-red-500">Error loading vaults. Please try again later.</p>
              </div>
            ) : vaults && vaults.length > 0 ? (
              <Carousel
                setApi={setCarouselApi}
                className="w-full"
                opts={{
                  align: "start",
                  loop: true,
                }}
              >
                <CarouselContent>
                  {vaults.map((vault: VaultData, index) => (
                    <CarouselItem key={vault.id} className="basis-[90%] pl-4">
                      <VaultCard 
                        vault={vault} 
                        isConnected={isConnected} 
                        hasBalance={balance.usdc > 0}
                        isActive={activeVaultId === vault.id}
                        onHover={() => setActiveVaultId(vault.id)}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  {vaults.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => carouselApi?.scrollTo(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        activeVaultId === vaults[index]?.id 
                          ? "bg-white" 
                          : "bg-white/30"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </Carousel>
            ) : (
              <div className="w-full text-center p-8 glass-card">
                <p>No vaults available at this time.</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Activity Ticker - reduced height */}
        <div className="mt-8 glass-card p-4 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium">Live Activity</h3>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              Show more
            </Button>
          </div>
          <VaultActivityTicker maxRows={3} rowHeight="h-6" />
        </div>

        {/* Mobile Sticky CTA - Only visible on mobile when scrolled down */}
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
