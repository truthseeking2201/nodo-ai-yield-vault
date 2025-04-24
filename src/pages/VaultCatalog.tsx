
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { vaultService } from "@/services/vaultService";
import type { VaultData } from "@/types/vault";
import { ArrowRight, Shield, Users, Clock, TrendingUp, Zap } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { VaultROICalculator } from "@/components/vault/VaultROICalculator";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const { isConnected, balance } = useWallet();
  const [showStickyButton, setShowStickyButton] = useState(false);

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

  // Get the gradient classes based on vault type
  const getVaultStyles = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          bgOpacity: 'bg-nova/20',
          borderColor: 'border-nova/30',
          shieldColor: 'text-nova'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          bgOpacity: 'bg-orion/20',
          borderColor: 'border-orion/30',
          shieldColor: 'text-orion'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          bgOpacity: 'bg-emerald/20',
          borderColor: 'border-emerald/30',
          shieldColor: 'text-emerald'
        };
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate time remaining for promo
  const getTimeRemaining = () => {
    // Mock countdown - in a real app, this would be based on server time
    const hours = 2;
    const minutes = 59;
    const seconds = 12;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate unlock date
  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get appropriate button text based on user state
  const getButtonText = (vault: VaultData) => {
    if (isConnected && balance.usdc > 0) {
      return (
        <div className="flex flex-col items-center w-full">
          <span className="flex items-center">Deposit Now <ArrowRight className="ml-2 h-4 w-4" /></span>
          <span className="text-xs mt-1 opacity-80">+0.5% APR boost for today's deposits</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center w-full">
        <span className="flex items-center">View Vault Details <ArrowRight className="ml-2 h-4 w-4" /></span>
      </div>
    );
  };

  // Skeleton loader for cards
  const VaultCardSkeleton = () => (
    <Card className="glass-card">
      <CardHeader className="space-y-2">
        <div className="h-7 bg-white/10 rounded animate-shimmer w-1/2"></div>
        <div className="h-4 bg-white/10 rounded animate-shimmer w-3/4"></div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-6 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-6 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-white/10 rounded animate-shimmer w-3/4"></div>
            <div className="h-6 bg-white/10 rounded animate-shimmer w-1/2"></div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 bg-white/10 rounded animate-shimmer w-full"></div>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <VaultCardSkeleton key={index} />
            ))
          ) : error ? (
            <div className="col-span-full text-center p-8 glass-card">
              <p className="text-red-500">Error loading vaults. Please try again later.</p>
            </div>
          ) : vaults && vaults.length > 0 ? (
            vaults.map((vault: VaultData) => {
              const styles = getVaultStyles(vault.type);
              
              return (
                <TooltipProvider key={vault.id}>
                  <Card 
                    className={`glass-card hover:scale-[1.02] transition-all ${styles.shadow} relative border ${styles.borderColor}`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className={`text-2xl ${styles.gradientText}`}>
                          {vault.name}
                        </CardTitle>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-1">
                              <Shield className={`h-5 w-5 ${styles.shieldColor}`} />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <div className="space-y-1">
                              <p className="font-semibold">Audit ✓ WatchPUG, Feb 2025</p>
                              <p className="text-xs">Smart contract verified and audited for security</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <CardDescription className="text-white/60">
                        {vault.description.substring(0, 80)}...
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-2">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-white/60">APR</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <TrendingUp className="h-3 w-3 text-white/40" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  Annual Percentage Rate based on current yield distribution
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className={`font-mono font-bold text-lg ${styles.gradientText}`}>
                            {formatPercentage(vault.apr)}
                          </p>
                          <p className="text-xs text-white/60">
                            +0.5% today
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-white/60 mb-1">APY</p>
                          <p className={`font-mono font-bold text-lg ${styles.gradientText}`}>
                            {formatPercentage(vault.apy)}
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-xs text-white/60">TVL</p>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Users className="h-3 w-3 text-white/40" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs max-w-xs">
                                  1,203 LPs (Liquidity Providers) currently active
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <p className="font-mono font-bold text-lg">
                            {formatCurrency(vault.tvl)}
                          </p>
                        </div>
                      </div>

                      <div>
                        <VaultROICalculator vault={vault} />
                      </div>

                      <div className="border-t border-white/10 pt-4 space-y-2">
                        <Button 
                          asChild 
                          className={`w-full ${styles.gradientBg} gap-2`}
                        >
                          <Link to={`/vaults/${vault.id}`}>
                            {getButtonText(vault)}
                          </Link>
                        </Button>

                        <div className="flex justify-between text-xs text-white/60 items-center mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Unlocks in 30 days ({getUnlockDate()})</span>
                          </div>
                          <div>
                            Gas ≈ 0.006 SUI
                          </div>
                        </div>

                        {isConnected && (
                          <div className="text-center text-xs text-white/80 mt-2">
                            <Zap className="h-3 w-3 inline mr-1 text-yellow-400" />
                            <span className="text-yellow-400">First Deposit Bonus +100 pts</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TooltipProvider>
              );
            })
          ) : (
            <div className="col-span-full text-center p-8 glass-card">
              <p>No vaults available at this time.</p>
            </div>
          )}
        </div>
        
        {/* Activity Ticker */}
        <div className="mt-8 glass-card p-4">
          <h3 className="text-lg font-semibold mb-3">Live Activity</h3>
          <VaultActivityTicker />
        </div>

        {/* Mobile Sticky CTA - Only visible on mobile when scrolled down */}
        {showStickyButton && isConnected && balance.usdc > 0 && (
          <div className="fixed bottom-4 left-0 right-0 z-50 md:hidden px-4">
            <Button 
              className="w-full gradient-bg-nova py-6 rounded-xl shadow-lg"
              asChild
            >
              <Link to={vaults && vaults.length > 0 ? `/vaults/${vaults[0].id}` : "#"}>
                Quick-Stake $100 <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
