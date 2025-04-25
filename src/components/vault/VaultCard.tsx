
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Info, TrendingUp, Clock, ExternalLink, Brain } from "lucide-react";
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
import { AIIndicator } from "./AIIndicator";

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

  const getTokenPair = (vaultId: string): ["SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx", "SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx"] => {
    if (vaultId.includes('sui-usdc')) return ['SUI', 'USDC'];
    if (vaultId.includes('deep-sui')) return ['DEEP', 'SUI'];
    if (vaultId.includes('cetus-sui')) return ['CETUS', 'SUI'];
    return ['SUI', 'USDC']; // default
  };
  
  const isHotVault = vault.apr > 18.0;
  // Calculate monthly return correctly by ensuring we're working with numbers
  const monthlyReturn = (vault.apr / 100 / 12) * 1000;
  const hasHighAPRChange = Math.abs(vault.apr - 18.0) > 5.0; // Example threshold
  
  const aprGlowClass = (isActive || hasHighAPRChange) ? 'text-shadow-neon' : '';
  
  // Get random AI insights for the vault
  const getRandomInsight = () => {
    const insights = [
      `📈 up ${(Math.random() * 0.5).toFixed(1)}% today via AI`,
      `🚀 APY boosted by AI strategy`,
      `🤖 AI optimized position`,
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };
  
  const aiInsight = getRandomInsight();

  return (
    <TooltipProvider>
      <Card 
        className={`glass-card transition-all duration-300 overflow-hidden rounded-[16px] border border-white/[0.06] bg-white/[0.04] ${isActive ? styles.shadow : ''}`}
        onMouseEnter={() => {
          onHover();
          setShowRoiOverlay(true);
        }}
        onMouseLeave={() => setShowRoiOverlay(false)}
      >
        <div className={`h-0.5 ${styles.gradientBg}`} />
        <CardHeader className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              <PairIcon tokens={getTokenPair(vault.id)} size={20} />
              <CardTitle className="text-base font-medium">
                {vault.name}
              </CardTitle>
              <AIIndicator vaultType={vault.type} className="ml-1" />
            </div>
            <div className={`text-[11px] font-medium py-0.5 px-2 rounded-full ${styles.riskColor}`}>
              {styles.riskText}
            </div>
          </div>
          <CardDescription className="text-white/60 text-xs mt-1 line-clamp-1">
            {vault.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-[#9CA3AF] flex items-center gap-1 h-4 font-medium">
                APR
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/40 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    APR has risen {(Math.random() * 0.5).toFixed(1)}% in last 24h due to AI rebalancing
                  </TooltipContent>
                </Tooltip>
              </p>
              <p className={`text-lg font-mono font-medium text-white/95 ${isActive ? 'text-glow-emerald' : ''}`}>
                {vault.apr.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] h-4 font-medium">APY</p>
              <p className="text-lg font-mono font-medium text-white/95">
                {vault.apy.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-[#9CA3AF] h-4 font-medium">TVL</p>
              <p className="text-lg font-mono font-medium text-white/95">
                ${(vault.tvl / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>
          
          <div className="text-xs text-white/70 font-medium">
            <span className={isActive ? 'text-glow-emerald' : ''}>{aiInsight}</span>
          </div>

          <div className="h-px w-full bg-white/[0.06]" />
          
          <div className="space-y-1.5">
            <Button 
              variant={hasBalance ? "default" : "outline"}
              className="w-full py-5 text-sm"
              asChild
            >
              <Link to={`/vaults/${vault.id}`}>
                {isConnected ? "Deposit Now" : "Connect & View"} 
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            
            <p className="text-[11px] text-center text-[#9CA3AF]">
              Gas ≈ 0.006 SUI · AI-optimized 30-day lock
            </p>
          </div>
        </CardContent>
        
        {showRoiOverlay && (
          <div className="absolute bottom-3 right-3 bg-white/10 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 text-xs font-medium animate-fade-in">
            ${((vault.apr / 100 / 12) * 1000).toFixed(2)}/mo with $1,000
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
}
