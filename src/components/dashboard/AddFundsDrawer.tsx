
import { useState, useEffect, useRef } from "react";
import { UserInvestment } from "@/types/vault";
import { DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, X, Check, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "sonner";
import ReactConfetti from 'react-confetti';

type AddFundsStage = "input" | "review" | "processing" | "success";

interface AddFundsDrawerProps {
  investment: UserInvestment;
  onClose: () => void;
}

export function AddFundsDrawer({ investment, onClose }: AddFundsDrawerProps) {
  const [stage, setStage] = useState<AddFundsStage>("input");
  const [amount, setAmount] = useState<number>(50);
  const [error, setError] = useState<string | null>(null);
  const { balance } = useWallet();
  
  // Simulate wallet balance
  const walletBalance = 1200;
  const minDeposit = 50;
  
  // Gas fee estimation
  const estimatedGas = 0.006;
  const estimatedGasFiat = 0.02;
  
  // Reset error when amount changes
  useEffect(() => {
    if (error) setError(null);
  }, [amount]);
  
  const handleAmountChange = (value: number) => {
    setAmount(value);
  };
  
  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
  };
  
  const handleReviewClick = () => {
    if (amount > walletBalance) {
      setError("Insufficient balance");
      return;
    }
    
    if (amount < minDeposit) {
      setError(`Minimum deposit is $${minDeposit}`);
      return;
    }
    
    setStage("review");
  };
  
  const handleProcessDeposit = () => {
    setStage("processing");
    
    // Simulate transaction processing
    setTimeout(() => {
      // 95% success rate for demo
      const success = Math.random() > 0.05;
      
      if (success) {
        setStage("success");
        // Show confetti if user hasn't opted out of animations
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          const confettiInstance = ReactConfetti({
            numberOfPieces: 100,
            spread: 70,
            origin: { y: 0.3 },
            colors: ['#FF8A00', '#FF5E00', '#FFFFFF']
          });
          
          // Clean up confetti after 2 seconds
          setTimeout(() => {
            if (confettiInstance && typeof confettiInstance === 'object' && 'reset' in confettiInstance) {
              (confettiInstance as any).reset();
            }
          }, 2000);
        }
        
        toast.success("Successfully added funds", {
          description: `$${amount.toFixed(2)} added to ${investment.vaultId}`
        });
      } else {
        setStage("input");
        toast.error("Transaction failed", {
          description: "Please try again or contact support if the issue persists"
        });
      }
    }, 2000);
  };
  
  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };
  
  return (
    <DrawerContent className="rounded-l-[24px] overflow-hidden">
      <div className="absolute right-4 top-4">
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <DrawerHeader className="p-6">
        <DrawerTitle className="text-xl font-semibold">
          {stage === "input" && "Add Funds"}
          {stage === "review" && "Review Deposit"}
          {stage === "processing" && "Processing"}
          {stage === "success" && "Deposit Successful"}
        </DrawerTitle>
        
        <p className="text-sm text-white/60 mt-1">
          {stage === "input" && `${investment.vaultId} Vault`}
          {stage === "review" && "Please review your deposit details"}
          {stage === "processing" && "Waiting for confirmation"}
          {stage === "success" && "Funds have been added to your position"}
        </p>
      </DrawerHeader>

      <div className="px-6 pb-6 flex-1">
        {/* Input Stage */}
        {stage === "input" && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="amount" className="text-sm font-medium text-white/70">Amount</label>
                <span className="text-xs text-white/50">
                  Balance: ${walletBalance.toFixed(2)}
                </span>
              </div>
              
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-white/70">$</span>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => handleAmountChange(parseFloat(e.target.value) || 0)}
                  className="pl-7 bg-white/5 border-white/10 text-lg font-mono"
                  min={0}
                  max={walletBalance}
                />
                {error && (
                  <p className="text-red-500 text-xs mt-1">{error}</p>
                )}
              </div>
              
              <div className="pt-2">
                <Slider 
                  defaultValue={[amount]} 
                  max={walletBalance}
                  min={0}
                  step={10}
                  onValueChange={handleSliderChange}
                  className="mt-2"
                />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white/50">$0</span>
                  <span className="text-xs text-white/50">${walletBalance}</span>
                </div>
              </div>
              
              <p className="text-xs text-white/50 flex items-center gap-1">
                Gas fee: ~{estimatedGas} SUI (${estimatedGasFiat})
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Investment Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Current APR</span>
                  <span className="text-sm font-mono text-brand-orange-500">{investment.profit > 0 ? (investment.profit / investment.principal * 100 * 365 / 30).toFixed(1) : "18.7"}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-white/60">Unlock date</span>
                  <span className="text-sm font-mono">{getUnlockDate()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Review Stage */}
        {stage === "review" && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70">Amount</span>
                <span className="text-xl font-mono font-semibold">${amount.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70">Vault</span>
                <span className="text-base">{investment.vaultId}</span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70">APR</span>
                <span className="text-base font-mono text-brand-orange-500">{investment.profit > 0 ? (investment.profit / investment.principal * 100 * 365 / 30).toFixed(1) : "18.7"}%</span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70">Unlock Date</span>
                <span className="text-base font-mono">{getUnlockDate()}</span>
              </div>
              
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-white/70">Gas Fee</span>
                <span className="text-xs text-white/60">~{estimatedGas} SUI (${estimatedGasFiat})</span>
              </div>
              
              <div className="pt-2 mt-2 border-t border-white/10">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium">Total</span>
                  <span className="text-xl font-mono font-semibold">${amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setStage("input")} 
              className="text-sm flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" /> Change amount
            </Button>
          </div>
        )}
        
        {/* Processing Stage */}
        {stage === "processing" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="mb-4">
              <Loader2 className="h-12 w-12 animate-spin text-brand-orange-500" />
            </div>
            <p className="text-lg">Waiting for wallet confirmation...</p>
            <p className="text-sm text-white/60 mt-2">
              Please confirm the transaction in your wallet
            </p>
          </div>
        )}
        
        {/* Success Stage */}
        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="h-16 w-16 rounded-full bg-state-success flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-text-inverse" />
            </div>
            <p className="text-xl font-medium mb-1">Funds Added!</p>
            <p className="text-base text-white/60 mb-8">
              ${amount.toFixed(2)} has been added to your position
            </p>
            <div className="bg-white/5 rounded-lg p-4 space-y-2 w-full max-w-xs">
              <div className="flex justify-between">
                <span className="text-sm text-white/70">New Position</span>
                <span className="text-base font-mono">${(investment.currentValue + amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-white/70">APR</span>
                <span className="text-base font-mono text-brand-orange-500">{investment.profit > 0 ? (investment.profit / investment.principal * 100 * 365 / 30).toFixed(1) : "18.7"}%</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <DrawerFooter className="p-6 pt-0">
        {stage === "input" && (
          <Button 
            onClick={handleReviewClick}
            className="w-full h-[52px] rounded-[14px] bg-gradient-neural-orange text-text-inverse font-semibold"
            disabled={amount <= 0 || !!error}
          >
            Review Deposit
          </Button>
        )}
        
        {stage === "review" && (
          <Button
            onClick={handleProcessDeposit}
            className="w-full h-[52px] rounded-[14px] bg-gradient-neural-orange text-text-inverse font-semibold"
          >
            Confirm Deposit
          </Button>
        )}
        
        {stage === "processing" && (
          <Button
            disabled
            className="w-full h-[52px] rounded-[14px] bg-gradient-neural-orange text-text-inverse font-semibold opacity-70"
          >
            Processing...
          </Button>
        )}
        
        {stage === "success" && (
          <Button
            onClick={onClose}
            className="w-full h-[52px] rounded-[14px] bg-gradient-neural-orange text-text-inverse font-semibold"
          >
            View Position
          </Button>
        )}
      </DrawerFooter>
    </DrawerContent>
  );
}
