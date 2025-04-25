
import React from "react";
import { Brain } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AIStatusIndicator() {
  return (
    <TooltipProvider>
      <div className="fixed bottom-24 right-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="bg-black/40 backdrop-blur-lg rounded-full p-2 border border-white/10 neural-glow cursor-help flex items-center gap-2">
              <div className="relative">
                <Brain size={18} className="text-nova" />
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-emerald rounded-full animate-pulse"></div>
              </div>
              <span className="mr-1 text-xs font-medium text-white/80">AI active</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[280px] text-xs">
            <div className="space-y-1">
              <p className="font-medium">NODO AI Engine is actively working</p>
              <p>AI is continuously monitoring market conditions, optimizing yield strategies, and adjusting positions to maximize returns while minimizing risk</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
