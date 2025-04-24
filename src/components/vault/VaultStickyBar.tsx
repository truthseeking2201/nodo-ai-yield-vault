
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wallet } from "lucide-react";

interface VaultStickyBarProps {
  isConnected: boolean;
  styles: {
    gradientBg: string;
    shadow: string;
  };
  onActionClick: () => void;
}

export function VaultStickyBar({ isConnected, styles, onActionClick }: VaultStickyBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/60 backdrop-blur-[4px] border-t border-white/10 md:hidden">
      <div className="max-w-[640px] mx-auto">
        <Button 
          className={`w-full h-14 ${styles.gradientBg} ${styles.shadow} transition-transform duration-80 hover:scale-[1.02] active:scale-95`}
          onClick={onActionClick}
        >
          {isConnected ? (
            <>Deposit USDC <ArrowRight className="ml-2 h-4 w-4" /></>
          ) : (
            <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
