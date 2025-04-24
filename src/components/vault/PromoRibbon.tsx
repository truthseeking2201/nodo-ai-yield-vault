
import { useEffect, useState } from "react";

interface PromoRibbonProps {
  active?: boolean;
  endTime?: Date;
  compact?: boolean;
}

export function PromoRibbon({ active = true, endTime, compact = false }: PromoRibbonProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isVisible, setIsVisible] = useState(active);
  
  const defaultEndTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const targetEndTime = endTime || defaultEndTime;
  
  useEffect(() => {
    if (!active) {
      setIsVisible(false);
      return;
    }
    
    const updateTimer = () => {
      const now = new Date();
      const diff = targetEndTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setIsVisible(false);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      if (compact) {
        const formattedTime = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0")
        ].join(":");
        
        setTimeLeft(formattedTime);
      } else {
        const formattedTime = [
          hours.toString().padStart(2, "0"),
          minutes.toString().padStart(2, "0"),
          seconds.toString().padStart(2, "0")
        ].join(":");
        
        setTimeLeft(formattedTime);
      }
    };
    
    updateTimer();
    
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [active, targetEndTime, compact]);
  
  if (!isVisible) return null;
  
  if (compact) {
    return (
      <div className="flex items-center gap-1 text-brand-orange-500 text-xs">
        <span className="font-mono">⚡ +0.5% boost · ends in {timeLeft}</span>
      </div>
    );
  }
  
  return (
    <div 
      className="w-full bg-gradient-to-r from-brand-orange-500/30 to-brand-orange-700/30 py-2 text-center text-sm animate-fade-in mb-6 rounded-lg border border-brand-orange-500/20"
      aria-live="polite"
    >
      ⚡ +0.5% APR boost ends in <span className="font-mono tabular-nums font-medium">{timeLeft}</span>
    </div>
  );
}
