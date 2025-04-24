
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";
import { VaultPerformanceChart } from "./VaultPerformanceChart";
import { VaultData } from "@/types/vault";

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
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Performance
          </CardTitle>
          <CardDescription>Historical vault performance</CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === "daily" ? "default" : "outline"} 
            size="sm"
            className={timeRange === "daily" ? styles.gradientBg : "bg-white/5 border-white/10"}
            onClick={() => onTimeRangeChange("daily")}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === "weekly" ? "default" : "outline"} 
            size="sm"
            className={timeRange === "weekly" ? styles.gradientBg : "bg-white/5 border-white/10"}
            onClick={() => onTimeRangeChange("weekly")}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === "monthly" ? "default" : "outline"} 
            size="sm"
            className={timeRange === "monthly" ? styles.gradientBg : "bg-white/5 border-white/10"}
            onClick={() => onTimeRangeChange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <VaultPerformanceChart 
            data={vault.performance[timeRange]}
            vaultType={vault.type}
            showAxisLabels={true}
            highlightLastDataPoint={true}
            timeRange={timeRange}
            onTimeRangeChange={onTimeRangeChange}
            styles={styles}
          />
        </div>
      </CardContent>
    </Card>
  );
}
