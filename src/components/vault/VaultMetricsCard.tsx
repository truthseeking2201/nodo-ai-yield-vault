
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
  
  // Update projected amount when slider changes
  useEffect(() => {
    if (sliderValue[0]) {
      onProjectedAmountChange(sliderValue[0].toString());
      setSliderLabel(`$${sliderValue[0].toLocaleString()}`);
    }
  }, [sliderValue, onProjectedAmountChange]);
  
  // Update slider when projected amount changes externally
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

  // Get the appropriate button props based on user state
  const getButtonProps = () => {
    if (!isConnected) {
      return {
        text: "Connect Wallet",
        icon: <Wallet className="ml-2 h-4 w-4" />,
        className: "w-full h-12 border-[#6F3BFF] hover:border-[#8F63FF] hover:bg-[#6F3BFF]/10 text-[#8F63FF] text-sm font-medium transition-all hover:scale-[0.98]",
        variant: "outline" as const
      };
    } else {
      return {
        text: "Deposit Now",
        icon: <ArrowRight className="ml-2 h-4 w-4" />,
        className: `w-full h-12 ${styles.gradientBg} text-white transition-all hover:scale-[0.98] active:scale-95 shadow-[0_4px_8px_-2px_rgba(111,59,255,0.35)]`,
        variant: "default" as const
      };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Card className="glass-card rounded-[20px] overflow-hidden border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow hover:shadow-[0_0_20px_-4px_rgba(111,59,255,0.15)]">
      <div className={`h-1 ${styles.gradientBg}`} />
      <CardHeader className="px-6 pt-6 pb-2">
        <CardTitle className="text-lg font-medium text-[#E5E7EB]">Vault Metrics</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <div className="text-sm text-[#9CA3AF]">APR</div>
          <div className="text-right font-mono font-medium text-lg text-[#8F63FF]">
            {formatPercentage(vault.apr)}
          </div>
          
          <div className="text-sm text-[#9CA3AF]">APY</div>
          <div className="text-right font-mono font-medium text-lg text-[#10B981]">
            {formatPercentage(vault.apy)}
          </div>
          
          <div className="text-sm text-[#9CA3AF]">TVL</div>
          <div className="text-right font-mono font-medium text-lg text-[#C9CDD3]">
            {formatCurrency(vault.tvl)}
          </div>
        </div>

        {/* ROI Slider */}
        <div className="pt-4">
          <div className="relative pt-8 pb-4">
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-[#131417] text-white px-3 py-1 rounded-full text-sm shadow-md z-10 font-mono"
            >
              {sliderLabel}
            </div>
            
            <Slider
              value={sliderValue}
              min={100}
              max={10000}
              step={100}
              className="[&_.relative]:h-[2px] [&_.absolute]:bg-gradient-to-r [&_.absolute]:from-[#6F3BFF] [&_.absolute]:to-[#8F63FF] [&_button]:h-4 [&_button]:w-4 [&_button]:border [&_button]:border-white/40"
              onValueChange={(value) => setSliderValue(value)}
            />
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-xs text-[#9CA3AF]">Projected deposit</div>
              <div className="text-right text-sm font-mono text-[#E5E7EB]">
                ${calculateProjectedEarnings(projectedAmount).toFixed(2)}/month
              </div>
            </div>
          </div>
        </div>

        {/* Lockup Periods Table */}
        <div className="space-y-4">
          <h3 className="text-sm text-[#9CA3AF] mb-2">Lockup Periods</h3>
          <div className="space-y-3">
            {vault.lockupPeriods.map((period, index) => (
              <div 
                key={period.days} 
                className={`flex justify-between items-center py-2 ${
                  index < vault.lockupPeriods.length - 1 ? "border-b border-[#262B30]" : ""
                }`}
              >
                <span className="text-[#C9CDD3] text-sm">{period.days} days</span>
                <span className={`font-mono ${period.aprBoost > 0 ? "text-[#10B981]" : "text-[#9CA3AF]"}`}>
                  {period.aprBoost > 0 ? `+${period.aprBoost}%` : 'No boost'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <Button 
          variant={buttonProps.variant}
          className={buttonProps.className}
          onClick={onActionClick}
        >
          {buttonProps.text} {buttonProps.icon}
        </Button>

        {/* Gas & Unlock Info */}
        <div className="text-center text-xs font-mono text-[#9CA3AF]">
          Gas ≈ 0.006 SUI · Unlocks in 30 days
        </div>
      </CardContent>
    </Card>
  );
}
