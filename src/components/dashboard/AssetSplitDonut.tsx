
import { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { UserInvestment } from '@/types/vault';

interface AssetSplitDonutProps {
  investments?: UserInvestment[];
  isLoading?: boolean;
}

export function AssetSplitDonut({ investments, isLoading = false }: AssetSplitDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const data = useMemo(() => {
    if (!investments || investments.length === 0) return [];
    
    return investments.map(inv => {
      let color;
      let name;
      
      if (inv.vaultId.includes('deep')) {
        color = '#FF8800';
        name = 'DEEP-SUI';
      } else if (inv.vaultId.includes('cetus')) {
        color = '#F59E0B';
        name = 'CETUS-SUI';
      } else {
        color = '#10B981';
        name = 'SUI-USDC';
      }
      
      return {
        name,
        value: inv.currentValue,
        color
      };
    });
  }, [investments]);
  
  const totalValue = useMemo(() => {
    return data.reduce((sum, item) => sum + item.value, 0);
  }, [data]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleMouseEnter = (_, index: number) => {
    setActiveIndex(index);
  };
  
  const handleMouseLeave = () => {
    setActiveIndex(null);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(1);
      
      return (
        <div className="glass-card p-2 shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="font-mono">{formatCurrency(data.value)} ({percentage}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="glass-card h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <circle cx="12" cy="12" r="10" stroke="#FF8800" strokeWidth="2" />
            <path
              d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22"
              stroke="#F59E0B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M12 2C17.52 2 22 6.48 22 12C22 17.52 17.52 22 12 22"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Asset Split
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {isLoading ? (
          <div className="w-full h-[200px] flex items-center justify-center">
            <Skeleton className="w-[200px] h-[200px] rounded-full" />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                isAnimationActive={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    strokeWidth={index === activeIndex ? 2 : 0}
                    stroke="#fff"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-[200px] flex items-center justify-center text-white/60">
            No investments to display
          </div>
        )}
      </CardContent>
    </Card>
  );
}
