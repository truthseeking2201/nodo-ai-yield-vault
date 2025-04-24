
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface VaultDetailHeaderProps {
  vaultName: string;
  styles: {
    gradientText: string;
  };
}

export function VaultDetailHeader({ vaultName, styles }: VaultDetailHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mb-10 mt-10">
      <Button 
        variant="ghost" 
        className="mb-4 mt-2 rounded-xl flex items-center gap-2 text-[#C9CDD3] hover:text-white font-medium text-xs tracking-wide" 
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4" /> Back to Vaults
      </Button>
      <h1 className={`text-3xl md:text-4xl font-bold ${styles.gradientText}`}>
        {vaultName} Vault
      </h1>
    </div>
  );
}
