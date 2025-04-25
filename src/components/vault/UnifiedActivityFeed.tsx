import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, ArrowDown, ArrowUp } from "lucide-react";
import { PairIcon } from "@/components/shared/TokenIcons";

interface ActivityItem {
  id: string;
  type: 'ai' | 'user';
  action: string;
  timestamp: Date;
  vault: string;
  details: {
    value?: number;
    metric?: string;
    address?: string;
    impact?: string;
  };
}

export function UnifiedActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  
  useEffect(() => {
    const generateInitialActivities = () => {
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'ai',
          action: 'rebalanced',
          timestamp: new Date(Date.now() - 1000 * 60),
          vault: 'SUI-USDC',
          details: {
            value: 0.5,
            metric: 'APR',
            impact: '+$320 fees captured'
          }
        },
        {
          id: '2',
          type: 'user',
          action: 'deposit',
          timestamp: new Date(Date.now() - 1000 * 120),
          vault: 'Deep-SUI',
          details: {
            value: 2500,
            address: '0x7d783c53c48ebaec29bdafc'
          }
        },
        {
          id: '3',
          type: 'ai',
          action: 'optimized',
          timestamp: new Date(Date.now() - 1000 * 180),
          vault: 'Cetus-SUI',
          details: {
            value: 0.8,
            metric: 'IL reduction',
            impact: 'lowered risk exposure'
          }
        }
      ];
      return mockActivities;
    };

    setActivities(generateInitialActivities());

    const interval = setInterval(() => {
      const newActivity = generateNewActivity();
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const generateNewActivity = (): ActivityItem => {
    const vaults = ['SUI-USDC', 'Deep-SUI', 'Cetus-SUI'];
    const aiActions = ['rebalanced', 'optimized', 'harvested fees'];
    const userActions = ['deposit', 'withdraw'];
    
    const isAI = Math.random() > 0.4;
    const vault = vaults[Math.floor(Math.random() * vaults.length)];
    
    if (isAI) {
      const action = aiActions[Math.floor(Math.random() * aiActions.length)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ai',
        action,
        timestamp: new Date(),
        vault,
        details: {
          value: Number((Math.random() * 0.8 + 0.2).toFixed(2)),
          metric: action === 'harvested fees' ? 'fees' : 'APR',
          impact: action === 'harvested fees' 
            ? `+$${Math.floor(Math.random() * 500 + 100)} captured`
            : `+${(Math.random() * 0.5).toFixed(2)}% efficiency`
        }
      };
    } else {
      const action = userActions[Math.floor(Math.random() * userActions.length)];
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'user',
        action,
        timestamp: new Date(),
        vault,
        details: {
          value: Math.floor(Math.random() * 5000 + 100),
          address: `0x${Math.random().toString(36).substr(2, 16)}`
        }
      };
    }
  };

  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 text-xs"
          >
            <div className="flex-shrink-0">
              {activity.type === 'ai' ? (
                <div className="relative">
                  <Brain className="w-3.5 h-3.5 text-brand-500" />
                  <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-emerald rounded-full animate-pulse"></div>
                </div>
              ) : (
                activity.action === 'deposit' ? (
                  <ArrowDown className="w-3.5 h-3.5 text-emerald" />
                ) : (
                  <ArrowUp className="w-3.5 h-3.5 text-red-500" />
                )
              )}
            </div>

            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <PairIcon 
                  tokens={activity.vault.split('-') as ["SUI" | "USDC" | "DEEP" | "CETUS", "SUI" | "USDC" | "DEEP" | "CETUS"]} 
                  size={16} 
                />
                <span className={`font-medium ${activity.vault.includes('DEEP') ? 'text-nova' : activity.vault.includes('CETUS') ? 'text-orion' : 'text-emerald'}`}>
                  {activity.vault}
                </span>
              </div>

              {activity.type === 'ai' ? (
                <div className="flex items-center gap-1.5 text-white/80">
                  <span>{activity.action}</span>
                  {activity.details.value && (
                    <span className="text-emerald font-mono">
                      +{activity.details.value}% {activity.details.metric}
                    </span>
                  )}
                  {activity.details.impact && (
                    <span className="text-white/60 hidden sm:inline">
                      ({activity.details.impact})
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-white/60 text-[11px]">
                    {activity.details.address?.slice(0, 6)}...
                  </span>
                  <span className={`font-mono font-medium ${activity.action === 'deposit' ? 'text-emerald' : 'text-red-500'}`}>
                    ${activity.details.value?.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            <span className="text-white/40 font-mono text-[10px]">
              {getTimeAgo(activity.timestamp)}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
