import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { TokenIcon, PairIcon } from "@/components/shared/TokenIcons";

interface ActivityItem {
  id: string;
  action: "deposit" | "withdraw";
  address: string;
  amount: number;
  vault: string;
  timestamp: Date;
}

interface VaultActivityTickerProps {
  maxRows?: number;
  rowHeight?: string;
}

export function VaultActivityTicker({ maxRows = 3, rowHeight = "h-6" }: VaultActivityTickerProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const mockActivities: ActivityItem[] = [
      {
        id: "1",
        action: "deposit",
        address: "0x7d783c53c48ebaec29bdafc",
        amount: 500,
        vault: "SUI-USDC",
        timestamp: new Date(Date.now() - 1000 * 60 * 2) // 2 minutes ago
      },
      {
        id: "2",
        action: "deposit",
        address: "0x42fb17e6b46de3a4c387",
        amount: 2500,
        vault: "Deep-SUI",
        timestamp: new Date(Date.now() - 1000 * 60 * 5) // 5 minutes ago
      },
      {
        id: "3",
        action: "withdraw",
        address: "0x9a5c371e8b498f15f627",
        amount: 1200,
        vault: "Cetus-SUI",
        timestamp: new Date(Date.now() - 1000 * 60 * 7) // 7 minutes ago
      },
      {
        id: "4",
        action: "deposit",
        address: "0x3f8a2b5c41e09d76f1e2",
        amount: 750,
        vault: "SUI-USDC",
        timestamp: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      },
      {
        id: "5",
        action: "withdraw",
        address: "0x6e5d2c8b17a4f39e0a1",
        amount: 3000,
        vault: "Deep-SUI",
        timestamp: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
      }
    ];
    
    setActivities(mockActivities.slice(0, maxRows));
    
    const interval = setInterval(() => {
      const newActivity: ActivityItem = {
        id: Math.random().toString(36).substring(2, 9),
        action: Math.random() > 0.3 ? "deposit" : "withdraw",
        address: `0x${Math.random().toString(36).substring(2, 18)}`,
        amount: Math.floor(Math.random() * 5000) + 100,
        vault: Math.random() > 0.5 ? "SUI-USDC" : Math.random() > 0.5 ? "Deep-SUI" : "Cetus-SUI",
        timestamp: new Date()
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, maxRows - 1)]);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [maxRows]);

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const truncateAddress = (address: string): string => {
    if (address.length <= 10) return address;
    return `${address.substring(0, 6)}...`;
  };

  const getTokenPair = (vaultName: string): [string, string] => {
    if (vaultName === 'SUI-USDC') return ['SUI', 'USDC'];
    if (vaultName === 'Deep-SUI') return ['DEEP', 'SUI'];
    if (vaultName === 'Cetus-SUI') return ['CETUS', 'SUI'];
    return ['SUI', 'USDC']; // default
  };

  return (
    <div className="space-y-1">
      {activities.map(activity => (
        <div key={activity.id} className={`flex items-center justify-between text-xs ${rowHeight}`}>
          <div className="flex items-center gap-1">
            <span className={`rounded-full p-0.5 ${activity.action === 'deposit' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
              {activity.action === 'deposit' ? <ArrowDown className="h-3 w-3" /> : <ArrowUp className="h-3 w-3" />}
            </span>
            <span className="font-mono">
              {truncateAddress(activity.address)}
            </span>
            <span className="text-white/40">
              {activity.action === 'deposit' ? 'added' : 'removed'}
            </span>
            <span className="font-mono">
              {formatCurrency(activity.amount)}
            </span>
            <span className="text-white/40">in</span>
            <span className="flex items-center gap-1">
              <PairIcon tokens={getTokenPair(activity.vault) as [any, any]} size={16} />
              <span className={`font-medium ${activity.vault === 'SUI-USDC' ? 'text-emerald-500' : activity.vault === 'Deep-SUI' ? 'text-nova' : 'text-orion'}`}>
                {activity.vault}
              </span>
            </span>
          </div>
          <span className="text-white/40">
            {getTimeAgo(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}
