
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

interface VaultPerformanceChartProps {
  data: { date: string; value: number }[];
  timeRange?: "daily" | "weekly" | "monthly";
  onTimeRangeChange?: (value: "daily" | "weekly" | "monthly") => void;
  styles?: {
    gradientText?: string;
    gradientBg?: string;
    shadow?: string;
    bgOpacity?: string;
  };
  vaultType?: "emerald" | "orion" | "nova";
  showAxisLabels?: boolean;
  highlightLastDataPoint?: boolean;
}

const formatDate = (date: string, range: string) => {
  const d = new Date(date);
  if (range === "daily") {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (range === "weekly") {
    return d.toLocaleDateString([], { weekday: 'short' });
  } else {
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }
};

const formatValue = (value: number) => {
  return `${value.toFixed(2)}%`;
};

const getAnimationDuration = () => {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    ? 0 
    : 1500;
};

const getChartColor = (vaultType?: string, styles?: { gradientBg?: string }) => {
  if (styles?.gradientBg) {
    if (styles.gradientBg.includes('emerald')) return '#10B981';
    if (styles.gradientBg.includes('orion')) return '#F59E0B';
    if (styles.gradientBg.includes('nova')) return '#F97316';
    if (styles.gradientBg.includes('#F59E0B')) return '#F59E0B';
  }
  
  switch (vaultType) {
    case 'emerald': return '#10B981';
    case 'orion': return '#F59E0B'; 
    case 'nova': return '#F97316';
    default: return '#F59E0B'; // Default to the new orange color
  }
};

export const VaultPerformanceChart: React.FC<VaultPerformanceChartProps> = ({
  data,
  timeRange = "daily",
  onTimeRangeChange,
  styles = {},
  vaultType,
  showAxisLabels = true,
  highlightLastDataPoint = true
}) => {
  const chartColor = getChartColor(vaultType, styles);
  
  const initialValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const percentageChange = ((lastValue - initialValue) / initialValue) * 100;
  const isPositive = percentageChange >= 0;

  const customizedDot = (props: any) => {
    const { cx, cy, index } = props;
    const isLast = index === data.length - 1;

    if (!highlightLastDataPoint || !isLast) return null;

    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={6}
        stroke="transparent"
        fill={isPositive ? "#10B981" : "#EF4444"}
      />
    );
  };

  const chartData = React.useMemo(() => {
    return data.map(item => ({
      ...item,
      dateFormatted: formatDate(item.date, timeRange),
    }));
  }, [data, timeRange]);

  const animationDuration = getAnimationDuration();

  // Simple chart version (for when no time range change is available)
  if (!onTimeRangeChange) {
    return (
      <div className="rounded-[20px] overflow-visible vault-chart pb-6">
        <ResponsiveContainer width="100%" height={276}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 10, left: 10, bottom: 24 }}
          >
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false} 
              stroke="rgba(255,255,255,0.06)" 
            />
            
            {showAxisLabels && (
              <>
                <XAxis 
                  dataKey="dateFormatted" 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'IBM Plex Mono' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  dy={8} // Increase spacing between labels and axis line
                />
                
                <YAxis 
                  tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'IBM Plex Mono' }} 
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickFormatter={formatValue}
                  tickLine={false}
                  domain={['auto', 'auto']}
                />
              </>
            )}
            
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg text-xs">
                      <div className="font-mono font-medium text-white">{payload[0].payload.dateFormatted}</div>
                      <div className="font-mono font-medium text-[#10B981]">{formatValue(payload[0].value as number)}</div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGradient)"
              animationDuration={animationDuration} 
              animationEasing="ease"
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: chartColor }}
              animationDuration={animationDuration}
              animationEasing="ease"
              isAnimationActive={animationDuration > 0}
              animationBegin={0}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
  
  // Full chart version with tabs
  return (
    <Card className="glass-card rounded-[20px] overflow-visible border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <CardHeader className="px-6 pt-6 pb-0 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-[#E5E7EB]">Performance</CardTitle>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-mono font-medium ${isPositive ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
            </span>
            <span className="text-[#9CA3AF] text-xs">
              {timeRange === 'daily' ? '24h' : timeRange === 'weekly' ? '7d' : '30d'}
            </span>
          </div>
        </div>
        
        <Tabs value={timeRange} onValueChange={(v) => onTimeRangeChange(v as any)} className="ml-auto">
          <TabsList className="bg-[#1F2937]/30 border border-white/[0.06] h-8">
            <TabsTrigger 
              value="daily" 
              className="text-xs px-3 h-6 data-[state=active]:bg-[#3B4455] data-[state=active]:text-white"
            >
              24H
            </TabsTrigger>
            <TabsTrigger 
              value="weekly" 
              className="text-xs px-3 h-6 data-[state=active]:bg-[#3B4455] data-[state=active]:text-white"
            >
              7D
            </TabsTrigger>
            <TabsTrigger 
              value="monthly" 
              className="text-xs px-3 h-6 data-[state=active]:bg-[#3B4455] data-[state=active]:text-white"
            >
              30D
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-6 pb-8 h-[300px] md:h-[300px] vault-chart">
        <div className="h-full w-full overflow-visible">
          <ResponsiveContainer width="100%" height={276}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 0, left: 0, bottom: 24 }}
            >
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="rgba(255,255,255,0.06)" 
              />
              
              <XAxis 
                dataKey="dateFormatted" 
                tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'IBM Plex Mono' }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                dy={8} // Increase spacing between labels and axis line
              />
              
              <YAxis 
                tick={{ fill: '#9CA3AF', fontSize: 12, fontFamily: 'IBM Plex Mono' }} 
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickFormatter={formatValue}
                tickLine={false}
                domain={['auto', 'auto']}
              />
              
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[rgba(255,255,255,0.04)] border border-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg text-xs">
                        <div className="font-mono font-medium text-white">{payload[0].payload.dateFormatted}</div>
                        <div className="font-mono font-medium text-[#10B981]">{formatValue(payload[0].value as number)}</div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              
              <Area
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorGradient)"
                animationDuration={animationDuration} 
                animationEasing="ease"
              />
              
              <Line
                type="monotone"
                dataKey="value"
                stroke={chartColor}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, fill: chartColor }}
                animationDuration={animationDuration}
                animationEasing="ease"
                isAnimationActive={animationDuration > 0}
                animationBegin={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
