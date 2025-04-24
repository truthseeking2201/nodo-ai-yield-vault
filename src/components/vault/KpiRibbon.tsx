
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { TrendingUp, Users, DollarSign } from "lucide-react";

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
  
  useEffect(() => {
    if (isLoading || !vaults) return;
    
    // Calculate total TVL
    const totalTvl = vaults.reduce((sum, vault) => sum + vault.tvl, 0);
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)} M`;
    
    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)} %`;
    
    // Simulate active LPs (would come from real data in production)
    const activeLPs = "2,000+"; 
    
    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 my-4 md:my-6">
      <div className="bg-nodo-glass backdrop-blur-md px-4 py-2 rounded-full border border-stroke-soft flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-brand-orange-500" />
        <p className="text-base font-mono font-medium text-text-secondary tabular-nums">
          Total TVL <span className="text-text-primary">{kpiData.tvl}</span>
        </p>
      </div>
      
      <div className="bg-nodo-glass backdrop-blur-md px-4 py-2 rounded-full border border-stroke-soft flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-brand-orange-500" />
        <p className="text-base font-mono font-medium text-text-secondary tabular-nums">
          Avg APR <span className="text-text-primary">{kpiData.apr}</span>
        </p>
      </div>
      
      <div className="bg-nodo-glass backdrop-blur-md px-4 py-2 rounded-full border border-stroke-soft flex items-center gap-2">
        <Users className="h-4 w-4 text-brand-orange-500" />
        <p className="text-base font-mono font-medium text-text-secondary tabular-nums">
          Active LPs <span className="text-text-primary">{kpiData.activeLPs}</span>
        </p>
      </div>
    </div>
  );
}
