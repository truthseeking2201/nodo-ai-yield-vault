
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { vaultService } from "@/services/vaultService";
import type { VaultData } from "@/types/vault";
import { ArrowRight } from "lucide-react";

export default function VaultCatalog() {
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });

  // Get the gradient classes based on vault type
  const getVaultStyles = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          bgOpacity: 'bg-nova/20'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          bgOpacity: 'bg-orion/20'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          bgOpacity: 'bg-emerald/20'
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
                <Card 
                  key={vault.id} 
                  className={`glass-card hover:scale-[1.02] transition-all ${styles.shadow}`}
                >
                  <CardHeader>
                    <CardTitle className={`text-2xl ${styles.gradientText}`}>
                      {vault.name}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {vault.description.substring(0, 80)}...
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-white/60 mb-1">APR</p>
                        <p className={`font-mono font-bold text-lg ${styles.gradientText}`}>
                          {formatPercentage(vault.apr)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">APY</p>
                        <p className={`font-mono font-bold text-lg ${styles.gradientText}`}>
                          {formatPercentage(vault.apy)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/60 mb-1">TVL</p>
                        <p className="font-mono font-bold text-lg">
                          {formatCurrency(vault.tvl)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      asChild 
                      className={`w-full ${styles.gradientBg}`}
                    >
                      <Link to={`/vaults/${vault.id}`}>
                        Explore Vault <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center p-8 glass-card">
              <p>No vaults available at this time.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
