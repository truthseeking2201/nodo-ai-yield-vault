
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ExternalLink } from "lucide-react";

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
  // Calculate days until unlock
  const daysUntilUnlock = () => {
    const now = new Date();
    const diffTime = Math.abs(unlockTime.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Calculate profit or loss
  const profit = balance - principal;
  const isProfitable = profit >= 0;

  return (
    <Card className="glass-card overflow-hidden">
      <div className={`h-1 ${styles.gradientBg}`}></div>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span className={`${styles.gradientText}`}>NODOAIx Token</span>
          <div className="flex items-center text-xs text-white/60">
            <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
            <span>Verified</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-1">
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
        
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex justify-between text-sm">
            <span>Unlock Progress</span>
            <span>{unlockProgress}%</span>
          </div>
          <Progress value={unlockProgress} className="h-1.5" />
          <div className="flex justify-between text-xs text-white/60">
            <span>Locked</span>
            <span>Unlocks {formatDate(unlockTime)} ({daysUntilUnlock()} days)</span>
          </div>
        </div>
        
        <div className="pt-2 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-white/60">Holders: {holderCount.toLocaleString()}</span>
            <a 
              href={auditUrl} 
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline flex items-center"
            >
              View Audit <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
          
          <Button variant="outline" size="sm" className="w-full text-xs border-white/20">
            <span className="font-mono mr-1">{contractAddress.substring(0, 10)}...</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
