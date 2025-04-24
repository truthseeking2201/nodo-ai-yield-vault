
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Info, TrendingUp, Clock, ExternalLink } from "lucide-react";
import { VaultData } from "@/types/vault";
import { TokenIcon, PairIcon } from "@/components/shared/TokenIcons";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWallet } from "@/hooks/useWallet";
import { useDepositDrawer } from "@/hooks/useDepositDrawer";

interface VaultCardProps {
  vault: VaultData;
  isConnected: boolean;
  hasBalance: boolean;
  isActive: boolean;
  onHover: () => void;
}

export function VaultCard({ 
  vault, 
  isConnected, 
  hasBalance, 
  isActive,
  onHover 
}: VaultCardProps) {
  const [showRoiOverlay, setShowRoiOverlay] = useState(false);
  const { balance } = useWallet();
  const { actions } = useDepositDrawer();
  
  const getVaultStyles = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          accent: 'text-nova',
          border: 'border-nova/30',
          riskColor: 'bg-red-500',
          riskText: 'High returns, higher volatility'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          accent: 'text-orion',
          border: 'border-orion/30',
          riskColor: 'bg-orion',
          riskText: 'Balanced returns & manageable risk'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          accent: 'text-emerald',
          border: 'border-emerald/30',
          riskColor: 'bg-emerald',
          riskText: 'Stable returns, minimal volatility'
        };
    }
  };

  const styles = getVaultStyles(vault.type);
  
  // Insights to rotate through
  const insights = [
    `🔥 ${Math.floor(Math.random() * 400) + 100} users joined this week`,
    `🚀 Trending: +${(Math.random() * 20).toFixed(1)}% deposits today`,
    `📈 APR up ${(Math.random() * 2).toFixed(1)}% since last week`
  ];
  
  // Pick a random insight
  const randomInsight = insights[Math.floor(Math.random() * insights.length)];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getButtonProps = () => {
    if (!isConnected) {
      return {
        text: "Connect & View",
        variant: "outline" as const,
        className: "w-full h-12 border-[#F59E0B]/30 hover:border-[#F59E0B]/60 text-[#F59E0B] text-sm font-medium"
      };
    } else if (isConnected && !hasBalance) {
      return {
        text: "View Details",
        variant: "outline" as const,
        className: "w-full h-12 border-white/20 hover:border-white/40 text-sm font-medium"
      };
    } else if (isConnected && hasBalance) {
      return {
        text: "Deposit Now",
        variant: "default" as const,
        className: "w-full h-12 bg-gradient-to-r from-[#F59E0B] to-[#F5B041] hover:opacity-90 text-[#0E0F11] text-sm font-medium transition-all hover:scale-[0.98] shadow-lg"
      };
    }
    return {
      text: "View Details",
      variant: "outline" as const,
      className: "w-full h-12 border-white/20 text-sm font-medium"
    };
  };

  const buttonProps = getButtonProps();

  const getTokenPair = (vaultId: string): [string, string] => {
    if (vaultId.includes('sui-usdc')) return ['SUI', 'USDC'];
    if (vaultId.includes('deep-sui')) return ['DEEP', 'SUI'];
    if (vaultId.includes('cetus-sui')) return ['CETUS', 'SUI'];
    return ['SUI', 'USDC']; // default
  };
  
  // Calculate if this is a "hot" vault (APR 20% above median)
  const isHotVault = vault.apr > 18.0;
  
  // Calculate estimated monthly return on $1000
  const monthlyReturn = (vault.apr / 100 / 12) * 1000;
  
  // Check if quick stake button should be shown
  const showQuickStake = isConnected && balance.usdc >= 100;
  
  const handleQuickStake = () => {
    if (actions?.openDepositDrawer) {
      actions.openDepositDrawer(vault, 100);
    }
  };

  const tokenPair = getTokenPair(vault.id);

  return (
    <TooltipProvider>
      <Card 
        className={`glass-card transition-all duration-300 overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] ${isActive ? styles.shadow : ''}`}
        onMouseEnter={() => {
          onHover();
          setShowRoiOverlay(true);
        }}
        onMouseLeave={() => setShowRoiOverlay(false)}
      >
        <div className={`h-1 ${styles.gradientBg}`} />
        <CardHeader className="p-5 pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {isHotVault && (
                <div className="absolute -left-1 -top-1 bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-br-lg font-medium">
                  🔥 Hot
                </div>
              )}
              <PairIcon tokens={tokenPair as [any, any]} size={24} />
              <CardTitle className="text-base sm:text-lg font-medium">
                {vault.name}
              </CardTitle>
            </div>
            <div className={`text-[11px] font-medium py-0.5 px-2.5 rounded-full ${styles.riskColor}`}>
              {styles.riskText}
            </div>
          </div>
          <CardDescription className="text-white/60 text-xs truncate mt-1">
            {vault.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-5 pt-3 space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1 h-5">
                APR
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/40 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    APR has risen 0.5% in last 24h · Gas ≈ 0.006 SUI
                  </TooltipContent>
                </Tooltip>
              </p>
              <p className="text-sm font-mono font-medium tabular-nums text-[#9b87f5]">
                {formatPercentage(vault.apr)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] h-5">APY</p>
              <p className="text-sm font-mono font-medium tabular-nums text-teal-400">
                {formatPercentage(vault.apy)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] h-5">TVL</p>
              <p className="text-sm font-mono font-medium tabular-nums text-[#8E9196]">
                {formatCurrency(vault.tvl)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-white/80">
              {randomInsight}
            </span>
          </div>

          <div className="h-px w-full bg-white/[0.06] my-2"></div>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={buttonProps.variant as "default" | "outline"} 
                    className={buttonProps.className}
                    asChild
                  >
                    <Link to={`/vaults/${vault.id}`}>
                      {buttonProps.text} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-white/60" />
                      <span className="text-xs">Unlocks in 30 days ({getUnlockDate()})</span>
                    </div>
                    <div className="text-[11px] text-white/60">
                      Gas fee: approximately 0.006 SUI
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
              
              {showQuickStake && (
                <Button
                  variant="ghost"
                  onClick={handleQuickStake}
                  className="px-2 h-12 text-white/80 hover:text-white border border-white/10 hover:bg-white/5 text-sm"
                >
                  Stake $100
                </Button>
              )}
            </div>
            
            <p className="text-xs text-center text-[#9CA3AF]">
              Gas ≈ 0.006 SUI · Unlocks in 30 days
            </p>
          </div>
        </CardContent>
        
        {/* ROI Overlay */}
        {showRoiOverlay && (
          <div className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 text-xs font-medium animate-fade-in">
            Stake $1,000 → earn ≈ ${monthlyReturn.toFixed(2)} / 30d
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
}
