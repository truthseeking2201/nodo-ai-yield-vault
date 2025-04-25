
import { useEffect, useState } from "react";

interface PromoRibbonProps {
  active?: boolean;
  endTime?: Date;
}

export function PromoRibbon({ active = true, endTime }: PromoRibbonProps) {
  const [timeLeft, setTimeLeft] = useState("");
  const [isVisible, setIsVisible] = useState(active);
  
  // Default end time is 2 hours from now if not provided
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
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const formattedTime = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0")
      ].join(":");
      
      setTimeLeft(formattedTime);
    };
    
    // Update immediately
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [active, targetEndTime]);
  
  if (!isVisible) return null;
  
  return (
    <div 
      className="inline-flex items-center px-4 py-3 text-[13px] font-medium text-[#FF8A00] bg-[#FF8A00]/15 rounded-2xl animate-fade-in"
      aria-live="polite"
    >
      ⚡ +0.5% APR boost ends in <span className="font-mono font-semibold ml-2">{timeLeft}</span>
    </div>
  );
}
