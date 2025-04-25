
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { Badge } from "@/components/ui/badge";
import { Cog } from 'lucide-react';

interface RebalancingEvent {
  vault: string;
  timestamp: string;
  delta_apr: number;
  fees_captured: number;
  action: string;
}

interface AIRebalancingTickerProps {
  vaultId?: string;
  variant?: "catalog" | "detail";
  className?: string;
}

export function AIRebalancingTicker({ vaultId, variant = "catalog", className = "" }: AIRebalancingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['rebalancing-events', vaultId],
    queryFn: () => generateMockEvents(vaultId),
    refetchInterval: 60000,
  });

  useEffect(() => {
    if (events.length === 0) return;
    
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prev => (prev + 1) % events.length);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [events.length, isPaused]);

  const getTimeAgo = (timestamp: string): string => {
    const date = new Date(timestamp);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatAPRChange = (value: number): string => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const formatFees = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  const getVaultColor = (vaultName: string): string => {
    if (vaultName.includes('DEEP') || vaultName.includes('deep')) return 'text-nova';
    if (vaultName.includes('CETUS') || vaultName.includes('cetus')) return 'text-orion';
    return 'text-emerald';
  };

  const generateMockEvents = (specificVaultId?: string): Promise<RebalancingEvent[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vaultNames = specificVaultId 
          ? [vaultIdToName(specificVaultId)]
          : ['DEEP–SUI', 'CETUS–SUI', 'SUI–USDC'];
        
        const actions = [
          'tightened LP range',
          'rebalanced LP positions',
          'optimized fee tiers',
          'narrowed IL corridor',
          'adjusted position depth'
        ];
        
        const mockEvents = [];
        
        const numEvents = specificVaultId ? 5 : 10;
        for (let i = 0; i < numEvents; i++) {
          const randomVault = vaultNames[Math.floor(Math.random() * vaultNames.length)];
          const randomAction = actions[Math.floor(Math.random() * actions.length)];
          const randomMinutesAgo = Math.floor(Math.random() * 60);
          const timestamp = new Date(Date.now() - randomMinutesAgo * 60 * 1000).toISOString();
          const delta_apr = Math.random() * 0.2;
          const fees_captured = Math.floor(Math.random() * 100) + 10;
          
          mockEvents.push({
            vault: randomVault,
            timestamp,
            delta_apr,
            fees_captured,
            action: randomAction
          });
        }
        
        mockEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        resolve(mockEvents);
      }, 500);
    });
  };

  const vaultIdToName = (id: string): string => {
    if (id.includes('deep-sui')) return 'DEEP–SUI';
    if (id.includes('cetus-sui')) return 'CETUS–SUI';
    if (id.includes('sui-usdc')) return 'SUI–USDC';
    return id;
  };

  if (isLoading || events.length === 0) {
    return null;
  }

  const currentEvent = events[currentIndex];

  if (variant === "detail") {
    return (
      <div 
        className={`flex flex-col space-y-1 ${className}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex items-center text-white/80 text-sm">
          <div className="flex items-center space-x-1.5">
            <div className="relative">
              <Cog size={16} className="text-nova animate-slow-spin" />
              <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full animate-pulse"></div>
            </div>
            <span className="font-medium">Last AI rebalance:</span>
            <span className="font-mono">{getTimeAgo(currentEvent.timestamp)}</span>
          </div>
        </div>
        
        <div className="text-sm text-white/60 pl-6">
          <span className="text-emerald font-mono font-medium">
            {formatAPRChange(currentEvent.delta_apr)} APR gain
          </span>
          <span className="mx-1.5">·</span>
          <span className="font-mono">
            {formatFees(currentEvent.fees_captured)}
          </span> 
          <span className="ml-1">in captured swap fees</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={tickerRef}
      className={`relative overflow-hidden rounded-xl bg-white/[0.03] backdrop-blur-sm border border-white/10 h-10 flex items-center px-4 ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center space-x-2 text-sm"
        >
          <div className="relative flex-shrink-0">
            <Cog size={16} className="text-nova animate-slow-spin" />
            <div className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-emerald rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className={`px-1.5 py-0.5 bg-white/5 border-none ${getVaultColor(currentEvent.vault)}`}
            >
              {currentEvent.vault}
            </Badge>
            
            <span className="text-white/80">{currentEvent.action}</span>
            
            <div className="flex items-center space-x-1">
              <span className="text-emerald font-mono font-medium">
                {formatAPRChange(currentEvent.delta_apr)} APR
              </span>
              <span className="text-white/40">·</span>
              <span className="text-nova font-mono font-medium">
                +{formatFees(currentEvent.fees_captured)} fees
              </span>
            </div>
            
            <span className="text-white/40 font-mono text-xs">
              {getTimeAgo(currentEvent.timestamp)}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
