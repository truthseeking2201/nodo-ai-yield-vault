
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { toast } from "@/components/ui/use-toast";
import { UserInvestment } from "@/types/vault";

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  investment: UserInvestment;
}

export function WithdrawModal({ open, onClose, investment }: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>(investment.currentValue.toString());
  const [step, setStep] = useState<'amount' | 'confirming' | 'success'>('amount');

  // Withdrawal mutation
  const withdrawMutation = useMutation({
    mutationFn: (params: { investmentId: string; amount: number }) => {
      return vaultService.withdraw(params.investmentId, params.amount);
    },
    onSuccess: () => {
      setStep('success');
    },
    onError: (error) => {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive"
      });
    }
  });

  // Helper functions
  const getVaultStyles = (vaultId: string) => {
    if (vaultId.includes('nova')) {
      return {
        gradientText: 'gradient-text-nova',
        gradientBg: 'gradient-bg-nova',
        shadow: 'hover:shadow-neon-nova',
      };
    } else if (vaultId.includes('orion')) {
      return {
        gradientText: 'gradient-text-orion',
        gradientBg: 'gradient-bg-orion',
        shadow: 'hover:shadow-neon-orion',
      };
    } else {
      return {
        gradientText: 'gradient-text-emerald',
        gradientBg: 'gradient-bg-emerald',
        shadow: 'hover:shadow-neon-emerald',
      };
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleMaxClick = () => {
    setAmount(investment.currentValue.toString());
  };

  const handleWithdrawClick = () => {
    setStep('confirming');
  };

  const handleConfirmWithdraw = () => {
    if (!amount) return;
    
    withdrawMutation.mutate({
      investmentId: investment.vaultId,
      amount: parseFloat(amount)
    });
  };

  const styles = getVaultStyles(investment.vaultId);
  const amountNum = parseFloat(amount || "0");
  const isAmountValid = amount !== "" && !isNaN(amountNum) && amountNum > 0 && amountNum <= investment.currentValue;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className={`text-2xl ${styles.gradientText}`}>
            Withdraw from {investment.vaultId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </DialogTitle>
          <DialogDescription>
            {step === 'amount' && "Enter the amount you want to withdraw"}
            {step === 'confirming' && "Confirm your withdrawal"}
            {step === 'success' && "Your withdrawal was successful"}
          </DialogDescription>
        </DialogHeader>

        {step === 'amount' && (
          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="amount">Amount (USDC)</Label>
                <div className="text-xs text-white/60">
                  Available: <span className="font-mono">{formatCurrency(investment.currentValue)}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  className="font-mono bg-white/5 border-white/20"
                />
                <Button type="button" variant="secondary" onClick={handleMaxClick}>
                  Max
                </Button>
              </div>
              {amount && !isAmountValid && (
                <p className="text-red-500 text-xs">
                  {amountNum > investment.currentValue 
                    ? "Insufficient balance" 
                    : "Please enter a valid amount"}
                </p>
              )}
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-sm text-white/60 mb-3">Withdrawal Summary</h3>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Value</span>
                  <span className="font-mono">{formatCurrency(investment.currentValue)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Principal</span>
                  <span className="font-mono">{formatCurrency(investment.principal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Profit</span>
                  <span className={`font-mono ${investment.profit > 0 ? 'text-emerald' : 'text-red-500'}`}>
                    {investment.profit > 0 ? '+' : ''}{formatCurrency(investment.profit)}
                  </span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span>Withdraw Amount</span>
                  <span className="font-mono font-bold">
                    {formatCurrency(isAmountValid ? amountNum : 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" className="bg-white/5 border-white/20" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleWithdrawClick}
                disabled={!isAmountValid}
                className={`${styles.gradientBg} ${styles.shadow}`}
              >
                Withdraw
              </Button>
            </div>
          </div>
        )}

        {step === 'confirming' && (
          <div className="space-y-6 mt-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-xl font-semibold mb-4 text-center">Confirm Withdrawal</h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Vault</span>
                  <span className={`font-medium ${styles.gradientText}`}>
                    {investment.vaultId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Amount</span>
                  <span className="font-mono font-medium">{formatCurrency(parseFloat(amount))}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white/60">Network Fee</span>
                  <span className="font-mono">~$0.01</span>
                </div>

                <div className="border-t border-white/10 my-2"></div>

                <div className="flex justify-between">
                  <span className="text-white/60">You will receive</span>
                  <span className="font-mono font-medium">
                    {formatCurrency(parseFloat(amount) - 0.01)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                className="bg-white/5 border-white/20"
                disabled={withdrawMutation.isPending}
                onClick={() => setStep('amount')}
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmWithdraw}
                disabled={withdrawMutation.isPending}
                className={`${styles.gradientBg} ${styles.shadow}`}
              >
                {withdrawMutation.isPending ? "Processing..." : "Confirm Withdrawal"}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 mt-4 text-center">
            <div className="flex justify-center">
              <div className={`w-16 h-16 rounded-full ${styles.gradientBg} flex items-center justify-center`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-2">Withdrawal Successful!</h3>
              <p className="text-white/60">
                Your withdrawal of {formatCurrency(parseFloat(amount))} has been processed.
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-white/60">Amount</span>
                  <span className="font-mono">{formatCurrency(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Transaction ID</span>
                  <span className="font-mono text-xs">0x92...7f3a</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={onClose}
              className={`w-full ${styles.gradientBg} ${styles.shadow}`}
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
