
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { vaultService } from "@/services/vaultService";
import { DepositDrawer } from "@/components/vault/DepositDrawer";
import { VaultPerformanceChart } from "@/components/vault/VaultPerformanceChart";
import { useWallet } from "@/hooks/useWallet";
import { ArrowRight, ChartBar, Wallet } from "lucide-react";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  
  // Fetch vault data
  const { 
    data: vault, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['vault', vaultId],
    queryFn: () => vaultId ? vaultService.getVaultById(vaultId) : null,
  });

  // Helper functions
  const getVaultStyles = (type?: 'nova' | 'orion' | 'emerald') => {
    if (!type) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: ''
    };
    
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

  const formatPercentage = (value?: number) => {
    return value !== undefined ? `${value.toFixed(1)}%` : '-';
  };

  const formatCurrency = (value?: number) => {
    return value !== undefined ? new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value) : '-';
  };

  // Get styles based on vault type
  const styles = getVaultStyles(vault?.type);

  // Load skeleton
  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <div className="h-16 bg-white/10 rounded animate-shimmer w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-white/10 rounded animate-shimmer"></div>
              <div className="h-64 bg-white/10 rounded animate-shimmer"></div>
            </div>
            <div className="space-y-6">
              <div className="h-64 bg-white/10 rounded animate-shimmer"></div>
              <div className="h-48 bg-white/10 rounded animate-shimmer"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Handle error
  if (error || !vault) {
    return (
      <PageContainer>
        <Card className="glass-card p-8 text-center">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Vault</h2>
          <p className="text-white/60 mb-6">
            We couldn't load the vault information. Please try again later.
          </p>
          <Button onClick={() => navigate('/')}>Return to Vault Catalog</Button>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate('/')}
        >
          ← Back to Vaults
        </Button>
        <h1 className={`text-3xl md:text-4xl font-bold ${styles.gradientText}`}>
          {vault.name} Vault
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left column (2 cols wide) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart */}
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ChartBar className="h-5 w-5" />
                  Performance
                </CardTitle>
                <CardDescription>Historical vault performance</CardDescription>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant={timeRange === "daily" ? "default" : "outline"} 
                  size="sm"
                  className={timeRange === "daily" ? styles.gradientBg : "bg-white/5 border-white/10"}
                  onClick={() => setTimeRange("daily")}
                >
                  Daily
                </Button>
                <Button 
                  variant={timeRange === "weekly" ? "default" : "outline"} 
                  size="sm"
                  className={timeRange === "weekly" ? styles.gradientBg : "bg-white/5 border-white/10"}
                  onClick={() => setTimeRange("weekly")}
                >
                  Weekly
                </Button>
                <Button 
                  variant={timeRange === "monthly" ? "default" : "outline"} 
                  size="sm"
                  className={timeRange === "monthly" ? styles.gradientBg : "bg-white/5 border-white/10"}
                  onClick={() => setTimeRange("monthly")}
                >
                  Monthly
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <VaultPerformanceChart 
                  data={vault.performance[timeRange]} 
                  vaultType={vault.type}
                />
              </div>
            </CardContent>
          </Card>

          {/* Strategy & Risk */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Strategy & Risk Profile</CardTitle>
              <CardDescription>Understanding this vault's investment approach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Investment Strategy</h3>
                <p className="text-white/80">{vault.strategy}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Risk Level</h3>
                <div className="flex items-center">
                  <span className={`
                    inline-block px-3 py-1 rounded-full text-sm font-medium
                    ${vault.riskLevel === 'low' ? 'bg-emerald/30 text-emerald' : 
                      vault.riskLevel === 'medium' ? 'bg-orion/30 text-orion' :
                      'bg-nova/30 text-nova'}
                  `}>
                    {vault.riskLevel.charAt(0).toUpperCase() + vault.riskLevel.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - right column */}
        <div className="space-y-6">
          {/* Vault metrics */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Vault Metrics</CardTitle>
              <CardDescription>Current performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-white/60">APR</span>
                <span className={`font-mono text-lg font-bold ${styles.gradientText}`}>
                  {formatPercentage(vault.apr)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-white/60">APY</span>
                <span className={`font-mono text-lg font-bold ${styles.gradientText}`}>
                  {formatPercentage(vault.apy)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-white/60">TVL</span>
                <span className="font-mono text-lg font-bold">
                  {formatCurrency(vault.tvl)}
                </span>
              </div>
              <div>
                <h3 className="text-sm text-white/60 mb-2">Lockup Periods</h3>
                <div className="space-y-2">
                  {vault.lockupPeriods.map((period) => (
                    <div key={period.days} className="flex justify-between items-center">
                      <span>{period.days} days</span>
                      <span className={`font-mono ${period.aprBoost > 0 ? styles.gradientText : ''}`}>
                        {period.aprBoost > 0 ? `+${period.aprBoost}%` : 'No boost'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Deposit Card */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Ready to Invest?</CardTitle>
              <CardDescription>Start earning yield on your assets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className={`w-full ${styles.gradientBg} ${styles.shadow}`}
                onClick={() => {
                  if (isConnected) {
                    setIsDepositDrawerOpen(true);
                  } else {
                    // This will trigger the connect wallet modal from Header
                    const walletBtn = document.querySelector('[data-wallet-connect]');
                    if (walletBtn) {
                      (walletBtn as HTMLElement).click();
                    }
                  }
                }}
              >
                {isConnected ? (
                  <>Deposit Now <ArrowRight className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Deposit Drawer */}
      <DepositDrawer 
        open={isDepositDrawerOpen}
        onClose={() => setIsDepositDrawerOpen(false)}
        vault={vault}
      />
    </PageContainer>
  );
}
