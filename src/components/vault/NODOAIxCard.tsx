
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink, Info } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { TokenIcon } from "@/components/shared/TokenIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface NODOAIxCardProps {
  balance: number;
  principal: number;
  fees: number;
  unlockTime: Date;
  holderCount: number;
  contractAddress: string;
  auditUrl: string;
  styles: {
    gradientText: string;
    gradientBg: string;
    shadow: string;
    bgOpacity?: string;
  };
  unlockProgress?: number;
}

export function NODOAIxCard({
  balance,
  principal,
  fees,
  unlockTime,
  holderCount,
  contractAddress,
  auditUrl,
  styles,
  unlockProgress = 0
}: NODOAIxCardProps) {
  const [timeUntilUnlock, setTimeUntilUnlock] = useState<string>("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Update countdown every minute
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const isExpired = unlockTime <= now;
      
      if (isExpired) {
        setIsUnlocked(true);
        setTimeUntilUnlock("Unlocked");
        return;
      }
      
      setIsUnlocked(false);
      const distance = formatDistanceToNowStrict(unlockTime, { 
        unit: 'minute',
        roundingMethod: 'floor'
      });
      setTimeUntilUnlock(distance);
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, [unlockTime]);
  
  const profit = balance - principal;
  const isProfitable = profit >= 0;

  return (
    <TooltipProvider>
      <Card className="glass-card overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_16px_-8px_rgba(255,136,0,0.25)]">
        <div className={`h-1 ${styles.gradientBg}`} />
        <CardHeader className="pb-2 px-6 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <TokenIcon token="NODOAIx" size={28} className="mr-2" />
              <CardTitle className={`text-lg text-[#E5E7EB] ${styles.gradientText}`}>
                NODOAIx Certificate
              </CardTitle>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-white/60 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3 bg-white/10 backdrop-blur-lg text-sm">
                <p>
                  NODOAIx represents your deposit plus earned fees in this vault. 
                  Each token equals 1 USDC of value plus any accrued yield.
                  Upon redemption, you'll receive USDC for the full value.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">1 NODOAIx = 1 USDC + accrued fees</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
          {/* Balance info with 2-column grid */}
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2.5">
            <span className="text-[#9CA3AF] text-[13px] font-medium">Balance</span>
            <span className="font-mono font-medium text-right text-[#E5E7EB] text-lg tabular-nums">
              {balance.toLocaleString()} <span className="text-xs text-[#9CA3AF]">NODOAIx</span>
            </span>
            
            <span className="text-[#9CA3AF] text-[13px] font-medium">Principal</span>
            <span className="font-mono text-right text-[#C9CDD3] text-lg tabular-nums">
              {principal.toLocaleString()} <span className="text-xs text-[#9CA3AF]">NODOAIx</span>
            </span>
            
            <span className="text-[#9CA3AF] text-[13px] font-medium">Fees Earned</span>
            <span className="font-mono text-right text-[#10B981] text-lg tabular-nums">
              +{fees.toLocaleString()} <span className="text-xs text-[#9CA3AF]">NODOAIx</span>
            </span>
            
            <span className="text-[#9CA3AF] text-[13px] font-medium">Profit/Loss</span>
            <span className={`font-mono text-right text-lg tabular-nums ${isProfitable ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isProfitable ? '+' : ''}{profit.toLocaleString()} <span className="text-xs text-[#9CA3AF]">NODOAIx</span>
            </span>
          </div>
          
          {/* Unlock status */}
          <div className="flex flex-col items-center space-y-3">
            {isUnlocked ? (
              <>
                <div className="bg-[rgba(16,185,129,0.25)] rounded-full py-1.5 px-6 text-[13px] font-mono font-medium text-center text-emerald">
                  ✓ Unlocked - Ready to redeem
                </div>
                <Button 
                  variant="default"
                  className="w-full h-12 bg-gradient-to-r from-[#10B981] to-[#059669] hover:opacity-90 text-white text-base font-semibold"
                >
                  Redeem NODOAIx
                </Button>
              </>
            ) : (
              <div 
                className="bg-[rgba(255,136,0,0.2)] rounded-full py-1.5 px-6 text-[13px] font-mono font-medium text-center text-[#F59E0B]" 
                aria-live="polite"
              >
                🔒 Unlocks in {timeUntilUnlock}
              </div>
            )}
          </div>
          
          {/* Audit info with improved alignment */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-[#C9CDD3]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#10B981]" />
              <span>Audited by Certora</span>
            </div>
            <a 
              href={auditUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#F59E0B] hover:underline flex items-center gap-1"
            >
              View Audit
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          
          {/* Contract address with truncation */}
          <Button 
            variant="outline" 
            size="lg"
            className="w-full text-xs border-white/20 h-12 font-mono truncate"
          >
            <span className="font-mono truncate">{contractAddress}</span>
            <ExternalLink className="h-3 w-3 ml-1.5 flex-shrink-0" />
          </Button>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
