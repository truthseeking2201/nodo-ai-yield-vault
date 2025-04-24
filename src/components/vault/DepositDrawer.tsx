
import { useState, useEffect, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider"; 
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { VaultData } from "@/types/vault";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

// Optional: Import confetti if available
let ReactConfetti: any;
import("react-confetti").then(module => {
  ReactConfetti = module.default;
}).catch(err => {
  console.warn("Confetti effect not available:", err);
});

interface DepositDrawerProps {
  open: boolean;
  onClose: () => void;
  vault: VaultData;
}

export function DepositDrawer({ open, onClose, vault }: DepositDrawerProps) {
  const navigate = useNavigate();
  const { balance } = useWallet();
  const [amount, setAmount] = useState<string>("");
  const [selectedLockup, setSelectedLockup] = useState<number>(vault.lockupPeriods[0].days);
  const [step, setStep] = useState<'details' | 'confirmation' | 'success'>('details');
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);
  const [validationError, setValidationError] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [countUpValue, setCountUpValue] = useState(0);
  const [fadeRefresh, setFadeRefresh] = useState(false);
  
  // References
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const returnsCardRef = useRef<HTMLDivElement | null>(null);
  const successHeadlineRef = useRef<HTMLHeadingElement | null>(null);
  
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Initialize audio element
  useEffect(() => {
    // Only create audio if motion/sound are allowed
    if (!prefersReducedMotion) {
      audioRef.current = new Audio("/chime.mp3");
      audioRef.current.volume = 0.7;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Effect to update amount when slider changes
  useEffect(() => {
    setAmount(sliderValue[0].toString());
  }, [sliderValue]);

  // Effect to refresh estimates card with animation
  useEffect(() => {
    if (amount || selectedLockup) {
      setFadeRefresh(true);
      const timer = setTimeout(() => setFadeRefresh(false), 120);
      return () => clearTimeout(timer);
    }
  }, [amount, selectedLockup]);

  // Effect to animate count up on success
  useEffect(() => {
    if (step === 'success' && amount) {
      const targetValue = parseFloat(amount);
      let startTime: number;
      let requestId: number;

      const easeOutExpo = (t: number): number => {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      };

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / 1000, 1); // 1 second duration
        const easedProgress = easeOutExpo(progress);
        setCountUpValue(targetValue * easedProgress);
        
        if (progress < 1) {
          requestId = requestAnimationFrame(animate);
        }
      };

      // Start animation
      requestId = requestAnimationFrame(animate);
      
      // Play sound effect if allowed
      if (!prefersReducedMotion && audioRef.current) {
        audioRef.current.play().catch(err => console.warn("Audio playback failed:", err));
      }
      
      return () => {
        cancelAnimationFrame(requestId);
      };
    }
  }, [step, amount, prefersReducedMotion]);

  // Get the deposit mutation
  const depositMutation = useMutation({
    mutationFn: (params: { vaultId: string; amount: number; lockupPeriod: number }) => {
      return vaultService.deposit(params.vaultId, params.amount, params.lockupPeriod);
    },
    onSuccess: () => {
      setStep('success');
      setShowConfetti(true);
      
      // Set timeout to hide confetti after animation completes
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);

      // Dispatch custom event for certificate card glow
      window.dispatchEvent(new CustomEvent('deposit-success', { 
        detail: { 
          amount: parseFloat(amount),
          vaultId: vault.id
        } 
      }));
    },
    onError: (error) => {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Helper functions
  const getVaultStyles = (type?: 'nova' | 'orion' | 'emerald') => {
    if (!type) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: ''
    };
    
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          bgOpacity: 'bg-nova/20'
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          bgOpacity: 'bg-orion/20'
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald shadow-[0_3px_6px_-2px_rgba(16,185,129,0.4)]',
          shadow: 'hover:shadow-neon-emerald',
          bgOpacity: 'bg-emerald/20'
        };
    }
  };

  const formatPercentage = (value?: number) => {
    return value !== undefined ? `${value.toFixed(1)}%` : '-';
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
      
      // Update slider value when input changes
      if (value !== '') {
        const numVal = parseFloat(value);
        if (!isNaN(numVal)) {
          setSliderValue([Math.min(numVal, 10000)]);
        }
      } else {
        setSliderValue([0]);
      }
      
      validateAmount(value);
    }
  };

  const validateAmount = (value: string) => {
    if (!value) {
      setValidationError("");
      return;
    }
    
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      setValidationError("Min 1 USDC required");
    } else if (numVal > balance.usdc) {
      setValidationError("Exceeds wallet balance");
    } else {
      setValidationError("");
    }
  };

  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    setAmount(values[0].toString());
    validateAmount(values[0].toString());
  };

  const handleMaxClick = () => {
    setAmount(String(balance.usdc));
    setSliderValue([balance.usdc]);
    validateAmount(String(balance.usdc));
  };

  const handleReviewClick = () => {
    setStep('confirmation');
  };

  const handleConfirmDeposit = () => {
    if (!amount) return;
    
    depositMutation.mutate({
      vaultId: vault.id,
      amount: parseFloat(amount),
      lockupPeriod: selectedLockup
    });
  };

  const handleViewDashboard = () => {
    onClose();
    navigate('/dashboard');
  };

  const handleDepositAgain = () => {
    setStep('details');
    // Reset the form
    setAmount("");
    setSliderValue([1000]);
    setSelectedLockup(vault.lockupPeriods[0].days);
  };

  // Helper to get the selected lockup period object
  const getSelectedLockupPeriod = () => {
    return vault.lockupPeriods.find(period => period.days === selectedLockup) || vault.lockupPeriods[0];
  };

  // Calculate estimated returns
  const calculateEstimatedReturns = () => {
    if (!amount) return 0;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    
    // Calculate effective APR
    const lockupPeriod = getSelectedLockupPeriod();
    const boost = selectedLockup === 90 ? 0.025 : selectedLockup === 60 ? 0.012 : 0;
    const effectiveApr = vault.apr + boost;
    
    // Estimated return calculation
    return amountNum * effectiveApr * selectedLockup / 365;
  };

  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return date;
  };

  const formatUnlockDate = () => {
    const date = getUnlockDate();
    return `Unlocks in ${selectedLockup} days (${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })})`;
  };

  const returnAmount = calculateEstimatedReturns();
  const totalReturn = amount ? parseFloat(amount) + returnAmount : 0;
  const styles = getVaultStyles(vault.type);

  // Form validation
  const amountNum = parseFloat(amount || "0");
  const isAmountValid = amount !== "" && !isNaN(amountNum) && amountNum > 0 && amountNum <= balance.usdc;
  const canContinue = isAmountValid && selectedLockup > 0;

  // Calculate estimated gas fee
  const gasFeeNative = 0.006;
  const gasFeeUsd = 0.02;

  const transactionHash = "0xABCDEF1234567890ABCDEF1234567890ABCDEF12"; // Mock TX hash

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent 
        className="sm:max-w-md overflow-y-auto glass-card border-white/20"
        style={{ transitionTimingFunction: "cubic-bezier(.22,1,.36,1)", transitionDuration: "240ms" }}
      >
        <SheetHeader>
          <SheetTitle className={`text-2xl ${styles.gradientText}`}>
            Deposit to {vault.name}
          </SheetTitle>
          <SheetDescription>
            {step === 'details' && "Enter your deposit amount and select a lockup period"}
            {step === 'confirmation' && "Confirm your deposit details"}
            {step === 'success' && "Your deposit was successful!"}
          </SheetDescription>
        </SheetHeader>

        {step === 'details' && (
          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="text-[#9CA3AF]">
                  Balance: <span className="font-mono">{balance.usdc} USDC</span> <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={handleMaxClick} 
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
                  onChange={handleAmountChange}
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
                  onValueChange={handleSliderChange} 
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
                onValueChange={(value) => setSelectedLockup(parseInt(value))}
                className="space-y-2 md:space-y-2"
              >
                {vault.lockupPeriods.map((period) => {
                  // Calculate APR boost
                  const boost = period.days === 90 ? 0.025 : period.days === 60 ? 0.012 : 0;
                  const totalApr = vault.apr + boost;
                  
                  return (
                    <div key={period.days} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
                      <RadioGroupItem value={String(period.days)} id={`lockup-${period.days}`} className="border-white/30" />
                      <div className="flex flex-1 justify-between">
                        <Label htmlFor={`lockup-${period.days}`} className="cursor-pointer">
                          {period.days} days
                        </Label>
                        <div className={`${boost > 0 ? styles.gradientText : "text-white/80"} flex items-center`}>
                          <span className="font-semibold transition-all duration-300" style={{ counterReset: `apr ${totalApr * 100}` }}>
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
              ref={returnsCardRef} 
              aria-live="polite"
              className={`bg-white/5 rounded-lg p-4 border border-white/10 ${fadeRefresh ? 'opacity-0' : 'opacity-100'}`}
              style={{ transition: 'opacity 120ms ease-out' }}
            >
              <h3 className="text-sm text-[#9CA3AF] mb-3">Estimated Returns</h3>

              <div className="grid grid-cols-5 gap-y-2">
                <div className="col-span-2 text-[#9CA3AF]">APR</div>
                <div className="col-span-3 font-mono font-semibold text-right">
                  <span className={styles.gradientText}>
                    {formatPercentage(vault.apr + (getSelectedLockupPeriod().aprBoost || 0))}
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
              onClick={handleReviewClick}
              disabled={!canContinue}
              className={`w-full h-12 ${styles.gradientBg} ${styles.shadow} transition-all duration-300`}
              style={{ 
                transition: "transform 80ms cubic-bezier(.22,1,.36,1), box-shadow 300ms ease-out", 
                transform: canContinue ? "scale(1)" : "scale(1)",
              }}
            >
              Review Deposit
            </Button>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-center">Confirm Your Deposit</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Vault</span>
                  <span className={`font-medium ${styles.gradientText}`}>{vault.name}</span>
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
                  <span className={`font-mono font-medium ${styles.gradientText}`}>
                    {formatPercentage(vault.apr + getSelectedLockupPeriod().aprBoost)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Unlock Date</span>
                  <span className="font-medium">
                    {formatUnlockDate()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Gas (est.)</span>
                  <span className="font-mono">{gasFeeNative} SUI (${gasFeeUsd})</span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Est. Return</span>
                  <span className={`font-mono font-medium text-[#10B981]`}>
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
                onClick={handleConfirmDeposit}
                disabled={depositMutation.isPending}
                className={`w-full h-12 bg-[#10B981] hover:bg-[#0d9668] shadow-[0_3px_6px_-2px_rgba(16,185,129,0.4)] transition-all duration-300`}
                style={{ transition: "transform 80ms cubic-bezier(.22,1,.36,1)" }}
              >
                {depositMutation.isPending ? "Processing..." : "Confirm Deposit"}
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/5 border-[#374151] hover:bg-white/10"
                disabled={depositMutation.isPending}
                onClick={() => setStep('details')}
              >
                Back
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="mt-8 space-y-6 text-center">
            {showConfetti && ReactConfetti && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <ReactConfetti
                  width={window.innerWidth}
                  height={window.innerHeight}
                  numberOfPieces={140}
                  recycle={false}
                  colors={['#6F3BFF', '#10B981', '#F97316', '#F59E0B']}
                />
              </div>
            )}
            
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full bg-[#10B981] flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div>
              <h3 
                ref={successHeadlineRef}
                aria-live="assertive" 
                className="text-xl font-bold mb-2"
              >
                Deposit Successful!
              </h3>
              <p className="text-[#9CA3AF]">
                Your deposit of <span className="font-mono">{formatCurrency(countUpValue)}</span> to {vault.name} was successful.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Amount</span>
                  <span className="font-mono">{formatCurrency(parseFloat(amount))}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Lock-up</span>
                  <span>{selectedLockup} days</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-[#9CA3AF]">Unlock Date</span>
                  <span>
                    {getUnlockDate().toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 text-center">
                <a 
                  href={`https://explorer.sui.io/transaction/${transactionHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-[#9CA3AF] hover:text-white inline-flex items-center"
                >
                  Tx {transactionHash.substring(0, 6)}...{transactionHash.substring(transactionHash.length - 4)} ↗
                </a>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleViewDashboard}
                className="w-full h-12 bg-[#10B981] hover:bg-[#0d9668] shadow-[0_3px_6px_-2px_rgba(16,185,129,0.4)]"
              >
                View Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/5 border-[#374151] hover:bg-white/10"
                onClick={handleDepositAgain}
              >
                Deposit Again
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
