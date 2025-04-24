
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { vaultService } from "@/services/vaultService";
import type { VaultData } from "@/types/vault";
import { ArrowRight, Shield, Users, Clock, TrendingUp, Info } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { VaultCard } from "@/components/vault/VaultCard";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [showStickyButton, setShowStickyButton] = useState(false);
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null);

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

  // Skeleton loader for cards
  const VaultCardSkeleton = () => (
    <Card className="glass-card">
      <CardHeader className="space-y-2 p-4">
        <div className="h-5 bg-white/10 rounded animate-shimmer w-1/2"></div>
        <div className="h-4 bg-white/10 rounded animate-shimmer w-3/4"></div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-5 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-5 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-5 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4">
        <div className="h-12 bg-white/10 rounded animate-shimmer w-full"></div>
      </CardFooter>
    </Card>
  );

  return (
    <PageContainer>
      <div className="flex flex-col space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Discover <span className="gradient-text-nova">NODO AI</span> Vaults
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto">
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
          <div className="md:hidden overflow-x-auto no-scrollbar py-4">
            <div className="flex gap-4 snap-x snap-mandatory min-w-full px-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="snap-center min-w-[90%] shrink-0">
                    <VaultCardSkeleton />
                  </div>
                ))
              ) : error ? (
                <div className="w-full text-center p-8 glass-card">
                  <p className="text-red-500">Error loading vaults. Please try again later.</p>
                </div>
              ) : vaults && vaults.length > 0 ? (
                vaults.map((vault: VaultData) => (
                  <div key={vault.id} className="snap-center min-w-[90%] shrink-0">
                    <VaultCard 
                      vault={vault} 
                      isConnected={isConnected} 
                      hasBalance={balance.usdc > 0}
                      isActive={activeVaultId === vault.id}
                      onHover={() => setActiveVaultId(vault.id)}
                    />
                  </div>
                ))
              ) : (
                <div className="w-full text-center p-8 glass-card">
                  <p>No vaults available at this time.</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Activity Ticker - reduced height */}
        <div className="mt-8 glass-card p-4 bg-white/[0.03]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-medium">Live Activity</h3>
            <Button variant="ghost" size="sm" className="text-xs h-6">
              Show more
            </Button>
          </div>
          <VaultActivityTicker maxRows={3} rowHeight="h-6" />
        </div>

        {/* Mobile Sticky CTA - Only visible on mobile when scrolled down */}
        {showStickyButton && isConnected && balance.usdc > 0 && activeVaultId && (
          <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
            <Button 
              className="w-full gradient-bg-nova py-6 rounded-xl shadow-lg"
              asChild
            >
              <Link to={`/vaults/${activeVaultId}`}>
                Quick-Stake $100 <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
