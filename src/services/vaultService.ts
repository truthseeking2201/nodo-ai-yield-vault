import { VaultData, UserInvestment, TransactionHistory } from "@/types/vault";

// Mock data for the vaults
const mockVaults: VaultData[] = [
  {
    id: "sui-usdc",
    name: "SUI-USDC",
    type: "emerald",
    tvl: 3000000,
    apr: 12.5,
    apy: 13.8,
    description: "A low-risk vault utilizing the SUI ↔ USDC trading pair with relatively low price volatility and impermanent loss risk.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.2 },
      { days: 90, aprBoost: 2.5 }
    ],
    riskLevel: "low",
    strategy: "Optimized position management in the SUI-USDC concentrated liquidity pool, aiming to outperform static LP by ≥3%.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 4) + 1) * 3 + i / 10
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 2) + 1) * 4 + i / 6
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 1) * 5 + i
      }))
    }
  },
  {
    id: "cetus-sui",
    name: "CETUS-SUI",
    type: "orion",
    tvl: 2100000,
    apr: 18.7,
    apy: 20.4,
    description: "A moderate-risk vault focusing on the CETUS ↔ SUI trading pair, balancing yield potential with managed volatility.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.7 },
      { days: 90, aprBoost: 3.5 }
    ],
    riskLevel: "medium",
    strategy: "Active position management in the CETUS-SUI concentrated liquidity pool, optimizing for fee capture while mitigating impermanent loss.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 5) + 0.5) * 1.5 + i / 15
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 3) + 0.5) * 2 + i / 6
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 0.5) * 3 + i / 2
      }))
    }
  },
  {
    id: "deep-sui",
    name: "DEEP-SUI",
    type: "nova",
    tvl: 1250000,
    apr: 24.8,
    apy: 27.9,
    description: "A high-risk, high-reward vault leveraging the DEEP ↔ SUI trading pair in high-spread, low-liquidity conditions.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 2.5 },
      { days: 90, aprBoost: 5.0 }
    ],
    riskLevel: "high",
    strategy: "Aggressive position management in the DEEP-SUI concentrated liquidity pool, maximizing yield capture in volatile market conditions.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 3) + 1.2) * 4 + i / 8
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 1.5) + 1.2) * 5 + i / 1.5
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 1.2) * 7 + i * 1.2
      }))
    }
  }
];

// Mock user investments - Remove NODOAIx investment
const mockUserInvestments: UserInvestment[] = [
  {
    vaultId: "deep-sui",
    principal: 500,
    shares: 48.25,
    depositDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    lockupPeriod: 60,
    unlockDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
    currentValue: 536.50,
    profit: 36.50,
    isWithdrawable: false
  },
  {
    vaultId: "cetus-sui",
    principal: 750,
    shares: 73.12,
    depositDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    lockupPeriod: 30,
    unlockDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    currentValue: 771.25,
    profit: 21.25,
    isWithdrawable: true
  }
];

// Mock transaction history - Remove NODOAIx transactions
const mockTransactions: TransactionHistory[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    vaultId: "deep-sui",
    vaultName: "DEEP-SUI",
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx2",
    type: "deposit",
    amount: 750,
    vaultId: "cetus-sui",
    vaultName: "CETUS-SUI",
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx3",
    type: "withdraw",
    amount: 250,
    vaultId: "sui-usdc",
    vaultName: "SUI-USDC",
    timestamp: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  }
];

export const vaultService = {
  // Get all vaults
  getAllVaults: async (): Promise<VaultData[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockVaults];
  },

  // Get a specific vault by ID
  getVaultById: async (id: string): Promise<VaultData | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockVaults.find(vault => vault.id === id) || null;
  },

  // Get user investments
  getUserInvestments: async (): Promise<UserInvestment[]> => {
    await new Promise(resolve => setTimeout(resolve, 700));
    return [...mockUserInvestments];
  },

  // Get transaction history
  getTransactionHistory: async (): Promise<TransactionHistory[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockTransactions];
  },

  // Deposit into a vault
  deposit: async (
    vaultId: string, 
    amount: number, 
    lockupPeriod: number
  ): Promise<{ success: boolean; txId: string }> => {
    // Simulate API delay and processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTxId = `tx${Math.random().toString(36).substring(2, 10)}`;
    
    // In a real implementation, this would interact with smart contracts
    return { success: true, txId: newTxId };
  },

  // Withdraw from a vault
  withdraw: async (
    investmentId: string,
    amount: number
  ): Promise<{ success: boolean; txId: string }> => {
    // Simulate API delay and processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newTxId = `tx${Math.random().toString(36).substring(2, 10)}`;
    
    // In a real implementation, this would interact with smart contracts
    return { success: true, txId: newTxId };
  }
};
