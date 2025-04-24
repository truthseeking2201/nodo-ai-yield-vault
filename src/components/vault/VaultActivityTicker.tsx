
import { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'deposit' | 'harvest' | 'withdraw';
  amount: number;
  timestamp: Date;
  address: string;
  vault?: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    timestamp: new Date(),
    address: '0x1234...5678',
    vault: 'SUI-USDC'
  },
  {
    id: '2',
    type: 'harvest',
    amount: 250,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    address: '0x8765...4321',
    vault: 'Nova'
  },
  {
    id: '3',
    type: 'withdraw',
    amount: 3000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    address: '0x9876...1234',
    vault: 'Orion'
  },
  {
    id: '4',
    type: 'deposit',
    amount: 1200,
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    address: '0x3456...7890',
    vault: 'SUI-USDC'
  },
  {
    id: '5',
    type: 'deposit',
    amount: 750,
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    address: '0x6543...2109',
    vault: 'Nova'
  }
];

export function VaultActivityTicker() {
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivities);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity by rotating the array and updating timestamps
      setActivities(prev => {
        const newActivities = [...prev];
        const first = newActivities.shift();
        if (first) {
          first.timestamp = new Date();
          newActivities.push(first);
        }
        return newActivities;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowUpRight className="h-4 w-4 text-[#10B981]" />;
      case 'harvest': return <Activity className="h-4 w-4 text-[#06B6D4]" />;
      case 'withdraw': return <ArrowDownRight className="h-4 w-4 text-[#EF4444]" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-[#10B981]';
      case 'harvest': return 'text-[#06B6D4]';
      case 'withdraw': return 'text-[#EF4444]';
      default: return '';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hr ago';
    if (hours < 24) return `${hours} hrs ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-3 overflow-hidden">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-2 rounded-lg bg-white/5 animate-[fade-in_250ms_cubic-bezier(.22,1,.36,1)]"
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full p-1 bg-white/10">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                </span>
                <span className="text-sm text-white/60">{activity.address}</span>
              </div>
              <div className="text-xs text-white/40">
                {activity.vault && `to ${activity.vault} vault • `}{formatTimeAgo(activity.timestamp)}
              </div>
            </div>
          </div>
          <div className="text-sm font-mono">
            {activity.type === 'deposit' ? '+' : '-'}${activity.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
