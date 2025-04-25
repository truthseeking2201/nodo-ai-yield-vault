
import { VaultData } from "@/types/vault";

export const useDepositCalculations = (vault?: VaultData) => {
  const calculateEstimatedReturns = (amount: string, selectedLockup: number) => {
    if (!amount || !vault) return 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    const boost = selectedLockup === 90 ? 0.025 : selectedLockup === 60 ? 0.012 : 0;
    const effectiveApr = (vault.apr + boost) / 100;
    return amountNum * effectiveApr * selectedLockup / 365;
  };

  const getUnlockDate = (selectedLockup: number) => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return date;
  };

  return {
    calculateEstimatedReturns,
    getUnlockDate,
  };
};
