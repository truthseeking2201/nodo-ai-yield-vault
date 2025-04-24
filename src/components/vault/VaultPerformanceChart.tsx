
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

interface VaultPerformanceChartProps {
  data: ChartData[];
  vaultType: 'nova' | 'orion' | 'emerald';
  showAxisLabels?: boolean;
  highlightLastDataPoint?: boolean;
}

export function VaultPerformanceChart({ 
  data, 
  vaultType,
  showAxisLabels = true,
  highlightLastDataPoint = true
}: VaultPerformanceChartProps) {
  // Get color based on vault type
  const getColor = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova': return "#F97316";
      case 'orion': return "#F59E0B";
      case 'emerald': return "#10B981";
      default: return "#8F63FF"; // Default to brand light
    }
  };

  const color = getColor(vaultType);

  // Memoize gradient ID to prevent re-rendering issues
  const gradientId = useMemo(() => `gradient-${vaultType}-${Math.random().toString(36).substring(2, 9)}`, [vaultType]);

  // Calculate Y-axis ticks for even 25% intervals
  const yAxisTicks = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    
    // Create ticks at 5% intervals
    const ticks = [];
    const step = range / 5;
    for (let i = 0; i <= 5; i++) {
      ticks.push(min + (step * i));
    }
    
    return ticks;
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[rgba(255,255,255,0.04)] p-3 rounded-xl border border-white/10 shadow-[0_8px_16px_-8px_rgba(0,0,0,0.6)]">
          <p className="text-sm font-medium mb-1 font-sans">{label}</p>
          <p className="text-xs font-mono tabular-nums" style={{ color }}>
            {`Value: ${payload[0].value?.toFixed(2)}`}
          </p>
        </div>
      );
    }
  
    return null;
  };

  // Render a dot for the last data point if requested
  const renderDot = (props: any) => {
    const { cx, cy, index } = props;
    const isLast = index === data.length - 1;
    
    if (highlightLastDataPoint && isLast) {
      return (
        <circle 
          cx={cx} 
          cy={cy} 
          r={6} 
          fill="#10B981" 
          stroke="#fff" 
          strokeWidth={2} 
        />
      );
    }
    
    return null;
  };

  return (
    <div className="h-[260px] md:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 10,
            right: 20,
            left: showAxisLabels ? 20 : 10,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8F63FF" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8F63FF" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="rgba(255,255,255,0.06)" 
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF" 
            fontSize={12}
            fontFamily="'IBM Plex Mono', monospace"
            tickMargin={10}
            tickFormatter={(value) => {
              // Handle different date formats
              if (value.includes('Week') || value.includes('Month')) {
                return value;
              }
              // Format date to display day only or month/day
              const date = new Date(value);
              return date.getDate().toString();
            }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            fontFamily="'IBM Plex Mono', monospace"
            tickMargin={10}
            ticks={showAxisLabels ? yAxisTicks : undefined}
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(value) => value.toFixed(1)}
            width={showAxisLabels ? 40 : 30}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3'}}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#8F63FF"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 6 }}
            fill={`url(#${gradientId})`}
            fillOpacity={0.2}
            animationDuration={1000}
            animationEasing="cubic-bezier(.22,1,.36,1)"
          />
          {highlightLastDataPoint && (
            <Line
              type="monotone"
              dataKey="value"
              stroke="transparent"
              dot={renderDot}
              activeDot={false}
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
