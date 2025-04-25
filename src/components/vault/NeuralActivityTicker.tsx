import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { Brain, Clock, TrendingUp } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface NeuralActivity {
  id: string;
  timestamp: Date;
  message: string;
  type: 'rebalance' | 'prediction' | 'optimization' | 'insight';
  impact: {
    value: number;
    metric: string;
  };
  vault: string;
}

interface NeuralActivityTickerProps {
  variant?: 'default' | 'compact';
}

export function NeuralActivityTicker({ variant = 'default' }: NeuralActivityTickerProps) {
  const [activities, setActivities] = useState<NeuralActivity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  const { data: vaults } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });

  useEffect(() => {
    if (!vaults || vaults.length === 0) return;
    
    const generateActivities = () => {
      const types = ['rebalance', 'prediction', 'optimization', 'insight'] as const;
      const mockActivities: NeuralActivity[] = [];
      
      vaults.forEach(vault => {
        const type = types[Math.floor(Math.random() * types.length)];
        const timestamp = new Date(Date.now() - Math.floor(Math.random() * 15) * 60000);
        
        let message = '';
        let impact = { value: 0, metric: '' };
        
        switch (type) {
          case 'rebalance':
            const aprChange = (Math.random() * 0.3).toFixed(2);
            const fees = Math.floor(Math.random() * 300) + 50;
            message = `Just rebalanced: ${vault.name}, improved APR by +${aprChange}%, earned +$${fees} in fees`;
            impact = { value: parseFloat(aprChange), metric: 'APR' };
            break;
          case 'prediction':
            const projection = (Math.random() * 1.5).toFixed(1);
            message = `Forecast: ${vault.name} APR projected +${projection}% in the next 7 days`;
            impact = { value: parseFloat(projection), metric: 'projected APR' };
            break;
          case 'optimization':
            const riskReduction = Math.floor(Math.random() * 7) + 2;
            message = `AI Optimization: ${vault.name}, reduced IL risk by ${riskReduction}%`;
            impact = { value: riskReduction, metric: 'risk reduction' };
            break;
          case 'insight':
            const performance = (Math.random() * 4).toFixed(1);
            message = `Insight: Users who entered ${vault.name} vault 2 weeks ago are up +${performance}% already`;
            impact = { value: parseFloat(performance), metric: 'performance' };
            break;
        }
        
        mockActivities.push({
          id: `${vault.id}-${type}-${Date.now()}`,
          timestamp,
          message,
          type,
          impact,
          vault: vault.id
        });
      });
      
      return mockActivities.sort(() => Math.random() - 0.5).slice(0, 5);
    };
    
    setActivities(generateActivities());
    
    const interval = setInterval(() => {
      setActivities(generateActivities());
    }, 120000);
    
    return () => clearInterval(interval);
  }, [vaults]);

  useEffect(() => {
    if (activities.length === 0 || isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activities.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, [activities.length, isPaused]);
  
  useEffect(() => {
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, 120000);
    
    return () => clearTimeout(hideTimeout);
  }, []);

  if (!isVisible || activities.length === 0) return null;
  
  const currentActivity = activities[currentIndex];
  
  const getIconByType = (type: string) => {
    switch (type) {
      case 'rebalance': return <Brain size={18} className="text-nova" />;
      case 'prediction': return <TrendingUp size={18} className="text-emerald" />;
      case 'optimization': return <Brain size={18} className="text-orion" />;
      case 'insight': return <Clock size={18} className="text-emerald" />;
      default: return <Brain size={18} />;
    }
  };
  
  const getTimeAgo = (timestamp: Date): string => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex items-start justify-between gap-4 text-sm"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {getIconByType(activity.type)}
                  <span className="font-medium text-white/90">{activity.vault}</span>
                </div>
                <p className="text-white/70">{activity.message}</p>
                {activity.impact && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-emerald font-mono">
                      +{activity.impact.value.toFixed(2)}% {activity.impact.metric}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-xs text-white/40 whitespace-nowrap">
                {getTimeAgo(activity.timestamp)}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div 
      ref={tickerRef}
      className="w-full relative mx-auto mb-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <TooltipProvider>
        <div className="neural-orange-gradient h-[2px] w-full rounded-full opacity-50 mb-1"></div>
        <div className="flex items-center mb-1">
          <div className="relative">
            <div className="h-2 w-2 bg-nova rounded-full absolute -top-1 -right-1 animate-pulse"></div>
            <Brain size={16} className="text-nova mr-1" />
          </div>
          <span className="text-xs font-medium text-white/70">NODO AI ENGINE</span>
        </div>
        
        <div className="min-h-[24px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentActivity?.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <span className="text-sm font-medium text-glow-emerald">
                {currentActivity?.message}
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-xs text-white/40">
                    {getTimeAgo(currentActivity?.timestamp)}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">AI activity from {currentActivity?.timestamp.toLocaleTimeString()}</p>
                </TooltipContent>
              </Tooltip>
            </motion.div>
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </div>
  );
}
