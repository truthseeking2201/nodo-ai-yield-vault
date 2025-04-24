import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { VaultSecurityInfo } from "@/components/vault/VaultSecurityInfo";
import { NODOAIxCard } from "@/components/vault/NODOAIxCard";
import { VaultMetricsCard } from "@/components/vault/VaultMetricsCard";
import { VaultPerformanceSection } from "@/components/vault/VaultPerformanceSection";
import { VaultStickyBar } from "@/components/vault/VaultStickyBar";
import { DepositDrawer } from "@/components/vault/DepositDrawer";
import { useWallet } from "@/hooks/useWallet";
import { useVaultDetail } from "@/hooks/useVaultDetail";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [projectedAmount, setProjectedAmount] = useState<string>("");
  const [unlockProgress, setUnlockProgress] = useState<number>(0);

  const { 
    vault, 
    isLoading, 
    error,
    getVaultStyles
  } = useVaultDetail(vaultId || '');

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

  const styles = getVaultStyles(vault.type);
  const handleActionClick = () => {
    if (isConnected) {
      setIsDepositDrawerOpen(true);
    } else {
      const walletBtn = document.querySelector('[data-wallet-connect]');
      if (walletBtn) {
        (walletBtn as HTMLElement).click();
      }
    }
  };

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
        <div className="lg:col-span-2 space-y-6">
          <VaultPerformanceSection
            vault={vault}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            styles={styles}
          />

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Strategy & Risk Profile</CardTitle>
              <CardDescription>Understanding this vault's investment approach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <VaultSecurityInfo 
                contractAddress="0x1234567890abcdef1234567890abcdef12345678"
                isAudited={true}
                explorerUrl="https://explorer.sui.io/address/0x1234567890abcdef1234567890abcdef12345678"
              />
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

          <Card className="glass-card">
            <CardContent>
              <VaultActivityTicker />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <VaultMetricsCard
            vault={vault}
            styles={styles}
            projectedAmount={projectedAmount}
            onProjectedAmountChange={setProjectedAmount}
            isConnected={isConnected}
            onActionClick={handleActionClick}
          />

          <NODOAIxCard
            balance={1000}
            principal={1000}
            fees={12.3}
            unlockTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            holderCount={1203}
            contractAddress="0xAB1234567890ABCDEF1234567890ABCDEF123456"
            auditUrl="/audit.pdf"
            styles={styles}
          />
        </div>
      </div>

      <VaultStickyBar 
        isConnected={isConnected}
        styles={styles}
        onActionClick={handleActionClick}
      />

      <DepositDrawer 
        open={isDepositDrawerOpen}
        onClose={() => setIsDepositDrawerOpen(false)}
        vault={vault}
      />
    </PageContainer>
  );
}
