
import { useState, useEffect, useRef } from "react";
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
import { VaultActivitySection } from "@/components/vault/VaultActivitySection";
import { useWallet } from "@/hooks/useWallet";
import { useVaultDetail } from "@/hooks/useVaultDetail";
import { ArrowLeft } from "lucide-react";

export default function VaultDetail() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const navigate = useNavigate();
  const { isConnected } = useWallet();
  const [isDepositDrawerOpen, setIsDepositDrawerOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("daily");
  const [projectedAmount, setProjectedAmount] = useState<string>("1000");
  const [unlockProgress, setUnlockProgress] = useState<number>(0);
  const nodoaixCardRef = useRef<HTMLDivElement>(null);

  const { 
    vault, 
    isLoading, 
    error,
    getVaultStyles
  } = useVaultDetail(vaultId || '');

  const [hasInteracted, setHasInteracted] = useState(false);
  
  useEffect(() => {
    if (isConnected && hasInteracted && !isDepositDrawerOpen) {
      setIsDepositDrawerOpen(true);
    }
  }, [isConnected, hasInteracted, isDepositDrawerOpen]);
  
  useEffect(() => {
    const securityCollapsed = localStorage.getItem("securityCollapsed");
  }, []);
  
  useEffect(() => {
    const handleDepositSuccess = (e: CustomEvent) => {
      if (nodoaixCardRef.current) {
        nodoaixCardRef.current.classList.add('glow-animation');
        setTimeout(() => {
          nodoaixCardRef.current?.classList.remove('glow-animation');
        }, 2000);
      }
    };
    
    window.addEventListener('deposit-success', handleDepositSuccess as EventListener);
    
    return () => {
      window.removeEventListener('deposit-success', handleDepositSuccess as EventListener);
    };
  }, []);

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

  if (isLoading) {
    return (
      <PageContainer>
        <div className="space-y-8">
          <div className="h-16 bg-white/10 rounded-lg animate-shimmer w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="h-[260px] bg-white/10 rounded-[20px] animate-shimmer"></div>
              <div className="h-64 bg-white/10 rounded-[20px] animate-shimmer"></div>
            </div>
            <div className="lg:col-span-4 space-y-6">
              <div className="h-64 bg-white/10 rounded-[20px] animate-shimmer"></div>
              <div className="h-[420px] bg-white/10 rounded-[20px] animate-shimmer"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (error || !vault) {
    return (
      <PageContainer>
        <Card className="glass-card p-8 text-center rounded-[20px]">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error Loading Vault</h2>
          <p className="text-[#9CA3AF] mb-6">
            We couldn't load the vault information. Please try again later.
          </p>
          <Button onClick={() => navigate('/')}>Return to Vault Catalog</Button>
        </Card>
      </PageContainer>
    );
  }

  const styles = getVaultStyles(vault.type);

  return (
    <PageContainer>
      <div className="mb-10 mt-10">
        <Button 
          variant="ghost" 
          className="mb-4 rounded-xl flex items-center gap-2 text-[#C9CDD3] hover:text-white" 
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Vaults
        </Button>
        <h1 className={`text-3xl md:text-4xl font-bold ${styles.gradientText}`}>
          {vault.name} Vault
        </h1>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes glow {
          0% { transform: scale(1); box-shadow: 0 0 0 rgba(111, 59, 255, 0); }
          50% { transform: scale(1.02); box-shadow: 0 0 20px rgba(111, 59, 255, 0.6); }
          100% { transform: scale(1); box-shadow: 0 0 0 rgba(111, 59, 255, 0); }
        }
        
        .glow-animation {
          animation: glow 0.6s cubic-bezier(.22,1,.36,1);
        }
        
        @media (prefers-reduced-motion: reduce) {
          .glow-animation {
            animation: none;
          }
        }
        
        .animate-shimmer {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 400% 400%;
          animation: shimmer 1.4s ease infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `
      }} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <VaultPerformanceSection
            vault={vault}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            styles={styles}
          />

          <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="text-lg font-medium text-[#E5E7EB]">Strategy & Risk Profile</CardTitle>
              <CardDescription className="text-sm text-[#9CA3AF]">Understanding this vault's investment approach</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-5">
              <VaultSecurityInfo 
                contractAddress="0x1234567890abcdef1234567890abcdef12345678"
                isAudited={true}
                explorerUrl="https://explorer.sui.io/address/0x1234567890abcdef1234567890abcdef12345678"
                defaultOpen={localStorage.getItem("securityCollapsed") !== "true"}
              />
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
            </CardContent>
          </Card>

          <VaultActivitySection />
        </div>

        <div className="lg:col-span-4 space-y-6">
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
