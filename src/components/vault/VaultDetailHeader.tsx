
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VaultDetailHeaderProps {
  vaultName: string;
  styles: {
    gradientText: string;
  };
}

export function VaultDetailHeader({ vaultName, styles }: VaultDetailHeaderProps) {
  const navigate = useNavigate();
  
  const getRiskBadge = () => {
    if (vaultName.includes('SUI-USDC')) {
      return {
        text: 'Low Risk',
        variant: 'success' as const
      };
    } else if (vaultName.includes('Cetus')) {
      return {
        text: 'Moderate Risk',
        variant: 'warning' as const
      };
    } else {
      return {
        text: 'High Risk',
        variant: 'error' as const
      };
    }
  };

  const riskBadge = getRiskBadge();
  
  return (
    <div className="mb-10 mt-10 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-6 mt-2 flex items-center gap-2 text-text-secondary hover:text-text-primary font-medium text-sm" 
        onClick={() => navigate('/vaults')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Vaults
      </Button>
      <div className="flex items-center justify-between">
        <h1 className={`text-h1 ${styles.gradientText}`}>
          {vaultName}
        </h1>
        <Badge variant={riskBadge.variant} className="flex items-center gap-1.5 text-caption">
          <ShieldCheck className="h-4 w-4" />
          {riskBadge.text}
        </Badge>
      </div>
    </div>
  );
}
