import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { TokenIcon } from "@/components/shared/TokenIcons";

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
  
  // Update countdown every minute
  useEffect(() => {
    const updateCountdown = () => {
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
    <Card className="glass-card overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-all duration-300 hover:translate-y-[-2px] hover:shadow-[0_8px_16px_-8px_rgba(255,136,0,0.25)]">
      <div className={`h-1 ${styles.gradientBg}`} />
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="flex items-center text-lg text-[#E5E7EB]">
          <TokenIcon token="NODOAIx" size={28} className="mr-2" />
          <span className={`${styles.gradientText}`}>NODOAIx Certificate</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Balance info with 3-column grid */}
        <div className="grid grid-cols-[auto_1fr_auto] gap-x-2 gap-y-2">
          <span className="text-[#9CA3AF] text-xs tracking-[-0.15px]">Balance</span>
          <span className="font-mono font-medium text-right text-[#E5E7EB] tabular-nums">
            {balance.toLocaleString()}
          </span>
          <span className="font-mono text-[#9CA3AF]">NODOAIx</span>
          
          <span className="text-[#9CA3AF] text-xs tracking-[-0.15px]">Principal</span>
          <span className="font-mono text-right text-[#C9CDD3] tabular-nums">
            {principal.toLocaleString()}
          </span>
          <span className="font-mono text-[#9CA3AF]">NODOAIx</span>
          
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-xs tracking-[-0.15px]">Profit/Loss</span>
            <span className={`font-mono text-right tabular-nums ${isProfitable ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isProfitable ? '+' : ''}{profit.toLocaleString()}
            </span>
            <span className="font-mono text-[#9CA3AF]">NODOAIx</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-xs tracking-[-0.15px]">Fees Collected</span>
            <span className="font-mono text-right text-[#10B981] tabular-nums">
              +{fees.toLocaleString()}
            </span>
            <span className="font-mono text-[#9CA3AF]">NODOAIx</span>
          </div>
        </div>
        
        {/* Unlock badge with improved styling */}
        <div 
          className="bg-[rgba(255,136,0,0.15)] rounded-full py-1.5 px-4 text-[11px] font-mono font-medium text-center text-[#F59E0B]" 
          aria-live="polite"
        >
          Unlocks in {timeUntilUnlock}
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
  );
}
