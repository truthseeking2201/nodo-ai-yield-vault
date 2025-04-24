
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, Wallet } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VaultData } from "@/types/vault";

interface VaultMetricsCardProps {
  vault: VaultData;
  styles: {
    gradientText: string;
    gradientBg: string;
    shadow: string;
  };
  projectedAmount: string;
  onProjectedAmountChange: (value: string) => void;
  isConnected: boolean;
  onActionClick: () => void;
}

export function VaultMetricsCard({ 
  vault, 
  styles, 
  projectedAmount, 
  onProjectedAmountChange,
  isConnected,
  onActionClick
}: VaultMetricsCardProps) {
  const [sliderValue, setSliderValue] = useState<number[]>([projectedAmount ? parseInt(projectedAmount) : 1000]);
  const [sliderLabel, setSliderLabel] = useState<string>('');
  
  useEffect(() => {
    if (sliderValue[0]) {
      onProjectedAmountChange(sliderValue[0].toString());
      setSliderLabel(`$${sliderValue[0].toLocaleString()}`);
    }
  }, [sliderValue, onProjectedAmountChange]);
  
  useEffect(() => {
    const value = projectedAmount ? parseInt(projectedAmount) : 1000;
    setSliderValue([value]);
    setSliderLabel(`$${value.toLocaleString()}`);
  }, [projectedAmount]);

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

  const calculateProjectedEarnings = (amount: string) => {
    if (!amount || !vault) return 0;
    const principal = parseFloat(amount);
    if (isNaN(principal)) return 0;
    return (principal * vault.apr / 100) / 12;
  };

  const getButtonProps = () => {
    if (!isConnected) {
      return {
        text: "Connect Wallet",
        icon: <Wallet className="ml-2 h-4 w-4" />,
        className: "w-full h-12 border-[#F59E0B] hover:border-[#F5B041] hover:bg-[#F59E0B]/10 text-[#F5B041] text-base font-medium transition-all hover:scale-[0.98]",
        variant: "outline" as const
      };
    } else {
      return {
        text: "Deposit Now",
        icon: <ArrowRight className="ml-2 h-4 w-4" />,
        className: `w-full h-12 ${styles.gradientBg} text-[#0E0F11] transition-all hover:scale-[0.98] active:scale-95 shadow-[0_4px_8px_-2px_rgba(245,158,11,0.35)] text-base font-semibold`,
        variant: "default" as const
      };
    }
  };

  const buttonProps = getButtonProps();
  
  const hasHighAPR = vault.apr > 20.0;
  const aprGlowClass = hasHighAPR ? 'text-shadow-neon' : '';

  return (
    <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow hover:shadow-[0_0_20px_-4px_rgba(111,59,255,0.15)]">
      <div className={`h-1 ${styles.gradientBg}`} />
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-lg font-medium text-[#E5E7EB]">Vault Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <div className="text-[13px] text-[#9CA3AF] font-medium mb-1.5">APR</div>
            <div className={`font-mono font-semibold text-[32px] text-white tabular-nums ${aprGlowClass}`}>
              {formatPercentage(vault.apr)}
            </div>
          </div>
          
          <div>
            <div className="text-[13px] text-[#9CA3AF] font-medium mb-1.5">APY</div>
            <div className="font-mono font-semibold text-[32px] text-white tabular-nums">
              {formatPercentage(vault.apy)}
            </div>
          </div>
          
          <div>
            <div className="text-[13px] text-[#9CA3AF] font-medium mb-1.5">TVL</div>
            <div className="font-mono font-semibold text-[32px] text-white tabular-nums">
              {formatCurrency(vault.tvl)}
            </div>
          </div>
          
          <div>
            <div className="text-[13px] text-[#9CA3AF] font-medium mb-1.5">Active LPs</div>
            <div className="font-mono font-semibold text-[32px] text-white tabular-nums">
              {(Math.floor(vault.tvl / 2450)).toLocaleString()}
            </div>
          </div>
        </div>

        <div className="pt-4">
          <div className="relative pt-10 pb-6">
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-[#131417] text-white px-4 py-1.5 rounded-full text-sm shadow-md z-10 font-mono border border-white/10"
            >
              {sliderLabel}
            </div>
            
            <Slider
              value={sliderValue}
              min={100}
              max={10000}
              step={100}
              className="[&_.relative]:h-[3px] [&_.absolute]:bg-gradient-to-r [&_.absolute]:from-[#FF8A00] [&_.absolute]:to-[#AE34FF] [&_button]:h-5 [&_button]:w-5 [&_button]:border [&_button]:border-white/40"
              onValueChange={(value) => setSliderValue(value)}
            />
            
            <div className="flex justify-between items-center mt-4 text-center bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="text-[13px] text-[#9CA3AF] font-medium">Monthly Earnings</div>
              <div className="text-right text-lg font-mono font-semibold text-white/95">
                ${calculateProjectedEarnings(projectedAmount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[13px] text-[#9CA3AF] font-medium mb-2">Lockup Periods</h3>
          <div className="grid grid-cols-3 gap-3">
            {vault.lockupPeriods.map((period) => (
              <button 
                key={period.days} 
                className={`
                  flex flex-col items-center justify-center py-3 px-2 rounded-xl 
                  border border-white/10 transition-all hover:border-white/20
                  ${period.aprBoost > 0 ? 'bg-white/5' : 'bg-white/2'}
                `}
              >
                <span className={`text-base font-medium ${
                  period.aprBoost > 0 ? 'text-white' : 'text-[#C9CDD3]'
                }`}>
                  {period.days} days
                </span>
                <span className={`text-xs font-mono mt-1 ${period.aprBoost > 0 ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`}>
                  {period.aprBoost > 0 ? `+${period.aprBoost}%` : 'No boost'}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Button 
          variant={buttonProps.variant}
          className={buttonProps.className}
          onClick={onActionClick}
        >
          {buttonProps.text} {buttonProps.icon}
        </Button>

        <div className="text-center text-xs font-mono text-[#9CA3AF]">
          Gas ≈ 0.006 SUI · Unlocks in 30 days
        </div>
      </CardContent>
    </Card>
  );
}
