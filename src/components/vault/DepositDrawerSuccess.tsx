import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReactConfetti from "react-confetti";

interface DepositDrawerSuccessProps {
  vault: { name: string };
  amount: string;
  selectedLockup: number;
  showConfetti: boolean;
  countUpValue: number;
  onViewDashboard: () => void;
  onDepositAgain: () => void;
}

export function DepositDrawerSuccess({
  vault,
  amount,
  selectedLockup,
  showConfetti,
  countUpValue,
  onViewDashboard,
  onDepositAgain
}: DepositDrawerSuccessProps) {
  const [isConfettiRunning, setIsConfettiRunning] = useState(showConfetti);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (showConfetti) {
      timeoutId = setTimeout(() => {
        setIsConfettiRunning(false);
      }, 30000); // 30 seconds
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showConfetti]);

  const transactionHash = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12";

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-7 text-center">
      {isConfettiRunning && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <ReactConfetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={140}
            recycle={false}
            colors={['#FF8800', '#10B981', '#F97316', '#F59E0B']}
            run={isConfettiRunning}
          />
        </div>
      )}
      
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>

      <div>
        <h3 
          ref={(el) => {
            if (el) el.setAttribute('aria-live', 'assertive');
          }}
          className="text-xl font-bold mb-2"
        >
          Deposit Successful!
        </h3>
        <p className="text-[#9CA3AF]">
          Your deposit of <span className="font-mono animate-count-up">{formatCurrency(countUpValue)}</span> to {vault.name} was successful.
        </p>
      </div>

      <div className="bg-white/[0.02] rounded-[20px] p-5 border border-white/[0.06] text-left">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Amount</span>
            <span className="font-mono text-sm">{formatCurrency(parseFloat(amount))}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Lock-up</span>
            <span className="font-mono text-sm">{selectedLockup} days</span>
          </div>

          <div className="flex justify-between">
            <span className="text-xs text-[#9CA3AF]">Unlock Date</span>
            <span className="font-mono text-sm">{getUnlockDate()}</span>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <a 
            href={`https://explorer.sui.io/transaction/${transactionHash}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs text-[#9CA3AF] hover:text-[#F59E0B] inline-flex items-center transition-colors"
          >
            Tx {transactionHash.substring(0, 6)}...{transactionHash.substring(transactionHash.length - 4)} ↗
          </a>
        </div>
      </div>

      <div className="flex flex-col space-y-3">
        <Button 
          onClick={onViewDashboard}
          className="w-full h-12 bg-[#10B981] hover:bg-[#0d9668] shadow-[0_3px_6px_-2px_rgba(16,185,129,0.4)] rounded-xl"
        >
          View Dashboard
        </Button>
        
        <Button 
          variant="outline" 
          className="bg-white/5 border-[#374151] hover:bg-white/10 rounded-xl"
          onClick={onDepositAgain}
        >
          Deposit Again
        </Button>
      </div>
    </div>
  );
}
