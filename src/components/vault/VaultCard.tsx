
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
  
  const getVaultStyles = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'bg-gradient-to-r from-nova via-nova-light to-nova-dark',
          accent: 'text-nova-light',
          border: 'border-nova/20',
          riskColor: 'bg-red-500/10 text-red-500',
          riskText: 'High returns'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'bg-gradient-to-r from-orion via-orion-light to-orion-dark',
          accent: 'text-orion-light',
          border: 'border-orion/20',
          riskColor: 'bg-orion/10 text-orion',
          riskText: 'Balanced'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'bg-gradient-to-r from-emerald via-emerald-light to-emerald-dark',
          accent: 'text-emerald-light',
          border: 'border-emerald/20',
          riskColor: 'bg-emerald/10 text-emerald',
          riskText: 'Stable'
        };
    }
  };

  const styles = getVaultStyles(vault.type);
  const monthlyReturn = (vault.apr / 100 / 12) * 1000;
  const aiInsight = `${(Math.random() * 0.5).toFixed(1)}% optimization today`;

  return (
    <TooltipProvider>
      <Card 
        className={`group relative overflow-hidden rounded-[20px] border-0 bg-black/40 backdrop-blur-2xl transition-all duration-500 
          hover:scale-[1.02] hover:shadow-2xl ${isActive ? 'ring-2 ring-white/20' : ''}`}
        onMouseEnter={() => {
          onHover();
          setShowRoiOverlay(true);
        }}
        onMouseLeave={() => setShowRoiOverlay(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent opacity-0 
          transition-opacity duration-500 group-hover:opacity-100" />
        
        <div className={`h-1 ${styles.gradientBg} opacity-80`} />
        
        <CardHeader className="p-5">
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Pass the vault.id directly to PairIcon, which will handle the mapping */}
                <PairIcon tokens={vault.id} size={28} />
                <div className="absolute -bottom-1 -right-1">
                  <AIIndicator vaultType={vault.type} className="scale-75" />
                </div>
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-white">
                  {vault.name}
                </CardTitle>
                <CardDescription className="text-xs text-white/60">
                  {vault.description}
                </CardDescription>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles.riskColor}`}>
              {styles.riskText}
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-5 pt-0 space-y-4">
          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-white/60 flex items-center gap-1">
                APR
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/40 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    Annual Percentage Rate based on current vault performance
                  </TooltipContent>
                </Tooltip>
              </p>
              <p className={`text-2xl font-mono font-semibold ${isActive ? styles.gradientText : 'text-white'}`}>
                {vault.apr.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">TVL</p>
              <p className="text-2xl font-mono font-semibold text-white">
                ${(vault.tvl / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-white/60">Users</p>
              <p className="text-2xl font-mono font-semibold text-white">
                {Math.floor(vault.tvl / 25000)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Brain className={`h-3 w-3 ${styles.accent}`} />
            <span className={`${isActive ? styles.accent : 'text-white/70'}`}>
              {aiInsight}
            </span>
          </div>

          <div className="pt-2">
            <Button 
              variant={hasBalance ? "default" : "secondary"}
              className={`w-full py-6 text-sm font-medium relative overflow-hidden
                ${hasBalance ? 'bg-[#F97316] text-white hover:bg-[#F97316]/90' : 'bg-white/5 hover:bg-white/10'}`}
              asChild
            >
              <Link to={`/vaults/${vault.id}`}>
                {isConnected ? "Deposit Now" : "Connect Wallet"} 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
        
        {showRoiOverlay && (
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xl px-3 py-2 
            rounded-xl border border-white/10 text-xs font-medium animate-fade-in">
            ${monthlyReturn.toFixed(2)}/mo with $1,000
          </div>
        )}
      </Card>
    </TooltipProvider>
  );
}
