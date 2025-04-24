
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { VaultData } from "@/types/vault";

interface DepositDrawerDetailsProps {
  vault: VaultData;
  amount: string;
  selectedLockup: number;
  sliderValue: number[];
  validationError: string;
  fadeRefresh: boolean;
  balance: { usdc: number };
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSliderChange: (values: number[]) => void;
  onMaxClick: () => void;
  onLockupChange: (value: string) => void;
  onReviewClick: () => void;
  calculateEstimatedReturns: () => number;
}

export function DepositDrawerDetails({
  vault,
  amount,
  selectedLockup,
  sliderValue,
  validationError,
  fadeRefresh,
  balance,
  onAmountChange,
  onSliderChange,
  onMaxClick,
  onLockupChange,
  onReviewClick,
  calculateEstimatedReturns
}: DepositDrawerDetailsProps) {
  const returnAmount = calculateEstimatedReturns();
  const totalReturn = amount ? parseFloat(amount) + returnAmount : 0;
  const amountNum = parseFloat(amount || "0");
  const isAmountValid = amount !== "" && !isNaN(amountNum) && amountNum > 0 && amountNum <= balance.usdc;
  const canContinue = isAmountValid && selectedLockup > 0;
  const gasFeeNative = 0.006;
  const gasFeeUsd = 0.02;

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value?: number) => {
    return value !== undefined ? `${value.toFixed(1)}%` : '-';
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-2">
          <Label htmlFor="amount">Amount (USDC)</Label>
          <div className="text-[#9CA3AF]">
            Balance: <span className="font-mono">{balance.usdc} USDC</span>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onMaxClick} 
              className="h-6 px-2 py-0 text-xs text-[#6F3BFF] hover:bg-[#6F3BFF]/10"
            >
              Max
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={onAmountChange}
            className="font-mono border-[#374151] focus-visible:ring-1 focus-visible:ring-[#6F3BFF] focus-visible:border-[#6F3BFF] bg-white/5"
            placeholder="0.00"
          />
          {validationError && (
            <p className="text-red-500 text-xs">{validationError}</p>
          )}
          <div className="text-xs text-[#9CA3AF] mt-1">
            Gas ≈ {gasFeeNative} SUI (${gasFeeUsd})
          </div>
        </div>
        
        <div className="pt-2">
          <Label className="text-sm mb-2 block">Adjust amount</Label>
          <Slider 
            value={sliderValue} 
            onValueChange={onSliderChange} 
            min={100} 
            max={10000} 
            step={50}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-[#9CA3AF] mt-1">
            <span>$100</span>
            <span>$10,000</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Select Lock-up Period</Label>
        <RadioGroup 
          value={String(selectedLockup)} 
          onValueChange={onLockupChange}
          className="space-y-2 md:space-y-2"
        >
          {vault.lockupPeriods.map((period) => {
            const boost = period.days === 90 ? 0.025 : period.days === 60 ? 0.012 : 0;
            const totalApr = vault.apr + boost;
            
            return (
              <div key={period.days} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
                <RadioGroupItem value={String(period.days)} id={`lockup-${period.days}`} className="border-white/30" />
                <div className="flex flex-1 justify-between">
                  <Label htmlFor={`lockup-${period.days}`} className="cursor-pointer">
                    {period.days} days
                  </Label>
                  <div className={`${boost > 0 ? "gradient-text-nova" : "text-white/80"} flex items-center`}>
                    <span className="font-semibold transition-all duration-300">
                      {formatPercentage(totalApr)}
                    </span>
                    {boost > 0 && <span className="ml-1 text-xs">(+{formatPercentage(boost)})</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </RadioGroup>
      </div>

      <div 
        aria-live="polite"
        className={`bg-white/5 rounded-lg p-4 border border-white/10 ${fadeRefresh ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 120ms ease-out' }}
      >
        <h3 className="text-sm text-[#9CA3AF] mb-3">Estimated Returns</h3>

        <div className="grid grid-cols-5 gap-y-2">
          <div className="col-span-2 text-[#9CA3AF]">APR</div>
          <div className="col-span-3 font-mono font-semibold text-right">
            <span className="gradient-text-nova">
              {formatPercentage(vault.apr + (vault.lockupPeriods.find(p => p.days === selectedLockup)?.aprBoost || 0))}
            </span>
          </div>

          <div className="col-span-2 text-[#9CA3AF]">Lock-up Duration</div>
          <div className="col-span-3 font-mono text-right">{selectedLockup} days</div>

          <div className="col-span-5 border-t border-white/10 my-1"></div>

          <div className="col-span-2 text-[#9CA3AF]">Principal</div>
          <div className="col-span-3 font-mono text-right">
            {formatCurrency(amountNum > 0 ? amountNum : 0)}
          </div>

          <div className="col-span-2 text-[#9CA3AF]">Est. Return</div>
          <div className="col-span-3 font-mono text-right text-[#10B981]">
            {formatCurrency(returnAmount)}
          </div>

          <div className="col-span-5 border-t border-white/10 my-1"></div>

          <div className="col-span-2 text-[#9CA3AF]">Total Value</div>
          <div className="col-span-3 font-mono font-bold text-right">
            {formatCurrency(totalReturn)}
          </div>
        </div>
      </div>

      <Button 
        onClick={onReviewClick}
        disabled={!canContinue}
        className={`w-full h-12 gradient-bg-nova hover:shadow-neon-nova transition-all duration-300`}
        style={{ 
          transition: "transform 80ms cubic-bezier(.22,1,.36,1), box-shadow 300ms ease-out", 
          transform: canContinue ? "scale(1)" : "scale(1)",
        }}
      >
        Review Deposit
      </Button>
    </div>
  );
}
