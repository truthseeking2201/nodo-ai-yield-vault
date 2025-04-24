
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { AnimatePresence, motion } from "framer-motion";

interface KpiItemProps {
  label: string;
  value: string;
  previousValue?: string;
}

export function KpiItem({ label, value, previousValue }: KpiItemProps) {
  const [displayValue, setDisplayValue] = useState("0");
  const [isCountingUp, setIsCountingUp] = useState(true);
  
  useEffect(() => {
    // Extract numeric part from value (removing $ and % symbols)
    const numericValue = parseFloat(value.replace(/[$,%]/g, ''));
    
    // Start from 0 and count up
    let startValue = 0;
    const duration = 600; // 600ms animation
    const interval = 16; // ~60fps
    const steps = duration / interval;
    const increment = numericValue / steps;
    let current = 0;
    
    setIsCountingUp(true);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
        setIsCountingUp(false);
      }
      
      // Format the value to match the input format ($ or %)
      let formattedValue = current.toFixed(1);
      if (value.includes('$')) {
        formattedValue = '$' + formattedValue;
      } else if (value.includes('%')) {
        formattedValue = formattedValue + ' %';
      }
      
      setDisplayValue(formattedValue);
    }, interval);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="flex flex-col items-center px-6">
      <p className="text-xs text-[#9CA3AF]">{label}</p>
      <p className={`text-lg font-mono font-medium tabular-nums ${isCountingUp ? "animate-count-up" : ""}`}>
        {displayValue}
        {previousValue && previousValue !== value && (
          <span className="ml-1 text-xs text-green-400">↑</span>
        )}
      </p>
    </div>
  );
}

export function KpiRibbon() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });
  
  const [kpiData, setKpiData] = useState({
    tvl: "$0.0 M",
    apr: "0.0 %",
    activeLPs: "0"
  });
  
  const [previousData, setPreviousData] = useState({
    tvl: "$0.0 M",
    apr: "0.0 %",
    activeLPs: "0"
  });
  
  useEffect(() => {
    if (isLoading || !vaults) return;
    
    // Calculate total TVL
    const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)} M`;
    
    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)} %`;
    
    // Simulate active LPs (would come from real data in production)
    const activeLPs = "2 174"; 
    
    setPreviousData(kpiData);
    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);
  
  // Refresh data every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      // Refetch data
      // In a real implementation, you would call vaultService here
      // For now, we'll just simulate small changes
      
      const randomChange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };
      
      setKpiData(prev => {
        const tvlValue = parseFloat(prev.tvl.replace(/[$M]/g, ''));
        const aprValue = parseFloat(prev.apr.replace(/[%]/g, ''));
        const lpValue = parseInt(prev.activeLPs.replace(/[ ]/g, ''));
        
        // Small random changes
        const newTvl = `$${(tvlValue + randomChange(-0.2, 0.3)).toFixed(1)} M`;
        const newApr = `${(aprValue + randomChange(-0.1, 0.2)).toFixed(1)} %`;
        const newLPs = `${lpValue + Math.round(randomChange(-5, 10))}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        
        return {
          tvl: newTvl,
          apr: newApr,
          activeLPs: newLPs
        };
      });
    }, 30000); // 30s
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex justify-center items-center py-5 glass-card my-8 rounded-xl animate-fade-in">
      <KpiItem label="Total TVL" value={kpiData.tvl} previousValue={previousData.tvl} />
      <div className="h-10 w-px bg-white/10"></div>
      <KpiItem label="Average APR" value={kpiData.apr} previousValue={previousData.apr} />
      <div className="h-10 w-px bg-white/10"></div>
      <KpiItem label="Active LPs" value={kpiData.activeLPs} previousValue={previousData.activeLPs} />
    </div>
  );
}
