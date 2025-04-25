import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VaultDetailSkeleton } from "@/components/vault/VaultDetailSkeleton";
import { VaultDetailError } from "@/components/vault/VaultDetailError";
import { VaultDetailHeader } from "@/components/vault/VaultDetailHeader";
import { VaultDetailLayout } from "@/components/vault/VaultDetailLayout";
import { VaultPerformanceSection } from "@/components/vault/VaultPerformanceSection";
import { VaultMetricsCard } from "@/components/vault/VaultMetricsCard";
import { NODOAIxCard } from "@/components/vault/NODOAIxCard";
import { VaultActivityTicker } from "@/components/vault/VaultActivityTicker";
import { DepositDrawer } from "@/components/vault/DepositDrawer";
import { VaultStickyBar } from "@/components/vault/VaultStickyBar";
import { useVaultDetail } from "@/hooks/useVaultDetail";
import { useWallet } from "@/hooks/useWallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VaultSecurityInfo } from "@/components/vault/VaultSecurityInfo";
import { VaultData } from "@/types/vault";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [projectedAmount, setProjectedAmount] = useState<string>("1000");
  const [unlockProgress, setUnlockProgress] = useState<number>(0);
  const nodoaixCardRef = useRef<HTMLDivElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [activeTab, setActiveTab] = useState("strategy");
  const [customVaultData, setCustomVaultData] = useState<VaultData | null>(null);

  const { 
    vault, 
    isLoading, 
    error,
    getVaultStyles
  } = useVaultDetail(vaultId || '');

  useEffect(() => {
    if (isConnected && hasInteracted && !isDepositDrawerOpen) {
      setIsDepositDrawerOpen(true);
    }
  }, [isConnected, hasInteracted, isDepositDrawerOpen]);

  useEffect(() => {
    const handleDepositSuccess = (e: CustomEvent) => {
      if (nodoaixCardRef.current) {
        nodoaixCardRef.current.classList.add('glow-animation');
        setTimeout(() => {
          nodoaixCardRef.current?.classList.remove('glow-animation');
        }, 2000);
      }
    };
    
    const handleOpenDepositDrawer = (e: CustomEvent) => {
      if (e.detail && e.detail.vault) {
        setCustomVaultData(e.detail.vault);
        setIsDepositDrawerOpen(true);
      }
    };
    
    window.addEventListener('deposit-success', handleDepositSuccess as EventListener);
    window.addEventListener('open-deposit-drawer', handleOpenDepositDrawer as EventListener);
    
    return () => {
      window.removeEventListener('deposit-success', handleDepositSuccess as EventListener);
      window.removeEventListener('open-deposit-drawer', handleOpenDepositDrawer as EventListener);
    };
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDepositDrawerOpen) {
        setIsDepositDrawerOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDepositDrawerOpen]);

  const handleActionClick = () => {
    setHasInteracted(true);
    if (isConnected) {
      setIsDepositDrawerOpen(true);
    } else {
      const walletBtn = document.querySelector('[data-wallet-connect="true"]');
      if (walletBtn) {
        (walletBtn as HTMLElement).click();
      }
    }
  };

  const handleCloseDrawer = () => {
    setIsDepositDrawerOpen(false);
    setCustomVaultData(null);
  };

  if (isLoading) {
    return <VaultDetailSkeleton />;
  }

  if (error || !vault) {
    return <VaultDetailError />;
  }

  const styles = getVaultStyles(vault.type);

  const renderStrategyTab = () => (
    <div className="space-y-5">
      <div className="space-y-3">
        <h3 className="text-base font-medium text-[#E5E7EB]">Investment Strategy</h3>
        <p className="text-[#C9CDD3] text-sm leading-relaxed">
          {vault.strategy}
        </p>
      </div>
      <div className="space-y-3">
        <h3 className="text-base font-medium text-[#E5E7EB]">Risk Level</h3>
        <div className="flex items-center gap-4">
          <span className={`
            inline-block px-4 py-1 rounded-full text-sm font-medium
            ${vault.riskLevel === 'low' ? 'bg-emerald/30 text-emerald' : 
              vault.riskLevel === 'medium' ? 'bg-orion/30 text-orion' :
              'bg-nova/30 text-nova'}
          `}>
            {vault.riskLevel.charAt(0).toUpperCase() + vault.riskLevel.slice(1)}
          </span>
          <div className="flex-1 h-2 bg-[#293040] rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                vault.riskLevel === 'low' ? 'bg-emerald w-1/4' : 
                vault.riskLevel === 'medium' ? 'bg-orion w-1/2' : 
                'bg-red-500 w-3/4'
              }`}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <VaultSecurityInfo 
      contractAddress="0x1234567890abcdef1234567890abcdef12345678"
      isAudited={true}
      explorerUrl="https://explorer.sui.io/address/0x1234567890abcdef1234567890abcdef12345678"
      defaultOpen={true}
    />
  );

  return (
    <PageContainer>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes glow {
            0% { transform: scale(1); box-shadow: 0 0 0 rgba(245, 158, 11, 0); }
            50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(245, 158, 11, 0.6); }
            100% { transform: scale(1); box-shadow: 0 0 0 rgba(245, 158, 11, 0); }
          }
          
          .glow-animation {
            animation: glow 0.6s cubic-bezier(.22,1,.36,1);
          }
          
          @media (prefers-reduced-motion: reduce) {
            .glow-animation {
              animation: none;
            }
          }
        `
      }} />

      <VaultDetailLayout
        children={<VaultDetailHeader vaultName={vault.name} styles={styles} />}
        leftColumn={
          <>
            <VaultPerformanceSection
              vault={vault}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              styles={styles}
            />
            <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <CardHeader className="px-6 pt-6 pb-2">
                <CardTitle className="text-lg font-medium text-[#E5E7EB]">Strategy & Security</CardTitle>
                <CardDescription className="text-sm text-[#9CA3AF]">Understanding this vault's approach and protections</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-2">
                <Tabs defaultValue="strategy" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-2 mb-6 bg-white/5 rounded-lg p-1">
                    <TabsTrigger value="strategy" className="data-[state=active]:bg-[#FF8A00]/20 data-[state=active]:text-[#FF8A00]">
                      Strategy
                    </TabsTrigger>
                    <TabsTrigger value="security" className="data-[state=active]:bg-[#FF8A00]/20 data-[state=active]:text-[#FF8A00]">
                      Security
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="strategy" className="mt-0">
                    {renderStrategyTab()}
                  </TabsContent>
                  <TabsContent value="security" className="mt-0">
                    {renderSecurityTab()}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <CardHeader className="px-6 pt-6 pb-4">
                <CardTitle className="text-lg font-medium text-[#E5E7EB]">Vault Activity</CardTitle>
                <CardDescription className="text-sm text-[#9CA3AF]">Recent deposits and withdrawals</CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <VaultActivityTicker maxRows={5} />
              </CardContent>
            </Card>
          </>
        }
        rightColumn={
          <>
            <VaultMetricsCard
              vault={vault}
              styles={styles}
              projectedAmount={projectedAmount}
              onProjectedAmountChange={setProjectedAmount}
              isConnected={isConnected}
              onActionClick={handleActionClick}
            />
            <div ref={nodoaixCardRef}>
              <NODOAIxCard
                balance={1000}
                principal={1000}
                fees={12.3}
                unlockTime={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                holderCount={1203}
                contractAddress="0xAB1234567890ABCDEF1234567890ABCDEF123456"
                auditUrl="/audit.pdf"
                styles={styles}
                unlockProgress={unlockProgress}
              />
            </div>
          </>
        }
      />

      <VaultStickyBar 
        isConnected={isConnected}
        styles={styles}
        onActionClick={handleActionClick}
      />

      <DepositDrawer 
        open={isDepositDrawerOpen}
        onClose={handleCloseDrawer}
        vault={customVaultData || vault}
      />
    </PageContainer>
  );
}
