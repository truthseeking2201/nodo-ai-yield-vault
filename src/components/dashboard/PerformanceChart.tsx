
import { useState, useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartData {
  date: string;
  value: number;
  profit?: number;
  deposit?: number; // To mark deposit events
}

interface PerformanceChartProps {
  data: ChartData[];
  isLoading?: boolean;
}

export function PerformanceChart({ data, isLoading }: PerformanceChartProps) {
  const [viewMode, setViewMode] = useState<'value' | 'profit'>('value');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const enhancedData = useMemo(() => {
    // If we don't have initial profit values, calculate them
    if (data && data[0] && !data[0].profit) {
      let initialValue = data[0].value;
      return data.map(point => ({
        ...point,
        profit: point.value - initialValue
      }));
    }
    return data;
  }, [data]);

  // Calculate the minimum and maximum values for the y-axis
  const yDomain = useMemo(() => {
    if (!enhancedData || enhancedData.length === 0) return [0, 100];

    const values = enhancedData.map(d => viewMode === 'value' ? d.value : (d.profit || 0));
    const min = Math.min(...values) * 0.95;
    const max = Math.max(...values) * 1.05;
    
    return [min, max];
  }, [enhancedData, viewMode]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#12100F] p-3 border border-white/10 rounded-lg shadow-xl">
          <p className="text-xs text-white/60 mb-1">
            {formatXAxis(label)}
          </p>
          <p className="font-mono text-sm font-medium">
            {formatCurrency(data[viewMode])}
          </p>
          {data.deposit && (
            <p className="text-xs text-nova mt-1">Deposit: {formatCurrency(data.deposit)}</p>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomDot = (props: any) => {
    const { cx, cy, stroke, payload, index } = props;
    
    // Show special marker for deposit points
    if (payload.deposit) {
      return (
        <svg x={cx - 6} y={cy - 6} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="6" cy="6" r="6" fill="#FF8800" />
          <circle cx="6" cy="6" r="2" fill="#FFFFFF" />
        </svg>
      );
    }
    
    // Don't show regular dots
    return null;
  };

  return (
    <Card className="glass-card p-0 overflow-hidden mb-8">
      <div className="p-5 pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/10">
        <div className="mb-4 sm:mb-0">
          <h3 className="text-lg font-bold flex items-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2"
            >
              <path
                d="M21 21H4C3.44772 21 3 20.5523 3 20V3"
                stroke="#FF8800"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M20 8L16.0001 12L12 8L8 12L4 8"
                stroke="#FF8800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Portfolio Performance
          </h3>
          <p className="text-sm text-white/60">30-day overview of your investments</p>
        </div>
        
        <div className="flex p-1 bg-white/5 rounded-full self-end">
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full h-8 px-4 ${viewMode === 'value' ? 'bg-nova text-white' : ''}`}
            onClick={() => setViewMode('value')}
          >
            Value
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`rounded-full h-8 px-4 ${viewMode === 'profit' ? 'bg-nova text-white' : ''}`}
            onClick={() => setViewMode('profit')}
          >
            Profit
          </Button>
        </div>
      </div>

      <div className="p-5 pt-0 h-[300px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-[250px] mt-4" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={enhancedData}
              margin={{ top: 20, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis
                domain={yDomain}
                tickFormatter={formatCurrency}
                stroke="rgba(255,255,255,0.3)"
                tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey={viewMode}
                stroke={viewMode === 'profit' ? "#10B981" : "#FF8800"}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6, fill: viewMode === 'profit' ? "#10B981" : "#FF8800" }}
                isAnimationActive={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
                animationDuration={700}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
