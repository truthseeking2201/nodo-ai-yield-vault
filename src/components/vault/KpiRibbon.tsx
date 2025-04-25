
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";
import { StatChip } from "./StatChip";

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
    const formattedTvl = `$${(totalTvl / 1000000).toFixed(1)}M`;
    
    // Calculate average APR
    const avgApr = vaults.reduce((sum, vault) => sum + vault.apr, 0) / vaults.length;
    const formattedApr = `${avgApr.toFixed(1)}%`;
    
    // Simulate active LPs (would come from real data in production)
    const activeLPs = "2,000+"; 
    
    setKpiData({
      tvl: formattedTvl,
      apr: formattedApr,
      activeLPs
    });
  }, [vaults, isLoading]);
  
  return (
    <div className="flex justify-center items-center gap-10 py-8 animate-fade-in">
      <StatChip 
        label="Total TVL" 
        value={kpiData.tvl}
        delta={{ value: 0.5 }}
      />
      <StatChip 
        label="Average APR" 
        value={kpiData.apr}
        delta={{ value: 0.2 }}
      />
      <StatChip 
        label="Active LPs" 
        value={kpiData.activeLPs}
        delta={{ value: 0.8 }}
      />
    </div>
  );
}
