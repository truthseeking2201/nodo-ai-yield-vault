
import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";

interface ChartData {
  date: string;
  value: number;
}

interface VaultPerformanceChartProps {
  data: ChartData[];
  vaultType: 'nova' | 'orion' | 'emerald';
}

export function VaultPerformanceChart({ data, vaultType }: VaultPerformanceChartProps) {
  // Get color based on vault type
  const getColor = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova': return "#F97316";
      case 'orion': return "#F59E0B";
      case 'emerald': return "#10B981";
    }
  };

  const color = getColor(vaultType);

  // Memoize gradient ID to prevent re-rendering issues
  const gradientId = useMemo(() => `gradient-${vaultType}-${Math.random().toString(36).substring(2, 9)}`, [vaultType]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border border-white/20">
          <p className="text-sm font-medium mb-1">{label}</p>
          <p className="text-sm font-mono" style={{ color }}>
            {`Value: ${payload[0].value?.toFixed(2)}`}
          </p>
        </div>
      );
    }
  
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis 
          dataKey="date" 
          stroke="rgba(255,255,255,0.6)" 
          fontSize={12}
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
          stroke="rgba(255,255,255,0.6)" 
          fontSize={12}
          tickMargin={10}
          domain={['dataMin - 1', 'dataMax + 1']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2.5}
          activeDot={{ r: 6 }}
          fill={`url(#${gradientId})`}
          fillOpacity={0.2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
