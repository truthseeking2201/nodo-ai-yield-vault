
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import { PairIcon } from "@/components/shared/TokenIcons";
import { UserInvestment } from "@/types/vault";
import { AddFundsDrawer } from "./AddFundsDrawer";
import { Progress } from "@/components/ui/progress";

interface PositionCardProps {
  investment: UserInvestment;
  onWithdraw: (investment: UserInvestment) => void;
}

export function PositionCard({ investment, onWithdraw }: PositionCardProps) {
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  
  // Calculate days remaining for lockup
  const daysRemaining = 30 - Math.floor(Math.random() * 25); // In a real app, this would come from the investment data
  
  // Percentage earned calculation
  const earnedPercentage = (investment.profit / investment.currentValue) * 100;
  
  // Determine token pair for the vault
  const getTokenPair = (vaultId: string): ["SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx", "SUI" | "USDC" | "DEEP" | "CETUS" | "NODOAIx"] => {
    if (vaultId.includes('sui-usdc')) return ['SUI', 'USDC'];
    if (vaultId.includes('deep-sui')) return ['DEEP', 'SUI'];
    if (vaultId.includes('cetus-sui')) return ['CETUS', 'SUI'];
    return ['SUI', 'USDC']; // default
  };
  
  // Calculate unlock date
  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + daysRemaining);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };
  
  // Handle card highlight effect (e.g., after a successful deposit)
  React.useEffect(() => {
    if (isHighlighted) {
      const timer = setTimeout(() => {
        setIsHighlighted(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isHighlighted]);
  
  // Calculate APR (fallback calculation since the type doesn't have this property)
  const getEffectiveAPR = () => {
    // Since we don't have direct access to APR in the type, let's estimate it
    // based on profit, principal, and time (assuming 30 days)
    if (investment.profit > 0) {
      // Annualized return = (profit / principal) * (365 / days)
      return (investment.profit / investment.principal * 100 * 365 / 30).toFixed(1);
    }
    return "18.6"; // Fallback value
  };
  
  return (
    <Card 
      className={`overflow-hidden border border-stroke-soft transition-all duration-300 mb-4 ${
        isHighlighted ? 'shadow-neon-glow border-brand-orange-500/30' : ''
      }`}
    >
      <CardContent className="p-0">
        {/* Card Header */}
        <div className="flex justify-between items-start p-6 border-b border-stroke-soft">
          <div className="flex items-center gap-3">
            <PairIcon tokens={getTokenPair(investment.vaultId)} size={36} />
            <div>
              <h4 className="text-[18px] leading-[26px] font-semibold">{investment.vaultId}</h4>
              <p className="text-sm text-text-secondary">
                Unlocks in {daysRemaining}d
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-[28px] leading-[34px] font-mono font-semibold tabular-nums">
              ${investment.currentValue.toFixed(2)}
            </p>
            <p className={`text-sm font-mono tabular-nums ${investment.profit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
              {investment.profit >= 0 ? '+' : ''}{investment.profit.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="px-6 pt-3">
          <div className="flex justify-between items-center text-xs text-white/60 mb-1">
            <span>Principal</span>
            <span>Earned</span>
          </div>
          <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-brand-orange-500"
              style={{ width: `${100 - earnedPercentage}%` }}
            ></div>
            <div 
              className="absolute h-full right-0 bg-emerald"
              style={{ width: `${earnedPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 p-6 pb-4">
          <div>
            <p className="text-xs text-white/60 mb-1">Invested</p>
            <p className="font-mono text-base tabular-nums">${investment.principal.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Earned</p>
            <p className="font-mono text-base tabular-nums text-emerald">${investment.profit.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">APR (30d avg)</p>
            <p className="font-mono text-base tabular-nums text-brand-orange-500">{getEffectiveAPR()}%</p>
          </div>
          <div>
            <p className="text-xs text-white/60 mb-1">Unlock date</p>
            <p className="font-mono text-base tabular-nums">{getUnlockDate()}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-4 p-6 pt-2">
          <Drawer open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
            <DrawerTrigger asChild>
              <Button 
                className="flex-1 bg-gradient-neural-orange text-text-inverse font-semibold"
              >
                + Add Funds
              </Button>
            </DrawerTrigger>
            {isAddFundsOpen && (
              <AddFundsDrawer 
                investment={investment}
                onClose={() => {
                  setIsAddFundsOpen(false);
                  setIsHighlighted(true);
                }}
              />
            )}
          </Drawer>
          
          <Button 
            variant="ghost" 
            onClick={() => onWithdraw(investment)}
            className="flex-1 border border-brand-orange-500 text-brand-orange-500 hover:bg-brand-50/10"
          >
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
