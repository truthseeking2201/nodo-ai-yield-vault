
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface VaultDetailHeaderProps {
  vaultName: string;
  styles: {
    gradientText: string;
  };
}

export function VaultDetailHeader({ vaultName, styles }: VaultDetailHeaderProps) {
  const getRiskBadge = () => {
    if (vaultName.includes('SUI-USDC')) {
      return {
        text: 'Low Risk',
        class: 'bg-emerald/20 text-emerald'
      };
    } else if (vaultName.includes('Cetus')) {
      return {
        text: 'Moderate Risk',
        class: 'bg-orion/20 text-orion'
      };
    } else {
      return {
        text: 'High Risk',
        class: 'bg-nova/20 text-nova'
      };
    }
  };

  const riskBadge = getRiskBadge();
  
  return (
    <div className="mb-10 mt-10">
      <Link to="/">
        <Button 
          variant="ghost" 
          className="mb-4 mt-2 rounded-xl flex items-center gap-2 text-[#C9CDD3] hover:text-white font-medium text-xs tracking-wide"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Vaults
        </Button>
      </Link>
      <div className="flex items-center justify-between">
        <h1 className={`text-3xl md:text-4xl font-bold ${styles.gradientText}`}>
          {vaultName}
        </h1>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${riskBadge.class}`}>
          <ShieldCheck className="h-4 w-4" />
          {riskBadge.text}
        </div>
      </div>
    </div>
  );
}
