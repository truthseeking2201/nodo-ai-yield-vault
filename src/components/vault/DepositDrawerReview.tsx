
import React from "react";
import { Button } from "@/components/ui/button";
import { VaultData } from "@/types/vault";

interface DepositDrawerReviewProps {
  vault: VaultData;
  amount: string;
  selectedLockup: number;
  returnAmount: number;
  totalReturn: number;
  isPending: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function DepositDrawerReview({
  vault,
  amount,
  selectedLockup,
  returnAmount,
  totalReturn,
  isPending,
  onConfirm,
  onBack
}: DepositDrawerReviewProps) {
  const gasFeeNative = 0.006;
  const gasFeeUsd = 0.02;
  const formatUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return `Unlocks in ${selectedLockup} days (${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`;
  };

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
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h3 className="text-xl font-semibold mb-4 text-center">Confirm Your Deposit</h3>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Vault</span>
            <span className="font-medium gradient-text-nova">{vault.name}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Amount</span>
            <span className="font-mono font-medium">{formatCurrency(parseFloat(amount))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Lock-up Period</span>
            <span className="font-medium">{selectedLockup} days</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">APR</span>
            <span className="font-mono font-medium gradient-text-nova">
              {formatPercentage(vault.apr + (vault.lockupPeriods.find(p => p.days === selectedLockup)?.aprBoost || 0))}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Unlock Date</span>
            <span className="font-medium">{formatUnlockDate()}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Gas (est.)</span>
            <span className="font-mono">{gasFeeNative} SUI (${gasFeeUsd})</span>
          </div>

          <div className="border-t border-white/10 my-2"></div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Est. Return</span>
            <span className="font-mono font-medium text-[#10B981]">
              {formatCurrency(returnAmount)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-[#9CA3AF]">Est. Total Value</span>
            <span className="font-mono font-medium">
              {formatCurrency(totalReturn)}
            </span>
          </div>
        </div>
        
        <p className="text-[11px] text-[#6B7280] mt-3">
          APR may vary with pool fees.
        </p>
      </div>

      <div className="flex flex-col space-y-3">
        <Button 
          onClick={onConfirm}
          disabled={isPending}
          className="w-full h-12 bg-[#10B981] hover:bg-[#0d9668] shadow-[0_3px_6px_-2px_rgba(16,185,129,0.4)] transition-all duration-300"
          style={{ transition: "transform 80ms cubic-bezier(.22,1,.36,1)" }}
        >
          {isPending ? "Processing..." : "Confirm Deposit"}
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-white/5 border-[#374151] hover:bg-white/10"
          disabled={isPending}
          onClick={onBack}
        >
          Back
        </Button>
      </div>
    </div>
  );
}
