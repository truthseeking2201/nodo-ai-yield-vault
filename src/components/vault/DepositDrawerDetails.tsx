import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-7">
      <div className="space-y-2">
        <div className="flex justify-between text-sm mb-2">
          <Label htmlFor="amount" className="text-xs font-medium tracking-wide text-[#9CA3AF]">Amount (USDC)</Label>
          <div className="text-[#9CA3AF] text-xs">
            Balance: <span className="font-mono text-[#E5E7EB]">{balance.usdc} USDC</span>
          </div>
        </div>
        <div className="relative">
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={onAmountChange}
            className="font-mono text-right text-[#E5E7EB] border-[#28304B] focus-visible:ring-1 focus-visible:ring-[#F59E0B] focus-visible:border-[#F59E0B] bg-[#202124] h-12 rounded-xl shadow-inner text-base pr-16"
            placeholder="$0"
          />
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onMaxClick} 
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 px-2 py-0 text-[10px] text-[#F59E0B] bg-[#F59E0B]/15 hover:bg-[#F59E0B]/20 rounded-full"
          >
            MAX
          </Button>
        </div>
        {validationError && (
          <p className="text-red-500 text-xs">{validationError}</p>
        )}
        <div className="text-xs text-[#9CA3AF] font-mono tracking-tight">
          Gas ≈ {gasFeeNative} SUI (${gasFeeUsd})
        </div>
        
        <div className="pt-3">
          <Label className="text-xs font-medium tracking-wide text-[#9CA3AF] mb-2 block">Adjust amount</Label>
          <Slider 
            value={sliderValue} 
            onValueChange={onSliderChange} 
            min={100} 
            max={10000} 
            step={50}
            className="mt-4"
          />
          <div className="flex justify-between text-[11px] font-mono text-[#9CA3AF] mt-2">
            <span>$100</span>
            <span>$10,000</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-xs font-medium tracking-wide text-[#9CA3AF]">Select Lock-up Period</Label>
        <div className="grid grid-cols-3 gap-2">
          {vault.lockupPeriods.map((period) => {
            const boost = period.aprBoost || 0;
            const totalApr = vault.apr + boost;
            const isSelected = period.days === selectedLockup;
            
            return (
              <button
                key={period.days}
                onClick={() => onLockupChange(String(period.days))}
                className={`h-11 rounded-xl flex flex-col justify-center items-center transition-all ${
                  isSelected 
                    ? 'bg-[#F59E0B]/15 border border-[#F59E0B]/30' 
                    : 'bg-[#202124] border border-transparent hover:border-white/10'
                }`}
              >
                <span className="font-medium text-xs">{period.days} days</span>
                <span className={`font-mono text-xs ${boost > 0 ? 'text-[#10B981]' : 'text-white/80'}`}>
                  {formatPercentage(totalApr)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div 
        aria-live="polite"
        className={`bg-white/[0.02] rounded-[20px] p-5 border border-white/[0.06] ${fadeRefresh ? 'opacity-0' : 'opacity-100'}`}
        style={{ transition: 'opacity 120ms ease-out' }}
      >
        <h3 className="text-sm font-medium text-[#E5E7EB] mb-3">Estimated Returns</h3>
        <div className="h-px bg-white/[0.06] mb-3"></div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="text-xs text-[#9CA3AF]">APR</div>
            <div className="font-mono text-[#F59E0B]">
              {formatPercentage(vault.apr + (vault.lockupPeriods.find(p => p.days === selectedLockup)?.aprBoost || 0))}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-xs text-[#9CA3AF]">Lock-up Duration</div>
            <div className="font-mono text-[#E5E7EB]">{selectedLockup} days</div>
          </div>

          <div className="flex justify-between">
            <div className="text-xs text-[#9CA3AF]">Principal</div>
            <div className="font-mono text-[#E5E7EB]">
              {formatCurrency(amountNum > 0 ? amountNum : 0)}
            </div>
          </div>

          <div className="flex justify-between">
            <div className="text-xs text-[#9CA3AF]">Est. Return</div>
            <div className="font-mono text-[#10B981]">
              {formatCurrency(returnAmount)}
            </div>
          </div>

          <div className="h-px bg-white/[0.06] my-2"></div>

          <div className="flex justify-between">
            <div className="text-xs text-[#9CA3AF]">Total Value</div>
            <div className="font-mono font-semibold text-[#E5E7EB]">
              {formatCurrency(totalReturn)}
            </div>
          </div>
        </div>
      </div>

      <Button 
        onClick={onReviewClick}
        disabled={!canContinue}
        className={`w-full h-[52px] rounded-xl font-mono text-sm text-white bg-gradient-to-r from-[#FF8800] to-[#FFA822] hover:shadow-[0_4px_12px_-2px_rgba(255,136,0,0.4)] transition-all duration-300 ${
          canContinue ? 'opacity-100' : 'opacity-70 cursor-not-allowed bg-[#1F2937] text-[#6B7280]'
        }`}
        style={{ transition: "transform 80ms cubic-bezier(.22,1,.36,1), box-shadow 300ms ease-out" }}
      >
        Review Deposit
      </Button>
    </div>
  );
}
