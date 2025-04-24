
import { useState } from "react";
import { TransactionHistory } from "@/types/vault";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TxTableProps {
  transactions: TransactionHistory[];
  isLoading?: boolean;
  onSelect: (tx: TransactionHistory) => void;
}

export function TxTable({ transactions, isLoading = false, onSelect }: TxTableProps) {
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: null,
    to: null
  });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const formatVaultName = (vaultId: string) => {
    const nameMap = {
      'deep-sui': 'DEEP-SUI',
      'cetus-sui': 'CETUS-SUI',
      'sui-usdc': 'SUI-USDC'
    };
    return nameMap[vaultId] || vaultId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };
  
  const shortenHash = (hash: string) => {
    // Mock hash for demo purposes
    const mockHash = "0x7d83c975da6e3b5ff8259436d4f7da6d75";
    return `${mockHash.slice(0, 6)}...${mockHash.slice(-4)}`;
  };
  
  const filteredTransactions = filter === 'all' ? 
    transactions : 
    transactions.filter(tx => tx.type === filter);
  
  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash).then(() => {
      // In a real app, you'd show a toast notification
      console.log('Hash copied to clipboard');
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 md:justify-between">
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilter('all')}
            className={filter === 'all' ? "bg-nova text-[#0E0F11]" : ""}
          >
            All
          </Button>
          <Button 
            variant={filter === 'deposit' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('deposit')}
            className={filter === 'deposit' ? "bg-nova text-[#0E0F11]" : ""}
          >
            Deposits
          </Button>
          <Button 
            variant={filter === 'withdraw' ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter('withdraw')}
            className={filter === 'withdraw' ? "bg-nova text-[#0E0F11]" : ""}
          >
            Withdrawals
          </Button>
        </div>
      </div>
      
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-transparent">
                <TableHead className="text-xs uppercase tracking-wide text-white/60 w-[120px]">Date</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-white/60">Type</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-white/60">Vault</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-white/60 text-right">Amount</TableHead>
                <TableHead className="text-xs uppercase tracking-wide text-white/60">
                  Hash ↗
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i} className="border-b border-white/5 hover:bg-white/5">
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((tx) => (
                  <TableRow 
                    key={tx.id} 
                    className="border-b border-white/5 hover:bg-white/5 cursor-pointer even:bg-white/[0.02]" 
                    onClick={() => onSelect(tx)}
                  >
                    <TableCell className="font-mono text-xs">{formatDate(tx.timestamp)}</TableCell>
                    <TableCell>
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${
                        tx.type === 'deposit' ? 'bg-orion/20 text-orion' : 'bg-emerald/20 text-emerald'
                      }`}>
                        {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                      </span>
                    </TableCell>
                    <TableCell>{formatVaultName(tx.vaultId)}</TableCell>
                    <TableCell className="text-right font-mono font-medium">
                      {formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell 
                      className="font-mono text-xs text-white/70 flex items-center space-x-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyHash(tx.id);
                      }}
                    >
                      <span className="hover:text-white transition-colors">{shortenHash(tx.id)}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://explorer.sui.io/txblock/${tx.id}`, '_blank');
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-white/60">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
