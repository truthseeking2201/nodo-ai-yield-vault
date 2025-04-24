
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
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

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Vault Metrics</CardTitle>
        <CardDescription>Current performance metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-white/60">APR</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-white/40" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    Calculated from last 7 days fees collected in pool block #123,456 – 123,999
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <span className={`font-mono text-lg font-bold ${styles.gradientText}`}>
            {formatPercentage(vault.apr)}
          </span>
        </div>

        <div className="space-y-6">
          <div className="relative pt-6 pb-2">
            <div 
              className="absolute -top-1 left-1/2 transform -translate-x-1/2 bg-background/90 text-white px-3 py-1 rounded-full text-sm shadow-md z-10 backdrop-blur-sm"
              style={{ boxShadow: '0 2px 4px -1px rgba(0,0,0,.4)' }}
            >
              {sliderLabel}
            </div>
            
            <Slider
              value={sliderValue}
              min={100}
              max={10000}
              step={50}
              className="[&_.relative]:h-[4px] [&_.absolute]:bg-[#6F3BFF] [&_button]:h-5 [&_button]:w-5"
              onValueChange={(value) => setSliderValue(value)}
            />
            
            {projectedAmount && (
              <div className="text-sm text-[#9CA3AF] mt-4">
                Est. earnings in 30 days ≈ ${calculateProjectedEarnings(projectedAmount).toFixed(2)} USDC
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-white/60">APY</span>
          <span className={`font-mono text-lg font-bold ${styles.gradientText}`}>
            {formatPercentage(vault.apy)}
          </span>
        </div>
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-white/60">TVL</span>
          <span className="font-mono text-lg font-bold">
            {formatCurrency(vault.tvl)}
          </span>
        </div>
        <div>
          <h3 className="text-sm text-white/60 mb-2">Lockup Periods</h3>
          <div className="space-y-2">
            {vault.lockupPeriods.map((period) => (
              <div key={period.days} className="flex justify-between items-center">
                <span>{period.days} days</span>
                <span className={`font-mono ${period.aprBoost > 0 ? styles.gradientText : ''}`}>
                  {period.aprBoost > 0 ? `+${period.aprBoost}%` : 'No boost'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          className={`w-full mt-6 h-12 ${styles.gradientBg} ${styles.shadow} animate-fade-in transition-transform duration-80 hover:scale-[1.02] active:scale-95`}
          onClick={onActionClick}
        >
          {isConnected ? (
            <>Deposit USDC <ArrowRight className="ml-2 h-4 w-4" /></>
          ) : (
            <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
