
import { useState } from "react";
import { UserInvestment } from "@/types/vault";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { LockupProgress } from "./LockupProgress";

interface VaultRowAccordionProps {
  investment: UserInvestment;
  onWithdraw: (investment: UserInvestment) => void;
}

export function VaultRowAccordion({ investment, onWithdraw }: VaultRowAccordionProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getVaultStyles = (vaultId?: string) => {
    if (!vaultId) return {
      textColor: 'text-white',
      iconColor: '#FFFFFF',
    };
    
    if (vaultId.includes('nova') || vaultId.includes('deep')) {
      return {
        textColor: 'text-nova',
        iconColor: '#F97316',
      };
    } else if (vaultId.includes('orion') || vaultId.includes('cetus')) {
      return {
        textColor: 'text-orion',
        iconColor: '#F59E0B',
      };
    } else {
      return {
        textColor: 'text-emerald',
        iconColor: '#10B981',
      };
    }
  };
  
  const formatVaultName = (vaultId: string) => {
    const nameMap = {
      'deep-sui': 'DEEP-SUI',
      'cetus-sui': 'CETUS-SUI',
      'sui-usdc': 'SUI-USDC'
    };
    return nameMap[vaultId] || vaultId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };
  
  const calculateDaysLeft = () => {
    const unlockDate = new Date(investment.unlockDate);
    const now = new Date();
    const diffTime = unlockDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  
  const styles = getVaultStyles(investment.vaultId);
  const daysLeft = calculateDaysLeft();
  const displayDays = investment.isWithdrawable 
    ? `Unlocked`
    : `${daysLeft} / ${investment.lockupPeriod} d · Locked`;
  
  // Estimate fees earned (simple calculation for demo purposes)
  const feesEarned = investment.profit * 0.75; // 75% of profit is from fees
  
  // APR estimate based on the profit compared to principal
  const aprEstimate = (investment.profit / investment.principal) * (365 / (investment.lockupPeriod - daysLeft)) * 100;
  
  return (
    <Accordion type="single" collapsible className="glass-card mb-4 overflow-hidden transition-all duration-150 ease-out border-white/10 hover:border-white/20 rounded-xl">
      <AccordionItem 
        value="item-1"
        className="border-0 overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'transform 0.15s cubic-bezier(.22,1,.36,1)'
        }}
      >
        <AccordionTrigger className="py-4 px-5 hover:no-underline">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.textColor} bg-white/5`}
                style={{ color: styles.iconColor }}
              >
                {investment.vaultId.includes('deep') || investment.vaultId.includes('nova') ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6V18M6 12H18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                ) : investment.vaultId.includes('cetus') || investment.vaultId.includes('orion') ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2.5"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 8H20M4 16H20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-[14px]">{formatVaultName(investment.vaultId)} Vault</p>
                <p className="text-white/60 text-xs">{displayDays}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono font-medium text-[14px]">
                {formatCurrency(investment.currentValue)}
              </p>
              <p className={`text-xs font-mono ${investment.profit > 0 ? 'text-emerald' : 'text-red-500'}`}>
                {investment.profit > 0 ? '▲' : '▼'} {formatCurrency(Math.abs(investment.profit))}
              </p>
            </div>
          </div>
        </AccordionTrigger>
        
        <AccordionContent className="px-5 pb-5 pt-0">
          <LockupProgress 
            daysLeft={daysLeft} 
            totalDays={investment.lockupPeriod} 
            isWithdrawable={investment.isWithdrawable}
          />
          
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Principal</p>
              <p className="font-mono text-[14px]">{formatCurrency(investment.principal)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">APR (avg)</p>
              <p className="font-mono text-[14px] text-emerald">{aprEstimate.toFixed(1)}%</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Fees Earned</p>
              <p className="font-mono text-[14px] text-emerald">{formatCurrency(feesEarned)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white/60 mb-1">Unlock Date</p>
              <p className="font-mono text-[14px]">{formatDate(investment.unlockDate)}</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <Button 
              variant="outline" 
              className="flex-1"
              disabled={true} // For demo purposes, add funds not implemented
            >
              Add Funds
            </Button>
            <Button 
              onClick={() => onWithdraw(investment)}
              disabled={!investment.isWithdrawable}
              className={`gradient-bg-${investment.vaultId.includes('deep') || investment.vaultId.includes('nova') ? 'nova' : 
                         investment.vaultId.includes('cetus') || investment.vaultId.includes('orion') ? 'orion' : 
                         'emerald'} flex-1`}
            >
              {!investment.isWithdrawable && <Lock className="mr-1.5 h-4 w-4" />}
              Withdraw
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
