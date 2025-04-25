
import React from "react";
import { Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AIIndicatorProps {
  vaultType: 'nova' | 'orion' | 'emerald';
  className?: string;
  showTooltip?: boolean;
}

export function AIIndicator({ vaultType, className = "", showTooltip = true }: AIIndicatorProps) {
  const getColorClass = () => {
    switch (vaultType) {
      case 'nova': return "text-nova";
      case 'orion': return "text-orion";
      case 'emerald': return "text-emerald";
      default: return "text-nova";
    }
  };

  const indicator = (
    <div className={`relative flex items-center ${className} neural-text-glow`}>
      <Brain size={16} className={`${getColorClass()}`} />
      <div className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 ${getColorClass()} bg-opacity-70 rounded-full animate-pulse`}></div>
    </div>
  );

  if (!showTooltip) return indicator;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {indicator}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] text-xs">
          <p>NODO AI is actively optimizing this vault for maximum yield and minimum risk</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
