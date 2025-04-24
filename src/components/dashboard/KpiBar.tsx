
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface KpiBarProps {
  portfolioValue: number;
  profit: number;
  averageAPR: number;
  isLoading?: boolean;
}

export function KpiBar({ portfolioValue, profit, averageAPR, isLoading = false }: KpiBarProps) {
  const [isSticky, setIsSticky] = useState(false);
  const [displayValue, setDisplayValue] = useState({
    portfolio: 0,
    profit: 0,
    apr: 0
  });

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animate values
  useEffect(() => {
    if (isLoading) return;
    
    const duration = 600; // ms
    const startTime = performance.now();
    
    const animateCount = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      setDisplayValue({
        portfolio: Math.floor(easeOutQuart * portfolioValue),
        profit: Math.floor(easeOutQuart * profit),
        apr: easeOutQuart * averageAPR
      });
      
      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setDisplayValue({
          portfolio: portfolioValue,
          profit: profit,
          apr: averageAPR
        });
      }
    };
    
    requestAnimationFrame(animateCount);
  }, [portfolioValue, profit, averageAPR, isLoading]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className={`w-full transition-all duration-300 z-10 mb-6 ${isSticky ? 'sticky top-0 py-2' : ''}`}>
      <Card className={`glass-card relative overflow-hidden transition-all ${isSticky ? 'shadow-lg' : ''}`}>
        <div className="absolute inset-0 bg-gradient-radial from-white/[0.03] to-transparent"></div>
        <div className="relative flex flex-wrap md:flex-nowrap justify-between items-center p-4 z-10">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-32" />
            </>
          ) : (
            <>
              <div className="flex items-baseline">
                <h3 className="text-xl font-mono font-medium mr-2">
                  {formatCurrency(displayValue.portfolio)}
                </h3>
                <span className={`text-sm font-mono ${profit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                  ({profit >= 0 ? '+' : ''}{((profit / (portfolioValue - profit)) * 100).toFixed(1)}%)
                </span>
              </div>
              
              <div className="flex items-baseline">
                <h3 className={`text-xl font-mono font-medium mr-2 ${profit >= 0 ? 'text-emerald' : 'text-red-500'}`}>
                  {profit >= 0 ? '+' : ''}{formatCurrency(displayValue.profit)}
                </h3>
                <span className="text-sm text-white/60">profit</span>
              </div>
              
              <div className="flex items-baseline">
                <h3 className="text-xl font-mono font-medium mr-2">
                  {displayValue.apr.toFixed(1)}%
                </h3>
                <span className="text-sm text-white/60">Avg APR</span>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
