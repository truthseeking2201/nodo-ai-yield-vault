import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, Wallet } from "lucide-react";
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

        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Enter amount"
            value={projectedAmount}
            onChange={(e) => onProjectedAmountChange(e.target.value)}
            className="bg-white/5"
          />
          {projectedAmount && (
            <div className="text-sm text-white/80">
              Est. earnings in 30 days ≈ ${calculateProjectedEarnings(projectedAmount).toFixed(2)} USDC
            </div>
          )}
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
          className={`w-full mt-6 ${styles.gradientBg} ${styles.shadow} animate-fade-in`}
          onClick={onActionClick}
        >
          {isConnected ? (
            <>Deposit Now <ArrowRight className="ml-2 h-4 w-4" /></>
          ) : (
            <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
