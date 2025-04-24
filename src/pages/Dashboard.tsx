
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/useWallet";
import { vaultService } from "@/services/vaultService";
import { UserInvestment, TransactionHistory } from "@/types/vault";
import { WalletIcon } from "lucide-react";

// Dashboard components
import { KpiTile } from "@/components/dashboard/KpiTile";
import { VaultRowAccordion } from "@/components/dashboard/VaultRowAccordion";
import { TxTable } from "@/components/dashboard/TxTable";
import { TxDrawer } from "@/components/dashboard/TxDrawer";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { WithdrawModal } from "@/components/vault/WithdrawModal";

export default function Dashboard() {
  const { isConnected, address, openWalletModal } = useWallet();
  const [selectedInvestment, setSelectedInvestment] = useState<UserInvestment | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<TransactionHistory | null>(null);
  const [isTxDrawerOpen, setIsTxDrawerOpen] = useState(false);

  const { 
    data: investments,
    isLoading: isLoadingInvestments,
  } = useQuery({
    queryKey: ['userInvestments'],
    queryFn: vaultService.getUserInvestments,
    enabled: isConnected,
  });

  const { 
    data: transactions,
    isLoading: isLoadingTransactions,
  } = useQuery({
    queryKey: ['transactionHistory'],
    queryFn: vaultService.getTransactionHistory,
    enabled: isConnected,
  });

  const totalInvestmentValue = investments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0;
  const totalPrincipal = investments?.reduce((sum, inv) => sum + inv.principal, 0) || 0;
  const totalProfit = investments?.reduce((sum, inv) => sum + inv.profit, 0) || 0;

  // Generate performance data with deposit markers
  const performanceData = useMemo(() => {
    if (!transactions) return [];
    
    // Create a base timeline of 30 days
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    
    // Generate data points for each day
    const data = [];
    for (let i = 0; i <= 29; i++) {
      const date = new Date(thirtyDaysAgo);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate a somewhat realistic portfolio value progression
      // Start with total principal and gradually increase to current value
      const dayFactor = i / 29;
      const growthFactor = 1 + (Math.sin(i/5) * 0.01) + (dayFactor * 0.08);
      const baseValue = totalPrincipal * growthFactor;
      
      // Find deposit events on this day
      const depositsOnThisDay = transactions.filter(tx => 
        tx.type === 'deposit' && tx.timestamp.split('T')[0] === dateStr
      );
      
      const depositAmount = depositsOnThisDay.reduce((sum, tx) => sum + tx.amount, 0);
      
      data.push({
        date: dateStr,
        value: baseValue,
        profit: baseValue - totalPrincipal,
        deposit: depositAmount > 0 ? depositAmount : undefined
      });
    }
    
    return data;
  }, [transactions, totalPrincipal]);

  const handleWithdrawClick = (investment: UserInvestment) => {
    setSelectedInvestment(investment);
    setIsWithdrawModalOpen(true);
  };
  
  const handleTxSelect = (tx: TransactionHistory) => {
    setSelectedTx(tx);
    setIsTxDrawerOpen(true);
  };

  if (!isConnected) {
    return (
      <PageContainer>
        <div className="max-w-md mx-auto mt-12">
          <EmptyState 
            title="Connect Your Wallet" 
            description="Connect your wallet to access your personalized dashboard and view your investment portfolio."
            actionLabel="Connect Wallet"
            actionLink="#"
          />
          <Button 
            onClick={openWalletModal}
            className="gradient-bg-nova hover:shadow-neon-nova w-full mt-4 hidden"
            data-wallet-connect
          >
            <WalletIcon className="mr-2 h-4 w-4" /> Connect Wallet
          </Button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Your <span className="gradient-text-nova">Portfolio</span>
        </h1>
        <p className="text-white/60 text-sm">
          Live snapshot of your vault positions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <KpiTile 
          title="Total Value" 
          value={totalInvestmentValue} 
          delta={5.75} // Example 24h change
          series={performanceData.map(d => ({ value: d.value }))}
          isLoading={isLoadingInvestments}
        />
        <KpiTile 
          title="Principal Invested" 
          value={totalPrincipal} 
          series={performanceData.map(d => ({ value: totalPrincipal }))}
          valueColor="text-[#33C3F0]"
          isLoading={isLoadingInvestments}
        />
        <KpiTile 
          title="Total Profit" 
          value={totalProfit} 
          delta={2.34} // Example 24h change
          series={performanceData.map(d => ({ value: d.profit || 0 }))}
          valueColor={totalProfit >= 0 ? "text-emerald" : "text-red-500"}
          isLoading={isLoadingInvestments}
        />
      </div>

      <PerformanceChart 
        data={performanceData}
        isLoading={isLoadingInvestments || isLoadingTransactions}
      />

      <Tabs defaultValue="investments" className="w-full">
        <TabsList className="w-full rounded-xl bg-white/5 p-1">
          <TabsTrigger value="investments" className="rounded-lg flex-1">Active Investments</TabsTrigger>
          <TabsTrigger value="transactions" className="rounded-lg flex-1">Transaction History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="investments" className="mt-6">
          {isLoadingInvestments ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="glass-card h-24 animate-shimmer"></div>
              ))}
            </div>
          ) : investments && investments.length > 0 ? (
            <div>
              {investments.map((investment) => (
                <VaultRowAccordion 
                  key={investment.vaultId} 
                  investment={investment}
                  onWithdraw={handleWithdrawClick}
                />
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Active Investments"
              description="You don't have any active investments. Start by exploring our vaults and making your first deposit."
              actionLabel="Explore Vaults"
              actionLink="/"
            />
          )}
        </TabsContent>
        
        <TabsContent value="transactions" className="mt-6">
          {isLoadingTransactions ? (
            <div className="glass-card h-64 animate-shimmer"></div>
          ) : transactions && transactions.length > 0 ? (
            <TxTable 
              transactions={transactions}
              onSelect={handleTxSelect}
            />
          ) : (
            <EmptyState 
              title="No Transaction History"
              description="You haven't made any transactions yet. Make your first deposit to get started."
              actionLabel="Explore Vaults"
              actionLink="/"
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Transaction drawer */}
      <TxDrawer 
        tx={selectedTx} 
        open={isTxDrawerOpen} 
        onClose={() => setIsTxDrawerOpen(false)}
      />

      {/* Withdraw modal */}
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
