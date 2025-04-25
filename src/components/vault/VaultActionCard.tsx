
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Wallet } from "lucide-react";
import { useWallet } from "@/hooks/useWallet";

interface VaultActionCardProps {
  unlockProgress: number;
  isConnected: boolean;
  styles: {
    gradientBg: string;
    shadow: string;
  };
  onActionClick: () => void;
}

export function VaultActionCard({
  unlockProgress,
  isConnected,
  styles,
  onActionClick
}: VaultActionCardProps) {
  const { openWalletModal } = useWallet();

  const handleButtonClick = () => {
    if (!isConnected) {
      openWalletModal();
    } else {
      onActionClick();
    }
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>
          {unlockProgress > 0 ? "Unlocking Progress" : "Ready to Invest?"}
        </CardTitle>
        <CardDescription>
          {unlockProgress > 0 
            ? "Time remaining until your funds are available"
            : "Start earning yield on your assets"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {unlockProgress > 0 ? (
          <div className="space-y-2">
            <Progress value={unlockProgress} className="h-2" />
            <p className="text-sm text-white/60 text-center">
              Unlocks in {Math.ceil((100 - unlockProgress) / 100 * 30)} days
            </p>
          </div>
        ) : (
          <Button 
            className={`w-full ${styles.gradientBg} ${styles.shadow}`}
            onClick={handleButtonClick}
            data-wallet-connect={!isConnected}
          >
            {isConnected ? (
              <>Deposit Now <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              <>Connect Wallet <Wallet className="ml-2 h-4 w-4" /></>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
