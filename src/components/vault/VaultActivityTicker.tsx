
import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'deposit' | 'harvest' | 'withdraw';
  amount: number;
  timestamp: Date;
  address: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 5000,
    timestamp: new Date(),
    address: '0x1234...5678'
  },
  {
    id: '2',
    type: 'harvest',
    amount: 250,
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    address: '0x8765...4321'
  },
  {
    id: '3',
    type: 'withdraw',
    amount: 3000,
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    address: '0x9876...1234'
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

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-medium">
        <Activity className="h-5 w-5" />
        Recent Activity
      </h3>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 animate-fade-in"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
              </span>
              <span className="text-sm text-white/60">{activity.address}</span>
            </div>
            <div className="text-sm font-mono">
              {activity.type === 'deposit' ? '+' : '-'}${activity.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
