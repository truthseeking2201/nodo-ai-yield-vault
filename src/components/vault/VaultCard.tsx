
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Info, TrendingUp, Clock, ExternalLink, Star, MoreVertical } from "lucide-react";
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
  
  // Calculate time remaining for boost (if applicable)
  const hasBoost = vault.apr > 18.0;
  const boostEndsIn = "02:00"; // This would be dynamic in production
  
  const getRiskIcon = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return <span className="text-state-error text-[14px]">🔴</span>;
      case 'orion':
        return <span className="text-state-warning text-[14px]">🟠</span>;
      case 'emerald': 
        return <span className="text-state-success text-[14px]">🟢</span>;
      default:
        return null;
    }
  };
  
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

  const isFeatured = vault.apr > 20.0;
  const monthlyReturn = (vault.apr / 100 / 12) * 1000;
  const hasHighAPRChange = Math.abs(vault.apr - 18.0) > 5.0;
  
  const aprGlowClass = (isActive || hasHighAPRChange) ? 'text-shadow-neon' : '';
  const getTokenPair = (vaultId: string): ["SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx", "SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx"] => {
    if (vaultId.includes('sui-usdc')) return ['SUI', 'USDC'];
    if (vaultId.includes('deep-sui')) return ['DEEP', 'SUI'];
    if (vaultId.includes('cetus-sui')) return ['CETUS', 'SUI'];
    return ['SUI', 'USDC']; // default
  };

  return (
    <TooltipProvider>
      <Card 
        className="vault-card transition-all duration-200 overflow-hidden rounded-[20px] bg-nodo-glass border border-stroke-soft p-6"
        onMouseEnter={() => {
          onHover();
          setShowRoiOverlay(true);
        }}
        onMouseLeave={() => setShowRoiOverlay(false)}
      >
        <CardHeader className="p-0 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              {isFeatured && (
                <div className="absolute -top-1 -left-1">
                  <Star className="h-5 w-5 text-brand-orange-500 fill-brand-orange-500" />
                </div>
              )}
              <PairIcon tokens={getTokenPair(vault.id)} size={24} />
              <div>
                <CardTitle className="text-base sm:text-[18px] leading-[26px] font-semibold">
                  {vault.name}
                </CardTitle>
                <div className="flex items-center mt-1 gap-1.5">
                  {getRiskIcon(vault.type)}
                  <span className="text-text-secondary text-xs font-normal">
                    {vault.type === 'emerald' ? 'Low risk' : vault.type === 'orion' ? 'Moderate risk' : 'High risk'}
                  </span>
                </div>
              </div>
            </div>
            <button className="text-text-secondary hover:text-text-primary transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
          <CardDescription className="text-text-secondary text-xs mt-2 truncate">
            {vault.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-[12px] text-text-secondary flex items-center gap-1 h-5 font-medium">
                APR
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-text-tertiary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    APR has risen 0.5% in last 24h · Gas ≈ 0.006 SUI
                  </TooltipContent>
                </Tooltip>
              </p>
              <p className={`text-num-s font-mono font-semibold tabular-nums ${aprGlowClass}`}>
                {formatPercentage(vault.apr)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-text-secondary h-5 font-medium">APY</p>
              <p className="text-num-s font-mono font-semibold tabular-nums">
                {formatPercentage(vault.apy)}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-text-secondary h-5 font-medium">TVL</p>
              <p className="text-num-s font-mono font-semibold tabular-nums">
                {formatCurrency(vault.tvl)}
              </p>
            </div>
          </div>
          
          {hasBoost && (
            <div className="flex items-center gap-1 text-brand-orange-500">
              <span className="text-[13px] font-mono">⚡ +0.5% boost · ends in {boostEndsIn}</span>
            </div>
          )}

          <div className="pt-2">
            <Button 
              className="w-full h-[52px] rounded-[14px] bg-gradient-neural-orange text-text-inverse font-semibold hover:shadow-neon-glow transition-all"
              asChild
            >
              <Link to={`/vaults/${vault.id}`}>
                Deposit Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <p className="text-xs text-center text-text-secondary mt-2">
              Gas ≈ 0.006 SUI · Unlocks in 30 days
            </p>
          </div>
        </CardContent>
        
        {showRoiOverlay && (
          <div className="absolute bottom-3 right-3 bg-nodo-glass backdrop-blur-md p-2 rounded-lg border border-stroke-soft text-xs font-medium animate-fade-in">
            Stake $1,000 → earn ≈ ${monthlyReturn.toFixed(2)} / 30d
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
}
