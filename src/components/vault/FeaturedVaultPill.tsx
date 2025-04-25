
import { useQuery } from "@tanstack/react-query";
import { vaultService } from "@/services/vaultService";

export function FeaturedVaultPill() {
  const { data: vaults, isLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: vaultService.getAllVaults,
  });

  if (isLoading || !vaults || vaults.length === 0) return null;
  
  // Calculate median APR
  const aprs = vaults.map(vault => vault.apr);
  const sortedAprs = [...aprs].sort((a, b) => a - b);
  const medianIndex = Math.floor(sortedAprs.length / 2);
  const medianAPR = sortedAprs.length % 2 === 0
    ? (sortedAprs[medianIndex - 1] + sortedAprs[medianIndex]) / 2
    : sortedAprs[medianIndex];
  
  // Find featured vault (APR ≥ 20% above median)
  const featuredThreshold = medianAPR * 1.2;
  const featuredVault = vaults.find(vault => vault.apr >= featuredThreshold);
  
  if (!featuredVault) return null;
  
  // Random number of new investors (would be real data in production)
  const newInvestors = Math.floor(Math.random() * 200) + 50;
  
  return (
    <div className="text-[13px] text-[#A1A1AA] mt-2 mb-6 animate-fade-in">
      🏆 Featured Vault: <span className="font-medium text-white">{featuredVault.name}</span>{' '}
      <span className="text-nova">(+{featuredVault.apr.toFixed(1)}% APR)</span> — {' '}
      {newInvestors} new LPs this week
    </div>
  );
}
