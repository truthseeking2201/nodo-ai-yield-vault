
export interface VaultData {
  id: string;
  name: string;
  type: 'nova' | 'orion' | 'emerald';
  tvl: number;
  apr: number;
  apy: number;
  description: string;
  lockupPeriods: LockupPeriod[];
  riskLevel: 'low' | 'medium' | 'high';
  strategy: string;
  performance: PerformanceData;
}

export interface LockupPeriod {
  days: number;
  aprBoost: number;
}

export interface PerformanceData {
  daily: { date: string; value: number }[];
  weekly: { date: string; value: number }[];
  monthly: { date: string; value: number }[];
}

export interface UserInvestment {
  vaultId: string;
  principal: number;
  shares: number;
  depositDate: string;
  lockupPeriod: number;
  unlockDate: string;
  currentValue: number;
  profit: number;
  isWithdrawable: boolean;
  currentApr?: number; // Added currentApr property as optional
}

export interface TransactionHistory {
  id: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  vaultId: string;
  vaultName: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}
