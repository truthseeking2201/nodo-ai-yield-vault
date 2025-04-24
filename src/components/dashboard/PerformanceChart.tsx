
import { useState, useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceDot,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TransactionHistory } from '@/types/vault';

interface ChartData {
  date: string;
  value: number;
  profit?: number;
  deposit?: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  transactions?: TransactionHistory[];
  isLoading?: boolean;
  onTxClick?: (tx: TransactionHistory) => void;
}

export function PerformanceChart({ 
  data, 
  transactions = [], 
  isLoading = false,
  onTxClick 
}: PerformanceChartProps) {
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
    if (!data || data.length === 0) return [];
    
    // If we don't have initial profit values, calculate them
    if (data[0] && !data[0].profit) {
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

  // Find transactions to display as reference dots
  const transactionDots = useMemo(() => {
    if (!transactions || transactions.length === 0 || !enhancedData || enhancedData.length === 0) 
      return [];

    return transactions.map(tx => {
      // Find the chart point that corresponds to this transaction date
      const txDate = tx.timestamp.split('T')[0];
      const chartPoint = enhancedData.find(d => d.date === txDate);
      
      if (!chartPoint) return null;
      
      return {
        ...tx,
        x: txDate,
        y: viewMode === 'value' ? chartPoint.value : (chartPoint.profit || 0),
        color: tx.type === 'deposit' ? '#F59E0B' : '#10B981'
      };
    }).filter(Boolean);
  }, [transactions, enhancedData, viewMode]);

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
    <Card className="glass-card h-[300px] overflow-hidden">
      <CardHeader className="p-4 pb-0 flex flex-row justify-between items-center border-b border-white/10">
        <CardTitle className="text-lg flex items-center">
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
        </CardTitle>
        
        <div className="flex p-1 bg-white/5 rounded-full">
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
      </CardHeader>

      <CardContent className="p-0 h-[250px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <Skeleton className="w-full h-[200px] mt-4" />
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
              
              {/* Transaction markers */}
              {transactionDots.map((dot, index) => (
                <ReferenceDot
                  key={`tx-${index}`}
                  x={dot.x}
                  y={dot.y}
                  r={4}
                  fill={dot.color}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                  onClick={() => onTxClick && dot && onTxClick(dot)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
