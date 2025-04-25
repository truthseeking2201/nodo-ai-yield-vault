
import { VaultData } from "@/types/vault";

export const useDepositCalculations = (vault?: VaultData) => {
  const calculateEstimatedReturns = (amount: string = "0", selectedLockup: number = 30) => {
    if (!amount || !vault) return 0;
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return 0;
    
    const selectedPeriod = vault.lockupPeriods.find(p => p.days === selectedLockup);
    const boost = selectedPeriod?.aprBoost || 0;
    const effectiveApr = (vault.apr + boost) / 100;
    
    return amountNum * effectiveApr * selectedLockup / 365;
  };

  const getUnlockDate = (selectedLockup: number = 30) => {
    const date = new Date();
    date.setDate(date.getDate() + selectedLockup);
    return date;
  };

  return {
    calculateEstimatedReturns,
    getUnlockDate,
  };
};
