
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    <Card className="glass-card overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.04] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className={`h-1 ${styles.gradientBg}`} />
      <CardHeader className="pb-2 px-6 pt-6">
        <CardTitle className="flex items-center text-lg">
          <TokenIcon token="NODOAIx" size={28} className="mr-2" />
          <span className={`${styles.gradientText}`}>NODOAIx Token</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-3">
        {/* Balance and Principal info */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Balance</span>
            <span className="font-mono font-bold">
              {balance.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Principal</span>
            <span className="font-mono">
              {principal.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Profit/Loss</span>
            <span className={`font-mono ${isProfitable ? 'text-green-500' : 'text-red-500'}`}>
              {isProfitable ? '+' : ''}{profit.toLocaleString()} NODOAIx
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-white/60 text-sm">Fees Collected</span>
            <span className="font-mono text-green-500">
              +{fees.toLocaleString()} NODOAIx
            </span>
          </div>
        </div>
        
        {/* Holders count and unlock info */}
        <div>
          <div className="text-sm text-white/60 mb-3">
            {holderCount.toLocaleString()} holders
          </div>
          
          <div className="text-sm mb-3">
            Current value represents 1:1 ratio with governance token.
          </div>
          
          <div className="relative ml-6 w-[90%] h-px bg-[#293040]" />
          
          <div className="mt-3 mb-4 text-sm text-white/60">
            1:1 peg maintained by automated market operations
          </div>
        </div>
        
        {/* Unlock badge */}
        <div className="bg-white/10 rounded-full py-2 px-4 text-sm font-medium text-center" aria-live="polite">
          Unlocks in {timeUntilUnlock}
        </div>
        
        {/* Audit and contract info */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center text-white/60">
              <ShieldCheck className="h-4 w-4 mr-1.5" />
              <span>Audited</span>
            </div>
            <a 
              href={auditUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              View Audit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full text-xs border-white/20 h-12"
          >
            <span className="font-mono mr-1">{contractAddress.substring(0, 10)}...</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
