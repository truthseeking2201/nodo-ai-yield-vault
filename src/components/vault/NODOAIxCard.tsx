import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink, Info, HelpCircle } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { TokenIcon } from "@/components/shared/TokenIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
            <Popover>
              <PopoverTrigger asChild>
                <button className="cursor-help">
                  <HelpCircle className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] bg-black/80 backdrop-blur-xl border-white/10 text-white space-y-4 p-6">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold">What is NODOAIx?</h3>
                  <p className="text-sm text-white/70">
                    NODOAIx is an AI-optimized yield certificate that represents your deposit 
                    in our advanced vault strategy. It's not just a token, but a smart investment 
                    vehicle powered by our neural AI.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Features:</h4>
                  <ul className="list-disc list-inside text-sm text-white/70 space-y-1">
                    <li>Automatically compounds yields</li>
                    <li>AI-driven rebalancing for optimal returns</li>
                    <li>Locked for a set period to maximize strategy effectiveness</li>
                    <li>1 NODOAIx = 1 USDC + accrued yield</li>
                  </ul>
                </div>
                <div className="text-xs text-white/50 italic">
                  Note: Upon redemption, you'll receive USDC for the full value of your NODOAIx.
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">1 NODOAIx = 1 USDC + accrued fees</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-5">
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
