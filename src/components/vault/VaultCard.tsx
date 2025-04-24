
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Info, TrendingUp, Clock } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { VaultData } from "@/types/vault";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

interface VaultCardProps {
  vault: VaultData;
  isConnected: boolean;
  hasBalance: boolean;
  isActive: boolean;
  onHover: () => void;
}

export function VaultCard({ 
  vault, 
  isConnected, 
  hasBalance, 
  isActive,
  onHover 
}: VaultCardProps) {
  const [showCalculator, setShowCalculator] = useState(false);
  const [amount, setAmount] = useState(1000);
  const [sliderValue, setSliderValue] = useState<number[]>([1000]);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Get the gradient classes based on vault type
  const getVaultStyles = (type: 'nova' | 'orion' | 'emerald') => {
    switch (type) {
      case 'nova':
        return {
          gradientText: 'gradient-text-nova',
          gradientBg: 'gradient-bg-nova',
          shadow: 'hover:shadow-neon-nova',
          accent: 'text-nova',
          border: 'border-nova/30',
        };
      case 'orion':
        return {
          gradientText: 'gradient-text-orion',
          gradientBg: 'gradient-bg-orion',
          shadow: 'hover:shadow-neon-orion',
          accent: 'text-orion',
          border: 'border-orion/30',
        };
      case 'emerald':
        return {
          gradientText: 'gradient-text-emerald',
          gradientBg: 'gradient-bg-emerald',
          shadow: 'hover:shadow-neon-emerald',
          accent: 'text-emerald',
          border: 'border-emerald/30',
        };
    }
  };

  const styles = getVaultStyles(vault.type);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Calculate ROI
  const calculateMonthlyReturn = (): string => {
    const principal = amount || 0;
    const monthlyReturn = (principal * (vault.apr / 100)) / 12;
    return monthlyReturn.toFixed(2);
  };

  const calculateAnnualReturn = (): string => {
    const principal = amount || 0;
    const annualReturn = principal * (vault.apr / 100);
    return annualReturn.toFixed(2);
  };

  // Get unlock date
  const getUnlockDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Handle amount change
  const handleSliderChange = (values: number[]) => {
    setSliderValue(values);
    setAmount(values[0]);
  };

  // Get appropriate button text based on user state
  const getButtonProps = () => {
    if (isConnected && hasBalance) {
      return {
        text: "Deposit Now",
        variant: "default",
        className: `w-full h-12 ${styles.gradientBg}`
      };
    }
    return {
      text: "View Vault Details",
      variant: "outline" as const,
      className: "w-full h-12 border-white/20"
    };
  };

  const buttonProps = getButtonProps();

  return (
    <TooltipProvider>
      <Card 
        className={`glass-card transition-all duration-300 ${isActive ? styles.shadow : ''}`}
        onMouseEnter={() => {
          setShowCalculator(true);
          onHover();
        }}
        onMouseLeave={() => setShowCalculator(false)}
        ref={cardRef}
      >
        <CardHeader className="p-4 pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">
              {vault.name}
            </CardTitle>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Shield className={`h-4 w-4 ${styles.accent}`} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-semibold text-xs">Audit ✓ WatchPUG, Feb 2025</p>
                  <p className="text-xs">Smart contract verified and audited for security</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <CardDescription className="text-white/60 text-xs truncate">
            {vault.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-3 space-y-4">
          {/* Metrics row with consistent grid */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="text-[11px] text-[#9CA3AF] flex items-center gap-1 h-5">
                APR
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-white/40 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-[200px]">
                    APR has risen 0.5% in last 24h · Gas ≈ 0.006 SUI
                  </TooltipContent>
                </Tooltip>
              </p>
              <p className="text-sm font-mono font-bold text-[#9b87f5]">
                {formatPercentage(vault.apr)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] h-5">APY</p>
              <p className="text-sm font-mono font-bold text-teal-400">
                {formatPercentage(vault.apy)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[#9CA3AF] h-5">TVL</p>
              <p className="text-sm font-mono font-bold text-[#8E9196]">
                {formatCurrency(vault.tvl)}
              </p>
            </div>
          </div>
          
          {/* Change indicator - Always visible but minimalist */}
          <div className="flex justify-between items-center">
            <span className="text-[11px] text-white/60">
              +0.5% today
            </span>
            <div className="h-3 w-16 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-green-400/80 to-green-600/80"></div>
            </div>
          </div>

          {/* Collapsible ROI calculator - only shown on hover */}
          {showCalculator && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[#9CA3AF]">ROI Calculator</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-[#9CA3AF]">USDC</span>
                  <input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, '') || '0');
                      setAmount(val);
                      setSliderValue([val]);
                    }}
                    className="w-16 h-6 text-xs bg-white/10 border-white/20 rounded px-1 text-right"
                  />
                </div>
              </div>
              <Slider
                value={sliderValue}
                min={100}
                max={10000}
                step={100}
                className="[&_.relative]:h-[2px] [&_.absolute]:bg-[#6F3BFF] [&_button]:h-3 [&_button]:w-3"
                onValueChange={handleSliderChange}
              />
              <div className="grid grid-cols-2 text-center text-xs">
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">Monthly</p>
                  <p className="text-teal-400">${calculateMonthlyReturn()}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[#9CA3AF]">Annual</p>
                  <p className="text-teal-400">${calculateAnnualReturn()}</p>
                </div>
              </div>
            </div>
          )}

          {/* Button with hover card for unlock details */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button 
                variant={buttonProps.variant as "default" | "outline"} 
                className={buttonProps.className}
                asChild
              >
                <Link to={`/vaults/${vault.id}`}>
                  {buttonProps.text} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <span className="text-sm">Unlocks in 30 days ({getUnlockDate()})</span>
                </div>
                <div className="text-xs text-white/60">
                  Gas fee: approximately 0.006 SUI
                </div>
                {isConnected && (
                  <div className="text-xs text-yellow-400 flex items-center gap-1 mt-2">
                    <TrendingUp className="h-3 w-3" />
                    <span>First Deposit Bonus +100 pts</span>
                  </div>
                )}
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
