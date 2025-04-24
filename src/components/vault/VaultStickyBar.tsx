
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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-sm border-t border-white/10 md:hidden">
      <Button 
        className={`w-full ${styles.gradientBg} ${styles.shadow}`}
        onClick={onActionClick}
      >
        {isConnected ? (
          <>Deposit Now <ArrowRight className="ml-2 h-4 w-4" /></>
        ) : (
          <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
        )}
      </Button>
    </div>
  );
}
