
import { useState, useEffect, useRef } from 'react';
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer } from 'recharts';

interface KpiTileProps {
  title: string;
  value: number;
  delta?: number;
  series?: { value: number }[];
  prefix?: string;
  isLoading?: boolean;
  valueColor?: string;
}

export function KpiTile({ 
  title, 
  value, 
  delta, 
  series = [], 
  prefix = "$", 
  isLoading = false,
  valueColor = "text-white" 
}: KpiTileProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const hasMounted = useRef(false);
  
  useEffect(() => {
    if (isLoading) return;
    
    if (!hasMounted.current) {
      hasMounted.current = true;
      setDisplayValue(0);
      
      const duration = 600; // ms
      const startTime = performance.now();
      const animateCount = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Use easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setDisplayValue(Math.floor(easeOutQuart * value));
        
        if (progress < 1) {
          requestAnimationFrame(animateCount);
        } else {
          setDisplayValue(value);
        }
      };
      
      requestAnimationFrame(animateCount);
    } else {
      setDisplayValue(value);
    }
  }, [value, isLoading]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  return (
    <Card className="glass-card relative overflow-hidden h-[120px]">
      <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] to-transparent"></div>
      <div className="relative p-4 z-10">
        {isLoading ? (
          <>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-7 w-32 mb-2" />
            <Skeleton className="h-4 w-16" />
          </>
        ) : (
          <>
            <p className="text-xs uppercase tracking-wide text-white/60 font-medium mb-1">
              {title}
            </p>
            <p className={`font-mono text-[22px] font-medium ${valueColor} animate-count-up`}>
              {prefix}{formatCurrency(displayValue)}
            </p>
            {delta !== undefined && (
              <div className={`text-xs font-mono mt-1 inline-flex items-center ${delta >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                {delta >= 0 ? '▲' : '▼'} {prefix}{formatCurrency(Math.abs(delta))}
                <span className="text-white/40 ml-1">24h</span>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Mini sparkline */}
      {!isLoading && series && series.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-[30px] opacity-50">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={delta === undefined ? "#FFFFFF" : delta >= 0 ? "#10B981" : "#EF4444"} 
                strokeWidth={1}
                dot={false}
                isAnimationActive={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
                animationDuration={700}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
