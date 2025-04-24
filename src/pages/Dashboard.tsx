
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { WithdrawModal } from "@/components/vault/WithdrawModal";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { ChartLine, WalletIcon } from "lucide-react";
import { VaultPerformanceChart } from "@/components/vault/VaultPerformanceChart";

export default function Dashboard() {
  const { isConnected, address } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // Fetch user investments
  const { 
    data: investments,
    isLoading: isLoadingInvestments,
  } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected,
  });

  // Fetch transaction history
  const { 
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected,
  });

  // Calculate total investment value
  const totalInvestmentValue = investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const totalPrincipal = investments?.reduce((sum, inv) => sum + inv.principal, 0) || 0;
  const totalProfit = investments?.reduce((sum, inv) => sum + inv.profit, 0) || 0;

  // Helper functions
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get color based on vault type
  const getVaultStyles = (vaultId?: string) => {
    if (!vaultId) return {
      gradientText: '',
      gradientBg: '',
      shadow: '',
      bgOpacity: ''
    };
    
    if (vaultId.includes('nova')) {
      return {
        gradientText: 'gradient-text-nova',
        gradientBg: 'gradient-bg-nova',
        shadow: 'hover:shadow-neon-nova',
        bgOpacity: 'bg-nova/20',
        color: "#F97316"
      };
    } else if (vaultId.includes('orion')) {
      return {
        gradientText: 'gradient-text-orion',
        gradientBg: 'gradient-bg-orion',
        shadow: 'hover:shadow-neon-orion',
        bgOpacity: 'bg-orion/20',
        color: "#F59E0B"
      };
    } else {
      return {
        gradientText: 'gradient-text-emerald',
        gradientBg: 'gradient-bg-emerald',
        shadow: 'hover:shadow-neon-emerald',
        bgOpacity: 'bg-emerald/20',
        color: "#10B981"
      };
    }
  };

  // Handle withdraw click
  const handleWithdrawClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setIsWithdrawModalOpen(true);
  };

  if (!isConnected) {
    return (
      <PageContainer>
        <Card className="glass-card p-8 text-center">
          <CardHeader>
            <CardTitle className="text-2xl">Connect Your Wallet</CardTitle>
            <CardDescription className="text-white/60">
              Connect your wallet to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              data-wallet-connect
              className="gradient-bg-nova hover:shadow-neon-nova"
            >
              <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Your <span className="gradient-text-nova">Portfolio</span>
        </h1>
        <p className="text-white/60">
          Overview of your investments and performance
        </p>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-white/60">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingInvestments ? (
                <div className="h-8 bg-white/10 rounded animate-shimmer w-3/4"></div>
              ) : (
                formatCurrency(totalInvestmentValue)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-white/60">Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingInvestments ? (
                <div className="h-8 bg-white/10 rounded animate-shimmer w-3/4"></div>
              ) : (
                formatCurrency(totalPrincipal)
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-white/60">Total Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold gradient-text-emerald">
              {isLoadingInvestments ? (
                <div className="h-8 bg-white/10 rounded animate-shimmer w-3/4"></div>
              ) : (
                `+${formatCurrency(totalProfit)}`
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="glass-card mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ChartLine className="h-5 w-5" />
              Portfolio Performance
            </CardTitle>
            <CardDescription>
              30-day overview of your investments
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoadingInvestments ? (
              <div className="h-full bg-white/5 rounded animate-shimmer"></div>
            ) : (
              <VaultPerformanceChart 
                data={[
                  // Generate sample performance data based on investment data
                  ...Array.from({ length: 30 }, (_, i) => ({
                    date: new Date(Date.now() - (29-i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    value: totalPrincipal * (1 + (Math.sin(i/4) * 0.02) + (i/300))
                  }))
                ]}
                vaultType="nova"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Investments and Transactions */}
      <Tabs defaultValue="investments" className="w-full">
        <TabsList className="glass-card mb-6">
          <TabsTrigger value="investments">Active Investments</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investments">
          {isLoadingInvestments ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <Card key={i} className="glass-card">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between">
                      <div className="h-6 bg-white/10 rounded animate-shimmer w-1/4"></div>
                      <div className="h-6 bg-white/10 rounded animate-shimmer w-1/4"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/10 rounded animate-shimmer w-1/3"></div>
                      <div className="h-4 bg-white/10 rounded animate-shimmer w-1/3"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-white/10 rounded animate-shimmer w-1/2"></div>
                      <div className="h-8 bg-white/10 rounded animate-shimmer w-1/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : investments && investments.length > 0 ? (
            <div className="space-y-4">
              {investments.map((investment) => {
                const styles = getVaultStyles(investment.vaultId);
                return (
                  <Card key={investment.vaultId} className="glass-card">
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                        <div>
                          <h3 className={`text-xl font-bold ${styles.gradientText}`}>
                            {investment.vaultId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Vault
                          </h3>
                          <p className="text-white/60 text-sm">
                            Deposited on {formatDate(investment.depositDate)}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0">
                          <div className="text-right">
                            <div className="text-xl font-bold">{formatCurrency(investment.currentValue)}</div>
                            <div className={`text-sm ${investment.profit > 0 ? 'text-emerald' : 'text-red-500'}`}>
                              {investment.profit > 0 ? '+' : ''}{formatCurrency(investment.profit)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-between mt-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:space-x-6">
                          <div>
                            <p className="text-xs text-white/60">Principal</p>
                            <p className="font-mono">{formatCurrency(investment.principal)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Lock-up</p>
                            <p>{investment.lockupPeriod} days</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Unlock Date</p>
                            <p>{formatDate(investment.unlockDate)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/60">Status</p>
                            <p className={investment.isWithdrawable ? 'text-emerald' : 'text-white/80'}>
                              {investment.isWithdrawable ? 'Withdrawable' : 'Locked'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-4 sm:mt-0">
                          <Button 
                            onClick={() => handleWithdrawClick(investment)}
                            disabled={!investment.isWithdrawable}
                            className={`${styles.gradientBg} ${investment.isWithdrawable ? styles.shadow : 'opacity-50'}`}
                          >
                            Withdraw
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="glass-card p-8 text-center">
              <CardHeader>
                <CardTitle>No Active Investments</CardTitle>
                <CardDescription>
                  You don't have any active investments. Start by exploring our vaults.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="gradient-bg-nova hover:shadow-neon-nova">
                  <a href="/">Explore Vaults</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="transactions">
          {isLoadingTransactions ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card p-4 flex justify-between items-center">
                  <div className="flex space-x-3 items-center">
                    <div className="h-8 w-8 rounded-full bg-white/10 animate-shimmer"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-white/10 rounded animate-shimmer w-24"></div>
                      <div className="h-3 bg-white/10 rounded animate-shimmer w-32"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-white/10 rounded animate-shimmer w-20"></div>
                </div>
              ))}
            </div>
          ) : transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((tx) => {
                const styles = getVaultStyles(tx.vaultId);
                return (
                  <div key={tx.id} className="glass-card p-4 flex justify-between items-center">
                    <div className="flex space-x-3 items-center">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? styles.gradientBg : 'bg-white/10'}`}>
                        {tx.type === 'deposit' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 19V5"></path>
                            <polyline points="5 12 12 5 19 12"></polyline>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 5v14"></path>
                            <polyline points="19 12 12 19 5 12"></polyline>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {tx.type === 'deposit' ? 'Deposit to' : 'Withdrawal from'} {tx.vaultName}
                        </p>
                        <p className="text-sm text-white/60">{formatDate(tx.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-medium ${tx.type === 'deposit' ? styles.gradientText : ''}`}>
                        {tx.type === 'deposit' ? '-' : '+'}{formatCurrency(tx.amount)}
                      </p>
                      <p className={`text-xs ${
                        tx.status === 'completed' ? 'text-emerald' : 
                        tx.status === 'pending' ? 'text-orion' : 'text-red-500'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="glass-card p-8 text-center">
              <CardHeader>
                <CardTitle>No Transactions</CardTitle>
                <CardDescription>
                  You don't have any transaction history yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Withdraw Modal */}
      {selectedInvestment && (
        <WithdrawModal 
          open={isWithdrawModalOpen}
          onClose={() => setIsWithdrawModalOpen(false)}
          investment={selectedInvestment}
        />
      )}
    </PageContainer>
  );
}
