
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { VaultPerformanceChart } from "./VaultPerformanceChart";
import { VaultData } from "@/types/vault";
import { AIRebalancingTicker } from "./AIRebalancingTicker";

interface VaultPerformanceSectionProps {
  vault: VaultData;
  timeRange: "daily" | "weekly" | "monthly";
  onTimeRangeChange: (range: "daily" | "weekly" | "monthly") => void;
  styles: {
    gradientBg: string;
  };
}

export function VaultPerformanceSection({
  vault,
  timeRange,
  onTimeRangeChange,
  styles
}: VaultPerformanceSectionProps) {
  return (
    <Card className="glass-card rounded-[20px] overflow-visible">
      <CardHeader className="flex flex-row items-center justify-between p-6">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-[#E5E7EB]">
            <BarChart className="h-5 w-5" />
            Performance
          </CardTitle>
          <CardDescription className="text-sm text-[#9CA3AF] tracking-[-0.15px]">
            Historical vault performance
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={timeRange === "daily" ? "default" : "outline"} 
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "daily" 
                ? styles.gradientBg 
                : 'bg-[#202124] border-white/10 hover:bg-[#202124]/80'
            }`}
            onClick={() => onTimeRangeChange("daily")}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === "weekly" ? "default" : "outline"} 
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "weekly" 
                ? styles.gradientBg 
                : 'bg-[#202124] border-white/10 hover:bg-[#202124]/80'
            }`}
            onClick={() => onTimeRangeChange("weekly")}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === "monthly" ? "default" : "outline"} 
            size="sm"
            className={`py-1 px-3 text-[11px] font-medium ${
              timeRange === "monthly" 
                ? styles.gradientBg 
                : 'bg-[#202124] border-white/10 hover:bg-[#202124]/80'
            }`}
            onClick={() => onTimeRangeChange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="overflow-visible rounded-lg">
          <VaultPerformanceChart 
            data={vault.performance[timeRange]}
            vaultType={vault.type}
            showAxisLabels={true}
            highlightLastDataPoint={true}
            timeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
            styles={styles}
          />
          
          {/* Add AI Rebalancing Ticker */}
          <div className="mt-4 border-t border-white/10 pt-4">
            <AIRebalancingTicker variant="detail" vaultId={vault.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
