import { useState } from "react";
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
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { VaultData } from "@/types/vault";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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

  // Get the deposit mutation
  const depositMutation = useMutation({
    mutationFn: (params: { vaultId: string; amount: number; lockupPeriod: number }) => {
      return vaultService.deposit(params.vaultId, params.amount, params.lockupPeriod);
    },
    onSuccess: () => {
      setStep('success');
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
          gradientBg: 'gradient-bg-emerald',
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
    }
  };

  const handleMaxClick = () => {
    setAmount(String(balance.usdc));
  };

  const handleContinueClick = () => {
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

  // Helper to get the selected lockup period object
  const getSelectedLockupPeriod = () => {
    return vault.lockupPeriods.find(period => period.days === selectedLockup) || vault.lockupPeriods[0];
  };

  // Calculate estimated returns
  const calculateEstimatedReturns = () => {
    if (!amount) return 0;
    
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    
    const lockupPeriod = getSelectedLockupPeriod();
    const totalApr = vault.apr + (lockupPeriod?.aprBoost || 0);
    
    // Simple calculation for estimated returns (not compound)
    const dailyRate = totalApr / 100 / 365;
    const days = selectedLockup;
    
    return amountNum * dailyRate * days;
  };

  const returnAmount = calculateEstimatedReturns();
  const totalReturn = amount ? parseFloat(amount) + returnAmount : 0;
  const styles = getVaultStyles(vault.type);

  // Form validation
  const amountNum = parseFloat(amount || "0");
  const isAmountValid = amount !== "" && !isNaN(amountNum) && amountNum > 0 && amountNum <= balance.usdc;
  const canContinue = isAmountValid && selectedLockup > 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto glass-card border-white/20">
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
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="text-xs text-white/60">
                  Balance: <span className="font-mono">{balance.usdc} USDC</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="font-mono bg-white/5 border-white/20"
                  placeholder="0.00"
                />
                <Button type="button" variant="secondary" onClick={handleMaxClick}>
                  Max
                </Button>
              </div>
              {amount && !isAmountValid && (
                <p className="text-red-500 text-xs">
                  {amountNum > balance.usdc 
                    ? "Insufficient balance" 
                    : "Please enter a valid amount"}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <Label>Select Lock-up Period</Label>
              <RadioGroup 
                value={String(selectedLockup)} 
                onValueChange={(value) => setSelectedLockup(parseInt(value))}
                className="space-y-2"
              >
                {vault.lockupPeriods.map((period) => (
                  <div key={period.days} className="flex items-center space-x-3 bg-white/5 rounded-lg p-3 border border-white/10">
                    <RadioGroupItem value={String(period.days)} id={`lockup-${period.days}`} className="border-white/30" />
                    <div className="flex-1">
                      <Label htmlFor={`lockup-${period.days}`} className="flex justify-between cursor-pointer">
                        <span>{period.days} days</span>
                        <span className={period.aprBoost > 0 ? styles.gradientText : "text-white/80"}>
                          {period.aprBoost > 0 ? `+${period.aprBoost}% APR` : "No boost"}
                        </span>
                      </Label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm text-white/60 mb-3">Estimated Returns</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>APR</span>
                  <span className={`font-mono ${styles.gradientText}`}>
                    {formatPercentage(vault.apr + getSelectedLockupPeriod().aprBoost)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Lock-up Duration</span>
                  <span className="font-mono">{selectedLockup} days</span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span>Principal</span>
                  <span className="font-mono">
                    {formatCurrency(amountNum > 0 ? amountNum : 0)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Est. Return</span>
                  <span className={`font-mono ${styles.gradientText}`}>
                    {formatCurrency(returnAmount)}
                  </span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span>Total Value</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(totalReturn)}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleContinueClick}
              disabled={!canContinue}
              className={`w-full h-12 ${styles.gradientBg} ${styles.shadow}`}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 'confirmation' && (
          <div className="mt-8 space-y-6">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-center">Confirm Your Deposit</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Vault</span>
                  <span className={`font-medium ${styles.gradientText}`}>{vault.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Amount</span>
                  <span className="font-mono font-medium">{formatCurrency(parseFloat(amount))}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Lock-up Period</span>
                  <span className="font-medium">{selectedLockup} days</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">APR</span>
                  <span className={`font-mono font-medium ${styles.gradientText}`}>
                    {formatPercentage(vault.apr + getSelectedLockupPeriod().aprBoost)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Unlock Date</span>
                  <span className="font-medium">
                    {new Date(Date.now() + selectedLockup * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span className="text-white/60">Est. Return</span>
                  <span className={`font-mono font-medium ${styles.gradientText}`}>
                    {formatCurrency(returnAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Est. Total Value</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(totalReturn)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleConfirmDeposit}
                disabled={depositMutation.isPending}
                className={`w-full h-12 ${styles.gradientBg} ${styles.shadow}`}
              >
                {depositMutation.isPending ? "Processing..." : "Confirm Deposit"}
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/20"
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
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full ${styles.gradientBg} flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Deposit Successful!</h3>
              <p className="text-white/60">
                Your deposit of {formatCurrency(parseFloat(amount))} to {vault.name} was successful.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Amount</span>
                  <span className="font-mono">{formatCurrency(parseFloat(amount))}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Lock-up</span>
                  <span>{selectedLockup} days</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Unlock Date</span>
                  <span>
                    {new Date(Date.now() + selectedLockup * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button 
                onClick={handleViewDashboard}
                className={`w-full h-12 ${styles.gradientBg} ${styles.shadow}`}
              >
                View Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/20"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
