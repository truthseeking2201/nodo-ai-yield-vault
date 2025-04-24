
import React from "react";
import { VaultCard } from "./VaultCard";
import { VaultData } from "@/types/vault";

interface VaultGridProps {
  vaults: VaultData[];
  isConnected: boolean;
  balance: { usdc: number; nodoaix: number };
  activeVaultId: string | null;
  onVaultHover: (id: string) => void;
}

export function VaultGrid({ 
  vaults, 
  isConnected, 
  balance,
  activeVaultId,
  onVaultHover 
}: VaultGridProps) {
  return (
    <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vaults.map((vault: VaultData) => (
        <VaultCard 
          key={vault.id} 
          vault={vault} 
          isConnected={isConnected} 
          hasBalance={balance.usdc > 0}
          isActive={activeVaultId === vault.id}
          onHover={() => onVaultHover(vault.id)}
        />
      ))}
    </div>
  );
}
