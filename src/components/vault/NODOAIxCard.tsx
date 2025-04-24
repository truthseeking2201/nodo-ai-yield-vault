
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
    <Card className="glass-card overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-shadow hover:shadow-[0_0_20px_-4px_rgba(111,59,255,0.15)]">
      <div className={`h-1 ${styles.gradientBg}`} />
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="flex items-center text-lg text-[#E5E7EB]">
          <TokenIcon token="NODOAIx" size={28} className="mr-2" />
          <span className={`${styles.gradientText}`}>NODOAIx Token</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        {/* Balance and Principal info */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-sm">Balance</span>
            <span className="font-mono font-medium text-[#E5E7EB]">
              {balance.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-sm">Principal</span>
            <span className="font-mono text-[#C9CDD3]">
              {principal.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-sm">Profit/Loss</span>
            <span className={`font-mono ${isProfitable ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              {isProfitable ? '+' : ''}{profit.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-[#9CA3AF] text-sm">Fees Collected</span>
            <span className="font-mono text-[#10B981]">
              +{fees.toLocaleString()} NODOAIx
            </span>
          </div>
        </div>
        
        {/* Holders count and unlock info */}
        <div className="py-2">
          <div className="relative w-[90%] mx-auto h-px bg-[#293040] my-4" />
          
          <div className="text-sm text-[#9CA3AF] mb-1">
            {holderCount.toLocaleString()} holders
          </div>
          
          <div className="text-sm text-[#C9CDD3] mb-4">
            Current value represents 1:1 ratio with governance token.
          </div>
        </div>
        
        {/* Unlock badge */}
        <div 
          className="bg-[#F59E0B1A] rounded-full py-2 px-4 text-sm font-mono font-medium text-center text-[#F59E0B]" 
          aria-live="polite"
        >
          Unlocks in {timeUntilUnlock}
        </div>
        
        {/* Audit and contract info */}
        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center text-[#C9CDD3]">
              <ShieldCheck className="h-4 w-4 mr-1.5 text-[#10B981]" />
              <span>Audited by Certora</span>
            </div>
            <a 
              href={auditUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8F63FF] hover:underline flex items-center"
            >
              View Audit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full text-xs border-white/20 h-12 font-mono"
          >
            <span className="font-mono mr-1">{contractAddress.substring(0, 10)}...</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
