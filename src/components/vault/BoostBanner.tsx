
import { useState } from "react";
import { X, Zap } from "lucide-react";

interface BoostBannerProps {
  boostAmount?: string;
  timeRemaining?: string;
  onDismiss?: () => void;
}

export function BoostBanner({ 
  boostAmount = "+0.5%", 
  timeRemaining = "01:59:34",
  onDismiss
}: BoostBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);
  
  if (isDismissed) return null;
  
  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  return (
    <div className="bg-gradient-to-r from-brand-orange-500/10 to-brand-orange-500/5 border border-brand-orange-500/20 backdrop-blur-md rounded-xl py-2 px-4 mb-4 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-brand-orange-500" />
        <span className="text-sm text-brand-orange-500 font-medium">
          {boostAmount} APR boost ends in <span className="font-mono">{timeRemaining}</span>
        </span>
      </div>
      <button 
        onClick={handleDismiss}
        className="text-text-tertiary hover:text-text-secondary transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
