
import { useState, useEffect } from "react";
import { Shield, Copy, HelpCircle, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface NODOAIxCardProps {
  balance: number;
  principal: number;
  fees: number;
  unlockTime?: Date;
  holderCount: number;
  contractAddress: string;
  auditUrl: string;
  styles: {
    gradientText: string;
    gradientBg: string;
    shadow: string;
  };
}

export function NODOAIxCard({
  balance,
  principal,
  fees,
  unlockTime,
  holderCount,
  contractAddress,
  auditUrl,
  styles
}: NODOAIxCardProps) {
  const { toast } = useToast();
  const [currentBalance, setCurrentBalance] = useState(balance);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const isLocked = unlockTime && new Date() < unlockTime;

  useEffect(() => {
    // Simulate balance counter animation
    const step = balance / 20;
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= balance) {
        setCurrentBalance(balance);
        clearInterval(interval);
      } else {
        setCurrentBalance(current);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [balance]);

  useEffect(() => {
    if (!unlockTime) return;

    const updateCountdown = () => {
      const now = new Date();
      const diff = unlockTime.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeLeft("");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours} h ${minutes} m`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [unlockTime]);

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    toast({
      description: "Contract address copied to clipboard",
    });
  };

  return (
    <Card className="glass-card hover:-translate-y-0.5 transition-all duration-80 mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald to-emerald-dark flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            NODOAIx Certificate
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  aria-label="Learn more about NODOAIx"
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px]">
                <div className="space-y-4">
                  <h4 className="font-medium text-lg">What is NODOAIx?</h4>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• 1 NODOAIx = your deposited USDC + fees earned by the AI Market-Making Agent.</li>
                    <li>• It's minted when you deposit and burned when you redeem.</li>
                    <li>
                      • Smart-contract address: {" "}
                      <a
                        href={`https://explorer.sui.io/address/${contractAddress}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald hover:underline"
                      >
                        {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
                      </a>
                    </li>
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </CardTitle>
          <p className="text-sm text-white/60">{holderCount.toLocaleString()} holders</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white/5 rounded-lg px-4 py-2">
          <span className="text-lg font-mono">
            You hold {currentBalance.toLocaleString()} NODOAIx
          </span>
        </div>
        
        <div className="space-y-1">
          <p className="text-white/80">
            Current value: {principal.toLocaleString()} USDC principal + {fees.toFixed(1)} USDC fees
          </p>
          <p className="text-sm text-white/60 flex items-center gap-2">
            1 NODOAIx always equals your deposit plus all yield generated
            <Check className="w-4 h-4 text-emerald" />
          </p>
        </div>

        {timeLeft && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-orion/20 text-orion text-sm">
            Unlocks in {timeLeft}
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-white/60">
          <a
            href={auditUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Shield className="w-4 h-4" />
            Audited
          </a>
          <button
            onClick={copyAddress}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
            {contractAddress.slice(0, 6)}...{contractAddress.slice(-4)}
          </button>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  className={cn(
                    "w-full",
                    isLocked ? "opacity-50 cursor-not-allowed" : styles.gradientBg
                  )}
                  disabled={isLocked}
                >
                  Redeem to USDC
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {isLocked 
                ? "Unlocks after countdown"
                : "Gas ≈ 0.006 SUI"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
