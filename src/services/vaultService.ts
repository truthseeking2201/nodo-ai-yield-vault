
import { VaultData, UserInvestment, TransactionHistory } from "@/types/vault";

// Mock data for the vaults
const mockVaults: VaultData[] = [
  {
    id: "nova-yield",
    name: "Nova Yield",
    type: "nova",
    tvl: 2750000,
    apr: 12.5,
    apy: 13.2,
    description: "A high performance yield vault leveraging AI for market prediction and optimized yield farming across DeFi protocols.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.5 },
      { days: 90, aprBoost: 3.25 }
    ],
    riskLevel: "medium",
    strategy: "AI-powered multi-strategy yield farming across top DeFi protocols with active rebalancing.",
    performance: {
      daily: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: 100 + (Math.sin(i / 4) + 1) * 3 + i / 10
      })),
      weekly: Array.from({ length: 12 }, (_, i) => ({
        date: `Week ${i + 1}`,
        value: 100 + (Math.sin(i / 2) + 1) * 4 + i / 2
      })),
      monthly: Array.from({ length: 6 }, (_, i) => ({
        date: `Month ${i + 1}`,
        value: 100 + (Math.sin(i) + 1) * 5 + i
      }))
    }
  },
  {
    id: "orion-stable",
    name: "Orion Stable",
    type: "orion",
    tvl: 4320000,
    apr: 8.7,
    apy: 9.1,
    description: "A moderate-risk vault focusing on stablecoin yields with enhanced returns through strategic allocations.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 1.2 },
      { days: 90, aprBoost: 2.8 }
    ],
    riskLevel: "low",
    strategy: "Diversified stablecoin farming across multiple chains with automated compounding.",
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
    id: "emerald-growth",
    name: "Emerald Growth",
    type: "emerald",
    tvl: 1850000,
    apr: 15.8,
    apy: 17.2,
    description: "A higher-risk, higher-reward vault designed for strategic growth through carefully selected DeFi opportunities.",
    lockupPeriods: [
      { days: 30, aprBoost: 0 },
      { days: 60, aprBoost: 2.0 },
      { days: 90, aprBoost: 4.5 }
    ],
    riskLevel: "high",
    strategy: "Aggressive yield farming with selective token exposure and automated profit taking.",
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

// Mock user investments
const mockUserInvestments: UserInvestment[] = [
  {
    vaultId: "nova-yield",
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
    vaultId: "orion-stable",
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

// Mock transaction history
const mockTransactions: TransactionHistory[] = [
  {
    id: "tx1",
    type: "deposit",
    amount: 500,
    vaultId: "nova-yield",
    vaultName: "Nova Yield",
    timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx2",
    type: "deposit",
    amount: 750,
    vaultId: "orion-stable",
    vaultName: "Orion Stable",
    timestamp: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: "completed"
  },
  {
    id: "tx3",
    type: "withdraw",
    amount: 250,
    vaultId: "emerald-growth",
    vaultName: "Emerald Growth",
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
